export const ExpiresOTP = () => {
  return Date.now() + 24 * 60 * 60 * 1000; // 24 hours to expire
}
