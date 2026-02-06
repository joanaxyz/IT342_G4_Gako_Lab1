import { createActiveContext } from '../utils/createActiveContext';

// Loading Context
const { Context: LoadingContext, Provider: LoadingProvider } = createActiveContext();
const { Context: ModalContext, Provider: ModalProvider } = createActiveContext();
export {
    LoadingContext,
    LoadingProvider,
    ModalContext,
    ModalProvider,
};

