'use strict';

const { Group } = require('../models');
const bcrypt = require("bcryptjs");

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
        about: 'A group for people who love technology.',
        type: 'In person',
        private: false,
        city: 'San Francisco',
        state: 'CA'
      },
      {
        organizerId: 1,
        name: 'Book Lovers',
        about: 'A group for people who love reading books.',
        type: 'Online',
        private: true,
        city: 'New York',
        state: 'NY'
      },
      {
        organizerId: 2,
        name: 'Fitness Freaks',
        about: 'A group for fitness enthusiasts.',
        type: 'In person',
        private: false,
        city: 'Los Angeles',
        state: 'CA'
      },
      {
        organizerId: 2,
        name: 'Art Admirers',
        about: 'A group for people who appreciate art.',
        type: 'Online',
        private: true,
        city: 'Chicago',
        state: 'IL'
      },
      {
        organizerId: 3,
        name: 'Music Makers',
        about: 'A group for musicians and music lovers.',
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
