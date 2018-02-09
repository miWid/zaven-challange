'use strict';

const ServiceResult = require('../models/service-results/service-results');
const UsersErrors = require('../constants/errors/user-errors');
const Pagination = require('../utilities/pagination/pagination');
const bcrypt = require('bcrypt');

class UsersService {
    /**
     * Create new user service method
     * @param {CreateSingleUserDTO} createUserDTO - create user dto
     * @return {Promise<ServiceResult<DB.User>>} - service result
     */
    async createUser(createUserDTO) {
        try {
            let user = await DB.User.createUser({
                email: createUserDTO.email,
                firstName: createUserDTO.firstName,
                lastName: createUserDTO.lastName,
                passwordHash: bcrypt.hashSync(createUserDTO.password, 10)
            });

            return new ServiceResult(null, user);
        } catch (error) {
            console.error(error);
            return error.name === "SequelizeUniqueConstraintError" ? new ServiceResult(UsersErrors.CONFLICT)
                : new ServiceResult(UsersErrors.UNEXPECTED_ERROR);
        }
    }

    /**
     * Get users list service method
     * @param {GetUsersListDTO} getUsersListDTO - get users list dto
     * @return {Promise<ServiceResult<Array<DB.User>>>} - service result
     */
    async getUsersList(getUsersListDTO) {
        try {
            let pagination = new Pagination(getUsersListDTO, 1, 10, 100);
            let users = await DB.User.getUsersList(pagination.offset, pagination.pageSize);

            return new ServiceResult(null, users);
        } catch (error) {
            console.error(error);
            return new ServiceResult(UsersErrors.UNEXPECTED_ERROR);
        }
    }

    /**
     * Get single user service method
     * @param {GetSingleUserDTO} getSingleUserDTO - get single user dto
     * @return {Promise<ServiceResult<DB.User>>} - service result
     */
    async getSingleUser(getSingleUserDTO) {
        try {
            let user = await DB.User.findById(getSingleUserDTO.userId);

            if (!user) {
                return new ServiceResult(UsersErrors.NOT_FOUND);
            }

            return new ServiceResult(null, user);
        } catch (error) {
            console.error(error);
            return new ServiceResult(UsersErrors.UNEXPECTED_ERROR);
        }
    }
}

module.exports = UsersService;
