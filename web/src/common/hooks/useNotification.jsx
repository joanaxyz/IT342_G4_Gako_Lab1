import { createContextHook } from '../utils/createContextHook';
import { NotificationContext } from '../contexts/NotificationContext';

export const useNotification = createContextHook(
    NotificationContext, 
    'useNotification', 
    'NotificationProvider'
);
