import { createActiveContext } from '../utils/createActiveContext';

// Loading Context
const { Context: LoadingContext, Provider: LoadingProvider } = createActiveContext();
const { Context: ModalContext, Provider: ModalProvider } = createActiveContext();
const { Context: SearchContext, Provider: SearchProvider } = createActiveContext();
const { Context: ProfileContext, Provider: ProfileProvider } = createActiveContext();
const { Context: LoadingChatbotContext, Provider: LoadingChatbotProvider } = createActiveContext();

export {
    LoadingContext,
    LoadingProvider,
    ModalContext,
    ModalProvider,
    SearchContext,
    SearchProvider,
    ProfileContext,
    ProfileProvider,
    LoadingChatbotContext,
    LoadingChatbotProvider,
};

