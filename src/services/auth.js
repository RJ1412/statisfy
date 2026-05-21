export function initiateAuth() {
  window.top.location.href = '/api/auth/login';
}

export function isAuthenticated() {
  // Check for the non-HttpOnly logged_in cookie set by the backend
  return document.cookie.includes('logged_in=1');
}

export async function clearAuth() {
  try {
    await fetch('/api/auth/logout');
  } catch (e) {
    console.error('Logout failed', e);
  }
  
  // Clear any remaining state
  document.cookie = 'logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  window.top.location.href = '/';
}

export { clearAuth as logout };
