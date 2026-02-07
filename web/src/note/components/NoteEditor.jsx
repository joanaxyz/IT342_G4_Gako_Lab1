import { useMemo, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Underline as UnderlineIcon,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Minus,
  Highlighter,
  Eraser,
  Sigma,
} from 'lucide-react';

const SYMBOL_GROUPS = [
  {
    label: 'Greek',
    symbols: ['α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π', 'σ', 'Ω'],
  },
  {
    label: 'Math',
    symbols: ['±', '×', '÷', '≈', '≠', '≤', '≥', '∞', '∑', '∏', '∫', '√'],
  },
  {
    label: 'Logic',
    symbols: ['∧', '∨', '¬', '⇒', '⇔', '∴'],
  },
  {
    label: 'Sets',
    symbols: ['∈', '∉', '⊂', '⊆', '⊇', '∪', '∩'],
  },
];

export const MenuBar = ({ editor }) => {
  const [showSymbolsMenu, setShowSymbolsMenu] = useState(false);

  if (!editor) {
    return null;
  }

  const blockType = useMemo(() => {
    if (editor.isActive('heading', { level: 1 })) return 'heading1';
    if (editor.isActive('heading', { level: 2 })) return 'heading2';
    if (editor.isActive('heading', { level: 3 })) return 'heading3';
    return 'paragraph';
  }, [editor]);

  const setBlockType = (value) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    switch (value) {
      case 'heading1':
        chain.toggleHeading({ level: 1 }).run();
        break;
      case 'heading2':
        chain.toggleHeading({ level: 2 }).run();
        break;
      case 'heading3':
        chain.toggleHeading({ level: 3 }).run();
        break;
      default:
        chain.setParagraph().run();
    }
  };

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || '');

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  };

  const insertSymbol = (symbol) => {
    editor.chain().focus().insertContent(symbol).run();
  };

  return (
    <div className="editor-menu-bar">
      <div className="menu-group">
        <select
          className="editor-block-select"
          value={blockType}
          onChange={(e) => setBlockType(e.target.value)}
          title="Paragraph / Heading"
        >
          <option value="paragraph">Normal text</option>
          <option value="heading1">Heading 1</option>
          <option value="heading2">Heading 2</option>
          <option value="heading3">Heading 3</option>
        </select>
      </div>

      <div className="divider"></div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <Strikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
          title="Inline code"
        >
          <Code size={18} />
        </button>
      </div>

      <div className="divider"></div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal rule"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          title="Code block"
        >
          <Code size={18} />
        </button>
      </div>

      <div className="divider"></div>

      <div className="menu-group">
        <button
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Add / edit link"
        >
          <LinkIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Remove link"
        >
          <LinkIcon size={18} style={{ textDecoration: 'line-through' }} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'is-active' : ''}
          title="Highlight"
        >
          <Highlighter size={18} />
        </button>
        <div className="symbols-menu-wrapper">
          <button
            type="button"
            className={showSymbolsMenu ? 'is-active' : ''}
            onClick={() => setShowSymbolsMenu((prev) => !prev)}
            title="Symbols & equations"
          >
            <Sigma size={18} />
          </button>
          {showSymbolsMenu && (
            <div className="symbols-menu-dropdown">
              {SYMBOL_GROUPS.map((group) => (
                <div key={group.label} className="symbols-menu-group">
                  <div className="symbols-menu-label">{group.label}</div>
                  <div className="symbols-menu-items">
                    {group.symbols.map((symbol) => (
                      <button
                        key={symbol}
                        type="button"
                        className="symbols-menu-btn"
                        onClick={() => insertSymbol(symbol)}
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="divider"></div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align left"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align center"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align right"
        >
          <AlignRight size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
          title="Justify"
        >
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="divider"></div>

      <div className="menu-group">
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear formatting"
        >
          <Eraser size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

const DocumentEditor = ({ editor }) => {
  return (
    <div className="document-editor">
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
};

export default DocumentEditor;
