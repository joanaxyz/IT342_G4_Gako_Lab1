import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNotebook } from '../shared/hooks/useNotebook';
import { useSection } from '../shared/hooks/useSection';
import { useSectionActions } from '../shared/hooks/useSectionActions';
import { useEditorResize } from './hooks/useEditorResize';
import { useNoteEditorData } from './hooks/useNoteEditorData';
import EditorNavbar from './components/EditorNavbar/EditorNavbar';
import FormatToolbar from './components/FormatToolbar/FormatToolbar';
import TocSidebar from './components/TocSidebar/TocSidebar';
import SectionView from './components/SectionView/SectionView';
import LongDocumentView from './components/LongDocumentView/LongDocumentView';
import AiSidebar from './components/AiSidebar/AiSidebar';
import AiFab from './components/AiFab/AiFab';
import { useNotification } from '../../common/hooks/useNotification';
import './editor.css';

const NoteEditor = () => {
  const { id } = useParams();
  const { state: locationState } = useLocation();
  const [viewMode, setViewMode] = useState('section');
  const { addNotification } = useNotification();
  
  const editorBodyRef = useRef(null);
  const { editorMaxWidth, handleMouseDown } = useEditorResize(editorBodyRef);
  
  const { currentNotebook, setCurrentNotebook, notebooks, fetchNotebook, updateNotebook } = useNotebook();
  const {
    sections,
    setSections,
    currentSection,
    setCurrentSection,
    fetchSectionsByNotebook
  } = useSection();

  const { setActiveSectionId } = useNoteEditorData({
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
  });

  const { addNewSection, updateSection, reorderSection, reorderSectionBefore, reorderSectionInto, persistSectionOrder } = useSectionActions(currentNotebook);

  const activeSectionId = currentSection?.id;

  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [activeEditor, setActiveEditor] = useState(null);

  const notebookTitle = id === 'new'
    ? (locationState?.title || 'New notebook')
    : (currentNotebook?.title || 'Loading...');

  const handleAddTopLevel = useCallback(() => addNewSection(null, null), [addNewSection]);
  const handleAddChild = useCallback((parentId) => addNewSection(parentId, null), [addNewSection]);
  const handleAddAfter = useCallback((afterId) => addNewSection(null, afterId), [addNewSection]);

  const handleUpdateNotebookTitle = useCallback((newTitle) => {
    if (currentNotebook?.id) {
      updateNotebook(currentNotebook.id, { title: newTitle });
    }
  }, [currentNotebook, updateNotebook]);

  return (
    <>
      <EditorNavbar
        notebookTitle={notebookTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onTitleChange={handleUpdateNotebookTitle}
      />
      <FormatToolbar editor={activeEditor} />
      <div className="editor-body" ref={editorBodyRef}>
        <TocSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
          onAddTopLevel={handleAddTopLevel}
          onAddChild={handleAddChild}
          onAddAfter={handleAddAfter}
          onUpdateSection={updateSection}
          onReorderSection={reorderSection}
          onReorderSectionBefore={reorderSectionBefore}
          onReorderSectionInto={reorderSectionInto}
          onReorderDone={persistSectionOrder}
        />
        <main className="editor-main">
          <div 
            className="editor-container"
            style={{ maxWidth: `${editorMaxWidth}px` }}
          >
            <div 
              className="editor-resize-handle editor-resize-handle-left" 
              onMouseDown={handleMouseDown}
            />
            <div 
              className="editor-resize-handle editor-resize-handle-right" 
              onMouseDown={handleMouseDown}
            />
            {viewMode === 'section' && (
              <SectionView 
                section={currentSection} 
                onUpdateSection={updateSection} 
                onFocus={setActiveEditor}
              />
            )}
            {viewMode === 'long' && (
              <LongDocumentView 
                sections={sections} 
                activeSectionId={activeSectionId} 
                onUpdateSection={updateSection}
                onFocus={setActiveEditor}
              />
            )}
          </div>
        </main>
      </div>

      <AiFab onClick={() => setAiSidebarOpen((o) => !o)} isActive={aiSidebarOpen} />
      <AiSidebar isOpen={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />
    </>
  );
};

export default NoteEditor;
