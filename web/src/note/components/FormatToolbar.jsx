import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';

const FormatToolbar = () => {
  return (
    <div className="format-toolbar" role="toolbar" aria-label="Formatting">
      <button type="button" className="format-toolbar-btn" title="Bold" aria-label="Bold">
        <Bold size={18} strokeWidth={2} />
      </button>
      <button type="button" className="format-toolbar-btn" title="Italic" aria-label="Italic">
        <Italic size={18} strokeWidth={2} />
      </button>
      <div className="format-toolbar-divider" />
      <button type="button" className="format-toolbar-btn" title="Heading" aria-label="Heading">
        <Heading2 size={18} strokeWidth={1.75} />
      </button>
      <button type="button" className="format-toolbar-btn" title="Bullet list" aria-label="Bullet list">
        <List size={18} strokeWidth={1.75} />
      </button>
      <button type="button" className="format-toolbar-btn" title="Numbered list" aria-label="Numbered list">
        <ListOrdered size={18} strokeWidth={1.75} />
      </button>
    </div>
  );
};

export default FormatToolbar;
