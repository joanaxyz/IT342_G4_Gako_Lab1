import { useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PlaybackBar from '../PlaybackBar/PlaybackBar';
import EditableTitle from '../../../../common/components/EditableTitle';

const LongDocSection = ({ section, depth, onFocus, setSectionRef, onUpdateSection }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: section.content || '',
    onBlur: ({editor}) =>{
      onUpdateSection(section.id, {content: editor.getHTML()});
    },
    onFocus: () => onFocus(editor),
    editorProps: {
      attributes: {
        class: 'long-doc-section-body',
      },
    },
  }, [section.id]);

  return (
    <section
      key={section.id}
      ref={(el) => setSectionRef(section.id, el)}
      id={`section-${section.id}`}
      className="long-doc-section"
      data-depth={depth}
    >
      <EditableTitle
        initialTitle={section.title}
        onSave={(newTitle) => onUpdateSection(section.id, { title: newTitle })}
        className="long-doc-section-title"
      />
      <EditorContent editor={editor} />
      {section.children?.length > 0 && (
        <div className="long-doc-children">
          {section.children.map((child) => (
            <LongDocSection
              key={child.id}
              section={child}
              depth={depth + 1}
              onFocus={onFocus}
              setSectionRef={setSectionRef}
              onUpdateSection={onUpdateSection}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const LongDocumentView = ({ sections, activeSectionId, onUpdateSection, onFocus }) => {
  const containerRef = useRef(null);
  const sectionRefs = useRef({});

  const setSectionRef = (id, el) => {
    sectionRefs.current[id] = el;
  };

  useEffect(() => {
    if (activeSectionId && sectionRefs.current[activeSectionId] && containerRef.current) {
      sectionRefs.current[activeSectionId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSectionId]);

  return (
    <div ref={containerRef} className="long-document-view">
      <div className="long-document-inner">
        {sections.map((section) => (
          <LongDocSection
            key={section.id}
            section={section}
            depth={0}
            onFocus={onFocus}
            setSectionRef={setSectionRef}
            onUpdateSection={onUpdateSection}
          />
        ))}
      </div>
      <PlaybackBar />
    </div>
  );
};


export default LongDocumentView;
