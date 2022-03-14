const express = require('express');
const {
  getUsers,
  getUsersById,
  patchUsers,
  patchUsersAvatar,
  getUser,
} = require('../controllers/users');
const { validateUserPatch, validationIdUser } = require('../middleware/validation');

const router = express.Router();

router.get('/', getUsers);

router.get('/me', getUser);

router.get('/:id', validationIdUser, getUsersById);

router.patch('/me', validateUserPatch, patchUsers);

router.patch('/me/avatar', patchUsersAvatar);

module.exports = router;
