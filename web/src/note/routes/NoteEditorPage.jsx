import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EditorNavbar from '../components/EditorNavbar';
import TocSidebar from '../components/TocSidebar';
import SectionView from '../components/SectionView';
import LongDocumentView from '../components/LongDocumentView';
import AiSidebar from '../components/AiSidebar';
import AiFab from '../components/AiFab';

const initialSections = () => [
  { id: '1', title: 'Introduction', children: [] },
  {
    id: '2',
    title: 'Core Concepts',
    children: [
      { id: '2a', title: 'Definitions', children: [] },
      { id: '2b', title: 'Key Principles', children: [] },
    ],
  },
  { id: '3', title: 'Methods', children: [] },
  { id: '4', title: 'Applications', children: [] },
  { id: '5', title: 'Summary', children: [] },
];

let nextId = 100;

function getFirstSectionId(sections) {
  if (!sections?.length) return null;
  return sections[0].id;
}

function findSectionById(sections, id) {
  for (const s of sections) {
    if (s.id === id) return s;
    const found = findSectionById(s.children || [], id);
    if (found) return found;
  }
  return null;
}

function insertAfterInList(list, afterId, newSection) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === afterId) {
      const next = [...list];
      next.splice(i + 1, 0, newSection);
      return next;
    }
    const inChild = insertAfterInList(list[i].children || [], afterId, newSection);
    if (inChild !== null) {
      return list.map((s, j) => (j === i ? { ...s, children: inChild } : s));
    }
  }
  return null;
}

function appendChildToParent(list, parentId, newSection) {
  return list.map((s) => {
    if (s.id === parentId) {
      return { ...s, children: [...(s.children || []), newSection] };
    }
    return { ...s, children: appendChildToParent(s.children || [], parentId, newSection) };
  });
}

const NoteEditorPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('section');
  const [sections, setSections] = useState(initialSections);
  const [activeSectionId, setActiveSectionId] = useState(() =>
    getFirstSectionId(initialSections())
  );
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

  const activeSection = useMemo(
    () => findSectionById(sections, activeSectionId) || sections[0],
    [sections, activeSectionId]
  );

  const notebookTitle = id === 'new' ? 'New notebook' : 'Introduction to Neuroscience';

  const addNewSection = useCallback((parentId, afterId) => {
    const sid = `s${nextId++}`;
    const newSection = { id: sid, title: 'New section', children: [] };
    setSections((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (afterId != null) {
        const next = insertAfterInList(copy, afterId, newSection);
        return next ?? copy;
      }
      if (parentId != null) return appendChildToParent(copy, parentId, newSection);
      return [...copy, newSection];
    });
    setActiveSectionId(sid);
  }, []);

  const handleAddTopLevel = useCallback(() => addNewSection(null, null), [addNewSection]);
  const handleAddChild = useCallback((parentId) => addNewSection(parentId, null), [addNewSection]);
  const handleAddAfter = useCallback((afterId) => addNewSection(null, afterId), [addNewSection]);

  return (
    <>
      <EditorNavbar
        notebookTitle={notebookTitle}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <div className="editor-body">
        <TocSidebar
          sections={sections}
          activeSectionId={activeSectionId}
          onSelectSection={setActiveSectionId}
          onAddTopLevel={handleAddTopLevel}
          onAddChild={handleAddChild}
          onAddAfter={handleAddAfter}
        />
        <main className="editor-main">
          {viewMode === 'section' && <SectionView section={activeSection} />}
          {viewMode === 'long' && (
            <LongDocumentView sections={sections} activeSectionId={activeSectionId} />
          )}
        </main>
      </div>

      <AiFab onClick={() => setAiSidebarOpen((o) => !o)} isActive={aiSidebarOpen} />
      <AiSidebar isOpen={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />
    </>
  );
};

export default NoteEditorPage;
