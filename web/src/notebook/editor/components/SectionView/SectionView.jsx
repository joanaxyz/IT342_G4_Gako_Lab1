import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import PlaybackBar from '../PlaybackBar/PlaybackBar';
import EditableTitle from '../../../../common/components/EditableTitle';

const SectionView = ({ section, onUpdateSection, onFocus }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: section?.content || '',
    onBlur: ({editor}) =>{
      onUpdateSection(section.id, {content: editor.getHTML()});
    },
    onFocus: () => onFocus(editor),
    editorProps: {
      attributes: {
        class: 'section-view-body',
      },
    },
  }, [section?.id]);

  return (
    <div className="section-view">
      <article className="section-view-content">
        <EditableTitle
          tag="h1"
          initialTitle={section?.title}
          onSave={(newTitle) => onUpdateSection(section.id, { title: newTitle })}
          className="section-view-title"
        />
        <EditorContent editor={editor} />
      </article>
      <PlaybackBar />
    </div>
  );
};



export default SectionView;
