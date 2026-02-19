import { createContextHook } from '../../../common/utils/createContextHook';
import { NotebookContext } from '../contexts/NotebookContext';

export const useNotebook = createContextHook(
    NotebookContext,
    'useNotebook',
    'NotebookProvider'
);
