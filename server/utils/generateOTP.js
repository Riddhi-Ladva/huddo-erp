export default function generateOTP() {
  // Generates a random 6 digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}
