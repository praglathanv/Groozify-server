const User = require('../models/User');

const userController = {
 
    addGroceryList: async (req, res) => {
      const userId = req.user.userId; // Assuming you set userId in authMiddleware
      const { name, groceries } = req.body; // Extract name and groceries from request body
  
      try {
        // Find the user by ID
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        // Create a new grocery list
        const newList = {
          name,
          groceries
        };
  
        // Add the new grocery list to the user's lists
        user.lists.push(newList);
  
        // Save the updated user document
        await user.save();
  
        // Return success response
        res.json({ message: 'Grocery list added successfully', newList });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
      }
    },
  
  
  getGroceryListById: async (req, res) => {
    const userId = req.user.userId; // Assuming you set userId in authMiddleware
    const listId = req.params.listId; // Extract listId from route parameters

    try {
      // Find the user
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the grocery list by its ID in the lists array
      const groceryList = user.lists.id(listId);

      if (!groceryList) {
        return res.status(404).json({ error: 'Grocery list not found' });
      }

      res.json({ groceryList });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getAllGroceryLists: async (req, res) => {
    const userId = req.user.userId; // Assuming you set userId in authMiddleware

    try {
      // Find the user including their grocery lists
      const user = await User.findById(userId).populate('lists.groceries');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user's grocery lists
      res.json({ lists: user.lists });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteGroceryList: async (req, res) => {
    const userId = req.user.userId; // Assuming you set userId in authMiddleware
    const listId = req.params.listId;

    try {
      // Find the user and check if the grocery list exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the grocery list exists in user's lists array
      const listIndex = user.lists.findIndex(list => list._id.equals(listId));
      if (listIndex === -1) {
        return res.status(404).json({ error: 'Grocery list not found' });
      }

      // Remove the grocery list from user's lists array
      user.lists.splice(listIndex, 1);
      await user.save();

      res.json({ message: 'Grocery list deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  deleteManyGroceryLists: async (req, res) => {
    const userId = req.user.userId; // Assuming you set userId in authMiddleware
    const listIds = req.body.listIds; // Assuming listIds is an array of IDs sent in the request body

    try {
      // Find the user and check if all specified grocery lists exist
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Iterate through the listIds and remove each corresponding grocery list
      listIds.forEach(listId => {
        const listIndex = user.lists.findIndex(list => list._id.equals(listId));
        if (listIndex !== -1) {
          user.lists.splice(listIndex, 1);
        }
      });

      // Save the updated user document
      await user.save();

      res.json({ message: 'Selected grocery lists deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

updateGroceryListItem: async (req, res) => {
  const userId = req.user.userId; // Assuming you set userId in authMiddleware
  const listId = req.params.listId; // Extract listId from route parameters
  const { name, groceries } = req.body; // Extract new list name and groceries from request body

  try {
    // Find the user and the grocery list to update
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the grocery list by its ID in the lists array
    const groceryList = user.lists.id(listId);

    if (!groceryList) {
      return res.status(404).json({ error: 'Grocery list not found' });
    }

    // Update the name field if provided in the request body
    if (name) {
      groceryList.name = name;
    }

    // Set groceries to the provided list if provided in the request body
    if (groceries && Array.isArray(groceries)) {
      groceryList.groceries = groceries; // Replace existing groceries with new ones
    }

    // Save the updated user document
    await user.save();

    // Return the updated grocery list
    res.json({ message: 'Grocery list updated successfully', groceryList: groceryList });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
},

  deleteGroceryListItem: async (req, res) => {
    const userId = req.user.userId; // Assuming you set userId in authMiddleware
    const listId = req.params.listId; // Extract listId from route parameters
    const itemId = req.params.itemId; // Extract itemId from route parameters

    try {
      // Find the user and the list
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Find the grocery list by its ID
      const groceryList = user.lists.id(listId);

      if (!groceryList) {
        return res.status(404).json({ error: 'Grocery list not found' });
      }

      // Find and remove the grocery item by its ID
      const groceryItemIndex = groceryList.groceries.findIndex(item => item._id.toString() === itemId);

      if (groceryItemIndex === -1) {
        return res.status(404).json({ error: 'Grocery item not found' });
      }

      // Remove the item from the groceries array
      groceryList.groceries.splice(groceryItemIndex, 1);

      // Save the updated user document
      await user.save();

      res.json({ message: 'Grocery item deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      // Find all users
      const users = await User.find();

      // Return the list of users
      res.json({ users });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id; // Extract user ID from route parameters

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user data
      res.json({ user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },
  //updateUser: async (req, res) => {
    // Update user logic
  //},
  deleteUser: async (req, res) => {
    const userId = req.params.id; // Extract user ID from route parameters

    try {
      // Find and delete the user by ID
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return a success message
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  },
};

module.exports = userController;
