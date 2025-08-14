const router = require("express").Router();

const { createItem, getItems, updateItem, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingitems");
// CRUD

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put('/:itemID', updateItem);

// Delete
router.delete('/:itemID', deleteItem);

router.put("/:itemID/likes", likeItem);

router.delete("/:itemID/likes", dislikeItem);

module.exports = router;
