import { DropdownContext } from '../contexts/DropdownContext';
import { NotificationContext } from '../contexts/NotificationContext';
import { ThemeContext } from '../contexts/ThemeContext';
import { createContextHook } from '../utils/createContextHook';

// Re-export active context hooks
export { useLoading } from './useActive';

// Other context hooks
export const useDropdown = createContextHook(DropdownContext, 'useDropdown', 'DropdownProvider');
export const useNotif = createContextHook(NotificationContext, 'useNotif', 'NotificationProvider');
export const useTheme = createContextHook(ThemeContext, 'useTheme', 'ThemeProvider');
