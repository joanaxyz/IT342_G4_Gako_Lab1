/**
 * Gets user initials from name or email
 * @param {Object} user - User object with name, firstName, lastName, or email
 * @returns {string} User initials (e.g., "JD" for "John Doe")
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';
  
  // Try to get initials from firstName and lastName
  if (user.firstName && user.lastName) {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
  
  // Try to get initials from name (full name)
  if (user.name) {
    const nameParts = user.name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
    }
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
  }
  
  // Fallback to email
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  
  return 'U';
};

/**
 * Gets a color for user avatar based on user ID or name
 * @param {Object} user - User object
 * @returns {string} Hex color code
 */
export const getUserAvatarColor = (user) => {
  const colors = [
    '#5B8FCF', '#7DAEF0', '#4A90E2', '#6C9BD8',
    '#8FA8D3', '#A5B8D6', '#B8C5D9', '#C9D4DC',
    '#5B8FCF', '#7DAEF0', '#4A90E2', '#6C9BD8'
  ];
  
  let hash = 0;
  const str = user?.id?.toString() || user?.email || user?.name || 'user';
  
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

