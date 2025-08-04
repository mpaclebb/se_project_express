const router = require("express").Router();

const { createItem, getItems, updateItem, deleteItem } = require("../controllers/clothingitems");
//CRUD

//Create
router.post("/", createItem);

// Read
router.get("/", getItems);

//Update
router.put('/:itemID', updateItem);

//Delete
router.delete('/:itemID', deleteItem);


module.exports = router;
