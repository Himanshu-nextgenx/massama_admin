/**
 * API Services Index
 * Re-exports all API services for easy imports
 */

// Base API client
export { API_BASE_URL, default as api } from './api';
export type { ApiError, PaginatedResponse } from './api';

// Entity services
export { bannerService } from './bannerService';
export { eventService } from './eventService';
export { productService } from './productService';
export { userService } from './userService';

