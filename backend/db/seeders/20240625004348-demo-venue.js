'use strict';

const { Venue } = require('../models');
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
   await Venue.bulkCreate([
    {
      groupId: 1,
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7749,
      lng: -122.4194
    },
    {
      groupId: 2,
      address: '456 Book Road',
      city: 'New York',
      state: 'NY',
      lat: 40.7128,
      lng: -74.0060
    },
    {
      groupId: 3,
      address: '789 Fitness Ave',
      city: 'Los Angeles',
      state: 'CA',
      lat: 34.0522,
      lng: -118.2437
    },
    {
      groupId: 4,
      address: '101 Art Blvd',
      city: 'Chicago',
      state: 'IL',
      lat: 41.8781,
      lng: -87.6298
    },
    {
      groupId: 5,
      address: '202 Music Ln',
      city: 'Austin',
      state: 'TX',
      lat: 30.2672,
      lng: -97.7431
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Tech Enthusiasts', 'Book Lovers', 'Fitness Freaks', 'Art Admirers', 'Music Makers'] }
    }, {});
  }
};
