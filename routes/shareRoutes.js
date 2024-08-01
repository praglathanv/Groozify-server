const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// POST /share route to share a specific grocery list item
router.post('/', authMiddleware, async (req, res) => {
  const { groceries, name } = req.body; // Extract groceries and title from request body

  try {
    if (!Array.isArray(groceries) || groceries.length === 0) {
      return res.status(400).json({ error: 'Invalid groceries data' });
    }

    // Convert groceries array to a formatted string
    const groceriesString = groceries.map(grocery => {
      return `${grocery.item} - ${grocery.quantity}`;
    }).join('\n');

    // Construct grocery list message with custom title and groceries
    const header = `${name}:\n==========\n`;
    const message = `${header}${groceriesString}`;

    // Maximum length allowed for the message
    const maxLength = 900;

    // Truncate the message if it exceeds the maximum length
    let truncatedMessage = message;
    if (truncatedMessage.length > maxLength) {
      truncatedMessage = truncatedMessage.substring(0, maxLength);
      truncatedMessage = truncatedMessage.substring(0, truncatedMessage.lastIndexOf('\n')) + '...';
    }

    // Generate WhatsApp share URL
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(truncatedMessage)}`;

    res.json({ shareUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;