import { createContextHook } from '../utils/createContextHook';
import {
  LoadingContext,
  ModalContext,
} from '../contexts/ActiveContexts';

// Loading hooks
export const useLoading = createContextHook(LoadingContext, 'useLoading', 'LoadingProvider');
export const useModal = createContextHook(ModalContext, 'useModal', 'ModalProvider');