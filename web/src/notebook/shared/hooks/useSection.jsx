import { createContextHook } from '../../../common/utils/createContextHook';
import { SectionContext } from '../contexts/SectionContext';

export const useSection = createContextHook(
    SectionContext,
    'useSection',
    'SectionProvider'
);
