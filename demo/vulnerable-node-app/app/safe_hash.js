const bcrypt = require("bcrypt");
const crypto = require("crypto");

async function generateSecureHash() {
  try {
    const length = 64; // Adjust the length of the salt and hash as needed

    // Generate a secure random salt
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

// Example usage
generateSecureHash().then((secureHash) => {
  console.log("Secure hash:", secureHash);
});
