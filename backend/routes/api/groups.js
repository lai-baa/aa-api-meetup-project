// backend/routes/api/groups.js

const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth, restoreUser } = require('../../utils/auth');
const { Group, Membership, GroupImage, User, Venue, sequelize } = require('../../db/models');

const router = express.Router();

// Validation middleware
const validateGroup = [
    check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 60 })
      .withMessage('Name must be 60 characters or less'),
    check('about')
      .exists({ checkFalsy: true })
      .isLength({ min: 50 })
      .withMessage('About must be 50 characters or more'),
    check('type')
      .exists({ checkFalsy: true })
      .isIn(['Online', 'In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
      .isBoolean()
      .withMessage('Private must be a boolean'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
    handleValidationErrors
];

// Validation middleware for image
const validateImage = [
    check('url')
      .exists({ checkFalsy: true })
      .withMessage('URL is required'),
    check('preview')
      .isBoolean()
      .withMessage('Preview must be a boolean'),
    handleValidationErrors
];

// Get all groups
router.get(
    '/',
    async (req, res) => {
      const groups = await Group.findAll();
      res.json({ Groups: groups });
    }
);

// Get all groups joined or organized by the current user
router.get('/current', restoreUser, requireAuth, async (req, res) => {
  const { user } = req;

  // Groups organized by the user
  const organizedGroups = await Group.findAll({
    where: { organizerId: user.id },
    include: [
      {
        model: GroupImage,
        as: 'GroupImages',
        attributes: ['url'],
        where: { preview: true },
        required: false
      },
      {
        model: Membership,
        attributes: []
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('Memberships.id')), 'numMembers']
      ]
    },
    group: ['Group.id', 'GroupImages.id']
  });

  // Groups the user is a member of
  const memberGroups = await Group.findAll({
    include: [
      {
        model: Membership,
        where: { userId: user.id },
        attributes: []
      },
      {
        model: GroupImage,
        as: 'GroupImages',
        attributes: ['url'],
        where: { preview: true },
        required: false
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('Memberships.id')), 'numMembers']
      ]
    },
    group: ['Group.id', 'GroupImages.id']
  });

  // Combine and remove duplicates if the user is both organizer and member
  const allGroups = [...new Set([...organizedGroups, ...memberGroups])];

  // Format the response to include the preview image as a single field
  const formattedGroups = allGroups.map(group => {
    const groupData = group.toJSON();
    groupData.previewImage = groupData.GroupImages.length ? groupData.GroupImages[0].url : null;
    delete groupData.GroupImages;
    return groupData;
  });

  res.json({ Groups: formattedGroups });
});

// Get details of a Group from an id
router.get('/:groupId', async (req, res) => {
  const { groupId } = req.params;

  // Fetch the group details along with related information
  const group = await Group.findByPk(groupId, {
    include: [
      {
        model: Membership,
        attributes: []
      },
      {
        model: GroupImage,
        as: 'GroupImages',
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Venue,
        as: 'Venues',
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
      }
    ],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('Memberships.id')), 'numMembers']
      ]
    },
    group: ['Group.id', 'GroupImages.id', 'Organizer.id', 'Venues.id']
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  res.json(group);
});

// Create a group
router.post(
    '/',
    restoreUser,
    requireAuth,
    validateGroup,
    async (req, res) => {
        const { name, about, type, private, city, state } = req.body;
        const { user } = req;
    
        try {
        const newGroup = await Group.create({
            organizerId: user.id,
            name,
            about,
            type,
            private,
            city,
            state
        });
    
        return res.status(201).json(newGroup);
        } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = {};
            err.errors.forEach((error) => {
            errors[error.path] = error.message;
            });
            return res.status(400).json({
            message: 'Validation error',
            errors
            });
        }
        next(err);
        }
    }      
);

// Add an Image to a Group based on the Group's id
router.post(
    '/:groupId/images',
    restoreUser,
    requireAuth,
    validateImage,
    async (req, res) => {
      const { groupId } = req.params;
      const { url, preview } = req.body;
      const { user } = req;
  
      // Find the group
      const group = await Group.findByPk(groupId);
  
      // Check if group exists
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }
  
      // Check if current user is the organizer
      if (group.organizerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Create new image for the group
      const newImage = await GroupImage.create({
        groupId,
        url,
        preview
      });
  
      return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
      });
    }
);

// Edit a group
router.put(
    '/:groupId',
    // restoreUser,
    // requireAuth,
    validateGroup,
    async (req, res) => {
      const { groupId } = req.params;
      const { name, about, type, private, city, state } = req.body;
      const { user } = req;
  
      // Find the group
      const group = await Group.findByPk(groupId);
  
      // Check if group exists
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }
  
      // Check if current user is the organizer
      if (group.organizerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Update the group
      group.name = name;
      group.about = about;
      group.type = type;
      group.private = private;
      group.city = city;
      group.state = state;
  
      await group.save();
  
      return res.status(200).json(group);
    }
);

// Delete a group
router.delete(
    '/:groupId',
    restoreUser,
    requireAuth,
    async (req, res) => {
      const { groupId } = req.params;
      const { user } = req;
  
      // Find the group
      const group = await Group.findByPk(groupId);
  
      // Check if group exists
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }
  
      // Check if current user is the organizer
      if (group.organizerId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
  
      // Delete the group
      await group.destroy();
  
      return res.status(200).json({ message: "Successfully deleted" });
    }
);
  

module.exports = router;