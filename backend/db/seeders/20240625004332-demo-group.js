'use strict';

const { Group } = require('../models');
// const bcrypt = require("bcryptjs");

// /** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Group.bulkCreate([
      {
        organizerId: 1,
        name: 'Tech Enthusiasts',
        about: 'A group for people who love technology and want to discuss and share knowledge about the latest advancements in tech. We meet weekly to explore new topics and ideas in the tech world.',
        type: 'In person',
        private: false,
        city: 'San Francisco',
        state: 'CA'
      },
      {
        organizerId: 1,
        name: 'Book Lovers',
        about: 'A group for people who love reading books and enjoy discussing literature. We gather every month to talk about our favorite books and authors, and to share our reading experiences.',
        type: 'Online',
        private: true,
        city: 'New York',
        state: 'NY'
      },
      {
        organizerId: 2,
        name: 'Fitness Freaks',
        about: 'An enthusiastic group for fitness lovers who are passionate about staying fit and healthy. We organize regular workout sessions, fitness challenges, and provide support to each other on our fitness journeys.',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'Art Admirers',
        about: 'A vibrant community of art enthusiasts who appreciate and create art. We conduct online discussions, workshops, and exhibitions to celebrate and promote various forms of art and creativity.',
        type: 'Online',
        private: true,
        city: 'Chicago',
        state: 'IL'
      },
      {
        organizerId: 3,
        name: 'Music Makers',
        about: 'A group for musicians and music lovers to come together, share their music, collaborate on projects, and enjoy live performances. We host regular jam sessions and music events to foster a thriving music community.',
        type: 'In person',
        private: false,
        city: 'Austin',
        state: 'TX'
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Tech Enthusiasts', 'Book Lovers', 'Fitness Freaks', 'Art Admirers', 'Music Makers'] }
    }, {});
  }
};
