// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email. Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required. Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required.'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required.'),
    handleValidationErrors
];


// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { firstName, lastName, email, password, username } = req.body;
    
    try {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path] = `User with that ${err.path} already exists`;
        });

        return res.status(500).json({
          message: 'User already exists',
          errors
        });
      } else if (error.name === 'SequelizeValidationError') {
        const errors = {};
        error.errors.forEach((err) => {
          errors[err.path] = err.message;
        });

        return res.status(400).json({
          message: 'Bad Request',
          errors
        });
      }

      next(error);
    }
  }
);

module.exports = router;