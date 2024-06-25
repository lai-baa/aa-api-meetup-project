'use strict';

const { GroupImage } = require('../models');
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
        groupId: 1,
        url: 'https://example.com/group1-1.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://example.com/group1-2.jpg',
        preview: true
      },
      {
        groupId: 1,
        url: 'https://example.com/group1-3.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://example.com/group2-1.jpg',
        preview: true
      },
      {
        groupId: 2,
        url: 'https://example.com/group2-2.jpg',
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
    options.tableName = 'GroupImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2] }
    }, {});
  }
};
