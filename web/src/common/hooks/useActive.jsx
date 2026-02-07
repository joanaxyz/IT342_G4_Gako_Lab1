import { createContextHook } from '../utils/createContextHook';
import {
  LoadingContext,
  ModalContext,
  SearchContext,
  ProfileContext,
  LoadingChatbotContext,
} from '../contexts/ActiveContexts';

// Loading hooks
export const useLoading = createContextHook(LoadingContext, 'useLoading', 'LoadingProvider');
export const useModal = createContextHook(ModalContext, 'useModal', 'ModalProvider');
export const useSearch = createContextHook(SearchContext, 'useSearch', 'SearchProvider');
export const useProfile = createContextHook(ProfileContext, 'useProfile', 'ProfileProvider');
export const useLoadingChatbot = createContextHook(LoadingChatbotContext, 'useLoadingChatbot', 'LoadingChatbotProvider');