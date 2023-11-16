// password.route.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path based on your file structure

// Function to generate a random hash
// ... (other imports and configurations)

// Function to generate a random hash
function generateResetHash() {
    const hash = crypto.createHash('sha256');
    hash.update(Math.random().toString());
    return hash.digest('hex');
}

router.post('/reset_password', async (req, res) => {
    const { email, password, hash } = req.body;

    try {
        if (hash) {
            // Change password if hash exists
            const updatedUser = await User.findOneAndUpdate(
                { email: email, resethash: hash },
                { $set: { password: password, resethash: null } },
                { new: true }
            );

            if (updatedUser) {
                res.send('Password changed successfully');
            } else {
                res.send('Invalid email or reset hash');
            }
        } else {
            // Reset hash if hash doesn't exist
            const resetHash = generateResetHash();
            const user = await User.findOneAndUpdate(
                { email: email },
                { $set: { resethash: resetHash } },
                { new: true }
            );

            if (user) {
                res.send('Reset hash generated. Use this hash for password reset.');
            } else {
                res.send('User not found');
            }
        }
    } catch (err) {
        res.status(500).send('An error occurred');
    }
});


module.exports = router;

