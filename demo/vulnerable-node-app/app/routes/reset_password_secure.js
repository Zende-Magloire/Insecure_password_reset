const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");

router.get("/generate_reset_hash_safe", async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.send("Please provide your username to reset your password.");
  }

  try {
    let user = await User.findOne({ username });

    if (!user) {
      return res.send("Username does not exist. Cannot reset password.");
    }

    if (!user.resethash) {
      const resetHash = generateRandomSecureHash(); // Generate a new random hash
      user.resethash = resetHash;
      await user.save();
    }

    user = await User.findOne({ username }); // Fetch user again to get the updated data

    console.log("User:", user); // Print the user after generating or retrieving reset hash

    return res.render("reset_password_page", {
      username,
      resetHash: user.resethash,
    });
  } catch (err) {
    res.status(500).send("An error occurred" + err.message);
  }
});

router.post("/reset_password", async (req, res) => {
  const { username, hash, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });

    const storedHash = user.resethash;

    if (storedHash !== hash) {
      return res.send("Invalid hash");
    }

    user.password = newPassword;
    user.resethash = null; // Reset the reset hash after password change
    await user.save();

    return res.send("Password changed successfully");
  } catch (err) {
    res.status(500).send("An error occurred");
  }
});

// SHA-256 is more secure than MD5 due to its stronger hashing algorithm but it may not be the most secure option available.

/* This function generates a hash using sha-256, which is better than md5, 
   but not the most secure. 
   
function generateRandomSecureHash() {
    const randomBytes = crypto.randomBytes(32); // Generate 32 bytes of random data
    const hash = crypto.createHash('sha256').update(randomBytes).digest('hex'); // Create SHA-256 hash
    return hash;
}
*/

// Adding a more secure hash generation function using bcrypt

const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function generateRandomSecureHash() {
  try {
    const length = 64; // Adjust the length of the salt and hash as needed

    // Generate a secure random salt using bcrypt
    const salt = await bcrypt.genSalt(10); // The second argument is the saltRounds

    // Generate random bytes
    const randomBytes = crypto.randomBytes(length);

    // Concatenate the salt and random bytes for hashing
    const dataToHash = salt + randomBytes.toString("hex");

    // Hash the concatenated data using bcrypt
    const hash = await bcrypt.hash(dataToHash, 10); // The second argument is the saltRounds

    return hash;
  } catch (error) {
    console.error("Error generating hash:", error);
  }
}

module.exports = router;
