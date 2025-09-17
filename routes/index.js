const router = require('express').Router();
const { NOT_FOUND_STATUS_CODE } = require('../utils/errors');
const itemRouter = require('./clothingItems');
const userRouter = require('./users');



router.use('/users', userRouter);
router.use('/items', itemRouter);

router.use((req, res) => {
res.status(NOT_FOUND_STATUS_CODE).send({message: 'Router not found'})
})

module.exports = router;