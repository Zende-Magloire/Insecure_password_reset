const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Function to generate a random hash
function generateResetHash() {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    return hash.digest('hex');
}

router.get('/generate_reset_hash', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.send('Please provide your username to reset your password.');
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.send('Username does not exist. Cannot reset password.');
        }

        const resetHash = generateResetHash();
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $set: { resethash: resetHash } },
            { new: true }
        );

        if (updatedUser) {
            res.render('reset_password_page', { username, resetHash });
        } else {
            res.send('Error generating reset hash');
        }
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});

router.post('/reset_password', async (req, res) => {
    const { username, hash, newPassword } = req.body;

    try {
        const user = await User.findOne({ username });

        if (user && user.resethash === hash) {
            const updatedUser = await User.findOneAndUpdate(
                { username },
                { $set: { password: newPassword, resethash: null } },
                { new: true }
            );

            if (updatedUser) {
                res.send('Password changed successfully');
            } else {
                res.send('Failed to update password');
            }
        } else {
            res.send('Invalid username or reset hash');
        }
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});

module.exports = router;

