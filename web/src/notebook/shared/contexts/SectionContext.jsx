import { createContext, useState, useCallback, useMemo } from 'react';
import { sectionAPI } from '../../../common/utils/api';
import { useLoading } from '../../../common/hooks/useActive';
import { useNotification } from '../../../common/hooks/useNotification';
import {
    findParentAndOrder,
    countChildren,
    insertAfterInList,
    appendChildToParent,
    replaceInList,
    normalizeSection,
    findSectionById,
    kidsOf
} from '../utils/sectionUtils';

export const SectionContext = createContext(null);

export const SectionProvider = ({ children }) => {
    const [sections, setSections] = useState([]);
    const [currentSection, setCurrentSection] = useState(null);
    const { activate: showLoading, deactivate: hideLoading } = useLoading();
    const { addNotification } = useNotification();

    const withLoading = useCallback(async (apiFunction, showSpinner = true) => {
        if (showSpinner) showLoading();
        try {
            return await apiFunction();
        } finally {
            if (showSpinner) hideLoading();
        }
    }, [showLoading, hideLoading]);

    const fetchSectionsByNotebook = useCallback(async (notebookId, showSpinner = true) => {
        const response = await withLoading(() => sectionAPI.getSectionsByNotebook(notebookId), showSpinner);
        if (response.success) {
            const raw = response.data || [];
            setSections(raw.map(normalizeSection));
        }
        return response;
    }, [withLoading]);

    const fetchSection = useCallback(async (id, showSpinner = true) => {
        const response = await withLoading(() => sectionAPI.getSection(id), showSpinner);
        if (response.success) {
            setCurrentSection(response.data);
        }
        return response;
    }, [withLoading]);

    const createSection = useCallback(async (section, updateState = true, showSpinner = true) => {
        const response = await withLoading(() => sectionAPI.createSection(section), showSpinner);
        if (response.success && updateState) {
            setSections(prev => [...prev, normalizeSection(response.data)]);
        }
        return response;
    }, [withLoading]);

    const updateSection = useCallback(async (id, section, showSpinner = true, showNotification = true) => {
        const response = await withLoading(() => sectionAPI.updateSection(id, section), showSpinner);
        if (response.success) {
            const updated = normalizeSection(response.data);

            const replaceInTree = (list) =>
                list.map((node) => {
                    if (node.id === id) return { ...node, ...updated };
                    const kids = node.children?.length ? replaceInTree(node.children) : node.children;
                    return { ...node, children: kids };
                });

            setSections((prev) => replaceInTree(prev));
            
            setCurrentSection((prev) => (prev?.id === id ? { ...prev, ...updated } : prev));

            if (showNotification) {
                addNotification?.('Section updated successfully.', 'success');
            }
        } else {
            addNotification?.(response.message || 'Failed to update section.', 'error');
        }

        return response;
    }, [withLoading, addNotification]);

    const deleteSection = useCallback(async (id, showSpinner = true) => {
        const response = await withLoading(() => sectionAPI.deleteSection(id), showSpinner);
        if (response.success) {
            setSections(prev => prev.filter(s => s.id !== id));
            if (currentSection?.id === id) {
                setCurrentSection(null);
            }
        }
        return response;
    }, [withLoading, currentSection]);

    const reorderSections = useCallback(async (draggedId, targetId, showSpinner = true) => {
        return await withLoading(() => sectionAPI.reorderSections(draggedId, targetId), showSpinner);
    }, [withLoading]);

    const bulkUpdateSectionOrder = useCallback(async (requests, showSpinner = true) => {
        return await withLoading(() => sectionAPI.bulkUpdateSectionOrder(requests), showSpinner);
    }, [withLoading]);

    const value = useMemo(() => ({
        sections,
        currentSection,
        fetchSectionsByNotebook,
        fetchSection,
        createSection,
        updateSection,
        deleteSection,
        reorderSections,
        bulkUpdateSectionOrder,
        setSections,
        setCurrentSection
    }), [sections, currentSection, fetchSectionsByNotebook, fetchSection, createSection, updateSection, deleteSection, reorderSections, bulkUpdateSectionOrder]);

    return (
        <SectionContext.Provider value={value}>
            {children}
        </SectionContext.Provider>
    );
};
