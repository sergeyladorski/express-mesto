const router = require('express').Router();
const {
  getUsers, getUserById, getCurrentUser, updateProfile, updateAvatar,
} = require('../controllers/users');
const {
  userIdValidation,
  userProfileUpdateValidation,
  userAvatarUpdateValidation,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/:userId', getUserById);
router.get('/users/me', userIdValidation, getCurrentUser);
router.patch('/users/me', userProfileUpdateValidation, updateProfile);
router.patch('/users/me/avatar', userAvatarUpdateValidation, updateAvatar);

module.exports = router;
