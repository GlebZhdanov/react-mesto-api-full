const express = require('express');
const {
  getCards,
  postCards,
  deleteCard,
  putCardLike,
  deleteCardLike,
} = require('../controllers/cards');
const { validateCard, validationIdCard } = require('../middleware/validation');

const router = express.Router();

router.get('/', getCards);

router.post('/', validateCard, postCards);

router.delete('/:id', validationIdCard, deleteCard);

router.put('/:id/likes', validationIdCard, putCardLike);

router.delete('/:id/likes', validationIdCard, deleteCardLike);

module.exports = router;
