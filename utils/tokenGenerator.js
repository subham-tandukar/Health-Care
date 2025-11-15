/**
 * Generate secure token for review link
 * @param {number} appointmentId
 * @returns {string} - Secure token
 */
export function generateReviewToken(appointmentId) {
  // Use built-in crypto module
  const crypto = require("crypto");

  const secret = process.env.REVIEW_TOKEN_SECRET;
  const timestamp = Date.now();
  const data = `${appointmentId}-${timestamp}`;

  // Create HMAC hash using built-in crypto
  const token = crypto.createHmac("sha256", secret).update(data).digest("hex");

  return `${appointmentId}-${timestamp}-${token}`;
}

/**
 * Verify and decode review token
 * @param {string} token
 * @returns {Object|null} - {appointmentId, timestamp} or null if invalid
 */
export function verifyReviewToken(token) {
  try {
    // Use built-in crypto module
    const crypto = require("crypto");

    const secret = process.env.REVIEW_TOKEN_SECRET;
    const parts = token.split("-");

    if (parts.length !== 3) return null;

    const [appointmentId, timestamp, hash] = parts;
    const data = `${appointmentId}-${timestamp}`;

    // Verify hash using built-in crypto
    const expectedHash = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("hex");

    if (hash !== expectedHash) return null;

    // Check if token is expired (30 days)
    const tokenAge = Date.now() - parseInt(timestamp);
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (tokenAge > thirtyDays) return null;

    return {
      appointmentId: parseInt(appointmentId),
      timestamp: parseInt(timestamp),
    };
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
