const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

router.get('/generate_reset_hash', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.send('Please provide your username to reset your password.');
    }

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.send('Username does not exist. Cannot reset password.');
        }

        if (!user.resethash) {
            const resetHash = generateResetHash();
            user.resethash = resetHash;
            await user.save();
        }

        user = await User.findOne({ username }); // Fetch user again to get the updated data

        console.log('User:', user); // Print the user after generating or retrieving reset hash

        return res.render('reset_password_page', { username, resetHash: user.resethash });
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});

router.post('/reset_password', async (req, res) => {
    const { username, hash, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });

        const storedHash = user.resethash;

        if (storedHash !== hash) {
            return res.send('Invalid hash');
        }

        user.password = newPassword;
        user.resethash = null; // Reset the reset hash after password change
        await user.save();

        return res.send('Password changed successfully');
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});

// Function to generate a random hash
function generateResetHash() {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    return hash.digest('hex');
}

module.exports = router;

