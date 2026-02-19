import { useEffect, useCallback } from 'react';
import { findSectionById } from '../../shared/utils/sectionUtils';

export const useNoteEditorData = ({
  id,
  notebooks,
  currentNotebook,
  setCurrentNotebook,
  fetchNotebook,
  sections,
  currentSection,
  setCurrentSection,
  fetchSectionsByNotebook,
  addNotification
}) => {
  useEffect(() => {
    if (!id) return;

    const existing = notebooks.find(n => n.id === Number(id));

    if (existing) {
      setCurrentNotebook(existing);
    } else {
      fetchNotebook(id);
    }
  }, [id, notebooks, fetchNotebook, setCurrentNotebook]);

  useEffect(() => {
    const loadSections = async () => {
      if (!currentNotebook?.id) return;
      try {
        await fetchSectionsByNotebook(currentNotebook.id);
      } catch (error) {
        console.error('Failed to load sections:', error);
        addNotification('A network error occurred. Please try again.', 'error');
      }
    };

    loadSections();
  }, [currentNotebook?.id, fetchSectionsByNotebook, addNotification]);

  useEffect(() => {
    if (sections.length > 0 && !currentSection) {
      setCurrentSection(sections[0]);
    }
  }, [sections, currentSection, setCurrentSection]);

  const setActiveSectionId = useCallback((id) => {
    const found = findSectionById(sections, id);
    if (found) setCurrentSection(found);
  }, [sections, setCurrentSection]);

  return {
    setActiveSectionId
  };
};
