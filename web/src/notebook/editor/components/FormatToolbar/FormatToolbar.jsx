import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';

const FormatToolbar = ({ editor }) => {
  return (
    <div className={`format-toolbar ${!editor ? 'is-disabled' : ''}`} role="toolbar" aria-label="Formatting">
      <button
        type="button"
        className={`format-toolbar-btn ${editor?.isActive('bold') ? 'is-active' : ''}`}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        disabled={!editor}
        title="Bold"
        aria-label="Bold"
      >
        <Bold size={18} strokeWidth={2} />
      </button>
      <button
        type="button"
        className={`format-toolbar-btn ${editor?.isActive('italic') ? 'is-active' : ''}`}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        disabled={!editor}
        title="Italic"
        aria-label="Italic"
      >
        <Italic size={18} strokeWidth={2} />
      </button>
      <div className="format-toolbar-divider" />
      <button
        type="button"
        className={`format-toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor}
        title="Heading"
        aria-label="Heading"
      >
        <Heading2 size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={`format-toolbar-btn ${editor?.isActive('bulletList') ? 'is-active' : ''}`}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        disabled={!editor}
        title="Bullet list"
        aria-label="Bullet list"
      >
        <List size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        className={`format-toolbar-btn ${editor?.isActive('orderedList') ? 'is-active' : ''}`}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        disabled={!editor}
        title="Numbered list"
        aria-label="Numbered list"
      >
        <ListOrdered size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default FormatToolbar;
