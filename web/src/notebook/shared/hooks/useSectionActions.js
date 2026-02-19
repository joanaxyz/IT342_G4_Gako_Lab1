import { useCallback } from 'react';
import { useSection } from './useSection';
import { useNotification } from '../../../common/hooks/useNotification';
import {
  findParentAndOrder,
  countChildren,
  insertAfterInList,
  appendChildToParent,
  replaceInList,
  normalizeSection,
  findSectionById,
  kidsOf,
  moveSection,
  moveSectionBefore,
  moveSectionInto
} from '../utils/sectionUtils';

export const useSectionActions = (currentNotebook) => {
  const { addNotification } = useNotification();
  const { 
    sections, 
    setSections, 
    setCurrentSection, 
    updateSection: contextUpdateSection,
    createSection: contextCreateSection,
    reorderSections: contextReorderSections,
    bulkUpdateSectionOrder: contextBulkUpdateSectionOrder
  } = useSection();

  const addNewSection = useCallback(async (parentId, afterId) => {
    const notebookId = currentNotebook?.id;
    if (!notebookId) {
      addNotification('No notebook selected.', 'error');
      return;
    }

    let parentSectionId = null;
    let orderIndex = 0;

    if (afterId != null) {
      const pos = findParentAndOrder(sections, afterId);
      if (pos) {
        parentSectionId = pos.parentId;
        orderIndex = pos.orderIndex;
      }
    } else if (parentId != null) {
      parentSectionId = parentId;
      orderIndex = countChildren(sections, parentId);
    } else {
      orderIndex = sections.length;
    }

    const tempId = `temp-${Date.now()}`;
    const placeholder = { id: tempId, title: 'New section', children: [] };

    setSections((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (afterId != null) {
        const next = insertAfterInList(copy, afterId, placeholder);
        return next ?? copy;
      }
      if (parentId != null) return appendChildToParent(copy, parentId, placeholder);
      return [...copy, placeholder];
    });
    setCurrentSection(placeholder);

    try {
      const response = await contextCreateSection({
        title: 'New section',
        content: '',
        orderIndex,
        notebookId,
        parentSectionId: parentSectionId || undefined,
      }, false); // pass false to handle state update manually here

      if (response.success && response.data) {
        setSections((prev) => {
          const next = replaceInList(
            JSON.parse(JSON.stringify(prev)),
            tempId,
            response.data
          );
          return next ?? prev;
        });
        setCurrentSection(normalizeSection(response.data));
      } else {
        setSections((prev) => {
          const copy = JSON.parse(JSON.stringify(prev));
          const remove = (list) => list.filter((s) => s.id !== tempId)
            .map((s) => ({ ...s, children: remove(kidsOf(s)) }));
          return remove(copy);
        });
        const first = sections[0];
        if (first) setCurrentSection(findSectionById(sections, first.id) ?? first);
        // Note: SectionContext already handles the notification error if needed, 
        // but we can add more specific ones here if context remains generic
      }
    } catch (error) {
      console.error('Error adding section:', error);
      addNotification('An unexpected error occurred while adding the section.', 'error');
    }
  }, [
    currentNotebook?.id,
    sections,
    setSections,
    setCurrentSection,
    addNotification,
    contextCreateSection
  ]);

  const updateSection = useCallback(async (id, data, showSpinner = true, showNotification = true) => {
    return await contextUpdateSection(id, data, showSpinner, showNotification);
  }, [contextUpdateSection]);

  const reorderSection = useCallback((draggedId, targetId) => {
    setSections((prev) => moveSection(prev, draggedId, targetId));
  }, [setSections]);

  const reorderSectionBefore = useCallback((draggedId, targetId) => {
    setSections((prev) => moveSectionBefore(prev, draggedId, targetId));
  }, [setSections]);

  const reorderSectionInto = useCallback((draggedId, targetId) => {
    setSections((prev) => moveSectionInto(prev, draggedId, targetId));
  }, [setSections]);

  const persistSectionOrder = useCallback(async () => {
    const requests = [];
    const flatten = (list, parentId) => {
      list.forEach((s, index) => {
        requests.push({
          id: s.id,
          parentSectionId: parentId,
          orderIndex: index
        });
        if (s.children?.length > 0) {
          flatten(s.children, s.id);
        }
      });
    };
    flatten(sections, null);
    await contextBulkUpdateSectionOrder(requests);
  }, [sections, contextBulkUpdateSectionOrder]);

  return { addNewSection, updateSection, reorderSection, reorderSectionBefore, reorderSectionInto, persistSectionOrder };
};
