import { useState } from 'react';

export const useTocDragAndDrop = (isReordering, onReorderSection, onReorderSectionBefore, onReorderSectionInto) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dropIndicator, setDropIndicator] = useState(null); // 'before', 'after', or 'into'

  const handleDragStart = (e, sectionId) => {
    if (!isReordering) return;
    setDraggedId(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, sectionId) => {
    if (!isReordering || draggedId === sectionId) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverId(sectionId);

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const threshold = rect.height / 4;

    if (y < threshold) {
      setDropIndicator('before');
    } else if (y > rect.height - threshold) {
      setDropIndicator('after');
    } else {
      setDropIndicator('into');
    }
  };

  const handleDragLeave = (e) => {
    if (!isReordering) return;
    // We don't strictly need to clear on every leave because dragOver on the next item
    // will update it, but clearing when leaving the entire area is good.
    // To avoid flickering, we can just let handleDragEnd or moving to another item handle it.
  };

  const handleDrop = (e, targetId) => {
    if (!isReordering || draggedId === null || draggedId === targetId) return;
    e.preventDefault();
    e.stopPropagation();
    
    if (dropIndicator === 'into') {
      onReorderSectionInto(draggedId, targetId);
    } else if (dropIndicator === 'before') {
      onReorderSectionBefore(draggedId, targetId);
    } else {
      onReorderSection(draggedId, targetId);
    }

    setDraggedId(null);
    setDragOverId(null);
    setDropIndicator(null);
  };

  const clearDragOverState = () => {
    setDragOverId(null);
    setDropIndicator(null);
  };

  const clearDragState = () => {
    setDraggedId(null);
    clearDragOverState();
  };

  return {
    draggedId,
    dragOverId,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDrop,
    setDragOverId,
    clearDragOverState,
    clearDragState,
  };
};
