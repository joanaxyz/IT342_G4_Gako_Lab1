import { CategoryContext } from '../context/CategoryContext';
import { ChatsContext } from '../context/ChatsContext';
import { createContextHook } from '../../common/utils/createContextHook';

// Re-export active context hooks
export { useProfile, useSearch, useLoadingChatbot } from '../../common/hooks/useActive';

// Other chatbot context hooks
export const useCategory = createContextHook(CategoryContext, 'useCategory', 'CategoryProvider');
export const useChats = createContextHook(ChatsContext, 'useChats', 'ChatsProvider');

