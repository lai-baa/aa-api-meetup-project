'use strict';

const { Event } = require('../models');
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
    await queryInterface.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: 'Tech Conference 2024',
        description: 'A conference for tech enthusiasts to discuss and share knowledge about the latest advancements in technology.',
        type: 'In Person',
        capacity: 500,
        price: 100,
        startDate: '2024-11-20 19:00:00',
        endDate: '2024-11-20 20:00:00'
      },
      {
        venueId: 1,
        groupId: 1,
        name: 'Online Book Club',
        description: 'A virtual book club meeting where members discuss their favorite books and authors.',
        type: 'Online',
        capacity: 50,
        price: 0,
        startDate: '2024-11-21 19:00:00',
        endDate: '2024-11-21 20:00:00'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Fitness Bootcamp',
        description: 'An intensive fitness bootcamp for fitness enthusiasts.',
        type: 'In Person',
        capacity: 100,
        price: 50,
        startDate: '2024-11-22 19:00:00',
        endDate: '2024-11-22 20:00:00'
      },
      {
        venueId: 2,
        groupId: 2,
        name: 'Virtual Art Gallery',
        description: 'An online art gallery exhibit showcasing various forms of art.',
        type: 'Online',
        capacity: 200,
        price: 20,
        startDate: '2024-11-23 19:00:00',
        endDate: '2024-11-23 20:00:00'
      },
      {
        venueId: 3,
        groupId: 3,
        name: 'Live Music Night',
        description: 'A night of live music performances by local artists.',
        type: 'In Person',
        capacity: 300,
        price: 75,
        startDate: '2024-11-24 19:00:00',
        endDate: '2024-11-24 20:00:00'
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Tech Conference 2024', 'Online Book Club', 'Fitness Bootcamp', 'Virtual Art Gallery', 'Live Music Night'] }
    }, {});
  }
};
