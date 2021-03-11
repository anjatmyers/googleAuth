'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'auths',
      'expiry_date',
      Sequelize.STRING
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'auths',
      'expiry_date'
    );
  }
};
