# Insecure password reset functionality

This demo builds off work described here: https://github.com/tschuwerk/CSEC302_Demo/tree/main/demo/vulnerable-node-app/app
and code found here: https://github.com/yeswehack/vulnerable-code-snippets/tree/main/PasswordReset

The original password reset functionality in this code is deliberately vulnerable as it utilizes the MD5 hashing algorithm for generating reset hashes. MD5, known for its vulnerabilities, provides an insecure method for hash generation. This weakness makes it relatively easy for an attacker to perform hash-guessing attacks and compromise user accounts.

To address this security concern, the code has been restructured to utilize the SHA-256 hashing algorithm, which significantly enhances the security of hash generation. SHA-256 produces a fixed-size output of 256 bits (or 32 bytes), resulting in an immensely larger pool of possible unique hashes compared to MD5. Specifically, SHA-256 has a total possible unique hash space of 2^256, an astronomically massive number that significantly bolsters the system's resilience against brute-force attacks. The code revision involves replacing the insecure MD5 hash generation with the more robust and secure SHA-256 algorithm. This upgrade significantly enhances the hash generation process, making it more challenging for potential attackers to guess or brute-force the generated hashes.

Additionally, combining techniques like salting, peppering, or using specialized algorithms like bcrypt or Argon2 further strengthens the security of the hash. The safe_hash.js provides an example that implements this hashing technique. This approach combines the use of a strong hashing algorithm (bcrypt) with a random salt and random bytes, enhancing security against various attack vectors.
