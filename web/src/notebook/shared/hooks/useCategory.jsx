import { createContextHook } from '../../../common/utils/createContextHook';
import { CategoryContext } from '../contexts/CategoryContext';

export const useCategory = createContextHook(
    CategoryContext,
    'useCategory',
    'CategoryProvider'
);
