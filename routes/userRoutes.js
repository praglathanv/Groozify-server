const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protected user routes
router.get('/users', authMiddleware, userController.getAllUsers);
router.get('/users/:id', authMiddleware, userController.getUserById);
//router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

// Grocery list routes
//add-list
router.post('/grocery-list', authMiddleware, userController.addGroceryList);
//history
router.get('/grocery-lists', authMiddleware, userController.getAllGroceryLists);
//list which gets into listpage
router.get('/grocery-lists/:listId', authMiddleware, userController.getGroceryListById);
//updating  items in a list
router.put('/grocery-lists/:listId', authMiddleware, userController.updateGroceryListItem);
//delting one item in that list
router.delete('/grocery-lists/:listId/items/:itemId', authMiddleware, userController.deleteGroceryListItem);
//deleting a single list
router.delete('/grocery-lists/:listId', authMiddleware, userController.deleteGroceryList);
//delete many lists
router.delete('/grocery-lists', authMiddleware, userController.deleteManyGroceryLists);

module.exports = router; 
