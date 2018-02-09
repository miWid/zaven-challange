'use strict';

module.exports = function (sequelize, DataTypes) {

  /**
   * @memberOf DB
   */
  let User = sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    passwordHash: DataTypes.TEXT
  });

  User.associate = function (DB) {
    User.hasMany(DB.Post, {foreignKey: 'authorId', as: 'Posts'});
  };

    /**
     * Create a new user
     * @param {object} model - model
     * @param {string} model.email - user email
     * @param {string} model.firstName - user first name
     * @param {string} model.lastName - user last name
     * @param {string} model.passwordHash - user password hash
     * @return {DB.User} - created user
     */
    User.createUser = async function (model) {
        return User.create({
            email: model.email,
            firstName: model.firstName,
            lastName: model.lastName,
            passwordHash: model.passwordHash,
        });
    };

    /**
     * Get paginated users list
     * @param {number} offset - offset
     * @param {number} limit - limit
     * @return {Promise<Array<DB.User>>} - list of users
     */
    User.getUsersList = async function (offset, limit) {
        return User.findAll({offset, limit});
    };

    /**
     * @param {string} id - user id (uuid)
     * @return {Promise<DB.User|null>} - user
     */
    User.findById = async function (id) {
        return User.findOne({where:{id:id}});
    };

  return User;
};
