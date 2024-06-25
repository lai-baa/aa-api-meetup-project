'use strict';

const { EventImage } = require('../models');
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
        eventId: 1,
        url: 'https://example.com/event1-1.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://example.com/event1-2.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://example.com/event1-3.jpg',
        preview: true
      },
      {
        eventId: 2,
        url: 'https://example.com/event2-1.jpg',
        preview: true
      },
      {
        eventId: 3,
        url: 'https://example.com/event3-1.jpg',
        preview: true
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
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
