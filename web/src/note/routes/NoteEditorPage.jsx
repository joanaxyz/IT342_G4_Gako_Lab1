import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { History } from 'lucide-react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import NoteEditor, { MenuBar } from '../components/NoteEditor';
import SidebarLeft from '../components/SidebarLeft';
import SidebarRight from '../components/SidebarRight';
import ChatSidebar from '../components/ChatSidebar';
import HistorySidebar from '../components/HistorySidebar';
import StatsBar from '../components/StatsBar';
import Modal from '../../common/components/Modal';
import logo from '../../assets/logo.png';
import '../styles/editor-page.css';

const NoteEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Mock data for initial implementation
    const [documents, setDocuments] = useState([
        { id: '1', title: 'Operating Systems - Chapter 4', category: 'Computer Science', lastEdited: '2026-02-06', content: '<h1>OS Chapter 4</h1><p>Process management and scheduling...</p>' },
        { id: '2', title: 'Database Normalization Notes', category: 'Computer Science', lastEdited: '2026-02-05', content: '<h1>Normalization</h1><p>1NF, 2NF, 3NF...</p>' },
        { id: '3', title: 'Calculus III - Integration', category: 'Mathematics', lastEdited: '2026-02-04', content: '<h1>Integration</h1><p>Multiple integrals...</p>' },
    ]);

    const categories = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Mathematics' },
        { id: 3, name: 'History' },
    ];

    const [currentDoc, setCurrentDoc] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showSearchPanel, setShowSearchPanel] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [replaceText, setReplaceText] = useState('');
    const [matches, setMatches] = useState([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    rel: 'noopener noreferrer nofollow',
                    target: '_blank',
                },
            }),
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            setCurrentDoc(prev => (prev ? { ...prev, content: editor.getHTML() } : null));
        },
        editorProps: {
            attributes: {
                class: 'editor-prosemirror',
            },
        },
    });

    useEffect(() => {
        if (editor && currentDoc && editor.getHTML() !== currentDoc.content) {
            editor.commands.setContent(currentDoc.content);
        }
    }, [currentDoc?.id, editor]);

    useEffect(() => {
        if (id === 'new') {
            setCurrentDoc({
                id: Date.now().toString(),
                title: 'Untitled document',
                category: 'Uncategorized',
                content: '',
                lastEdited: new Date().toISOString().split('T')[0]
            });
        } else {
            const doc = documents.find(d => d.id === id);
            if (doc) {
                setCurrentDoc({ ...doc });
            } else {
                // Handle not found
                navigate('/storage');
            }
        }
    }, [id, documents, navigate]);

    const categoryDocs = useMemo(() => {
        if (!currentDoc) return [];
        return documents.filter(doc => doc.category === currentDoc.category && doc.id !== currentDoc.id);
    }, [currentDoc, documents]);

    const handleSave = () => {
        setIsSaving(true);
        // Mock save delay
        setTimeout(() => {
            const existingDocIndex = documents.findIndex(doc => doc.id === currentDoc.id);
            if (existingDocIndex >= 0) {
                const newDocs = [...documents];
                newDocs[existingDocIndex] = currentDoc;
                setDocuments(newDocs);
            } else {
                setDocuments([...documents, currentDoc]);
            }
            setIsSaving(false);
            // Optionally navigate back or stay
        }, 800);
    };

    const handleBack = () => {
        navigate('/storage');
    };

    const toggleStats = () => {
        setShowStats(prev => !prev);
    };

    const toggleFocus = () => {
        setIsFocusMode(prev => !prev);
    };

    const toggleSearchPanel = () => {
        setShowSearchPanel(prev => !prev);
        if (!showSearchPanel) {
            setShowChat(false);
            setShowHistory(false);
        }
    };

    const toggleChat = () => {
        setShowChat(prev => !prev);
        if (!showChat) {
            setShowSearchPanel(false);
            setShowHistory(false);
        }
    };

    const toggleHistory = () => {
        setShowHistory(prev => !prev);
        if (!showHistory) {
            setShowSearchPanel(false);
            setShowChat(false);
        }
    };

    useEffect(() => {
        const handler = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
                event.preventDefault();
                setShowSearchPanel(true);
            }
        };

        window.addEventListener('keydown', handler);
        return () => {
            window.removeEventListener('keydown', handler);
        };
    }, []);

    const stats = useMemo(() => {
        if (!currentDoc?.content) {
            return { words: 0, characters: 0, readingMinutes: 0 };
        }
        const plain = currentDoc.content
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .trim();
        if (!plain) {
            return { words: 0, characters: 0, readingMinutes: 0 };
        }
        const words = plain.split(/\s+/).length;
        const characters = plain.replace(/\s/g, '').length;
        const readingMinutes = Math.max(1, Math.round(words / 200));
        return { words, characters, readingMinutes };
    }, [currentDoc?.content]);

    const findMatchesInDoc = (query) => {
        if (!editor || !query) {
            return [];
        }
        const found = [];
        const { doc } = editor.state;
        const lowerQuery = query.toLowerCase();

        doc.descendants((node, pos) => {
            if (!node.isText || !node.text) return;
            const text = node.text;
            const lowerText = text.toLowerCase();
            let fromIndex = 0;
            let index;
            while ((index = lowerText.indexOf(lowerQuery, fromIndex)) !== -1) {
                found.push({
                    from: pos + index,
                    to: pos + index + query.length,
                });
                fromIndex = index + query.length;
            }
        });

        return found;
    };

    const updateSearchResults = (query) => {
        if (!query) {
            setMatches([]);
            setCurrentMatchIndex(-1);
            return;
        }
        const found = findMatchesInDoc(query);
        setMatches(found);
        setCurrentMatchIndex(found.length ? 0 : -1);
        if (found.length) {
            editor
                ?.chain()
                .setTextSelection(found[0])
                .scrollIntoView()
                .run();
        }
    };

    const handleSearchQueryChange = (value) => {
        setSearchQuery(value);
        updateSearchResults(value);
    };

    const goToMatch = (indexDelta) => {
        if (!matches.length || !editor) return;
        let newIndex = currentMatchIndex + indexDelta;
        if (newIndex < 0) newIndex = matches.length - 1;
        if (newIndex >= matches.length) newIndex = 0;
        setCurrentMatchIndex(newIndex);
        const match = matches[newIndex];
        editor
            .chain()
            .setTextSelection(match)
            .scrollIntoView()
            .run();
    };

    const handleReplaceOne = () => {
        if (!editor || !matches.length || currentMatchIndex < 0) return;
        const match = matches[currentMatchIndex];
        editor
            .chain()
            .focus()
            .setTextSelection(match)
            .insertContent(replaceText)
            .run();
        updateSearchResults(searchQuery);
    };

    const handleReplaceAll = () => {
        if (!editor || !matches.length) return;
        const allMatches = findMatchesInDoc(searchQuery);
        if (!allMatches.length) return;

        const chain = editor.chain().focus();
        for (let i = allMatches.length - 1; i >= 0; i -= 1) {
            const m = allMatches[i];
            chain.setTextSelection(m).insertContent(replaceText);
        }
        chain.run();
        updateSearchResults(searchQuery);
    };

    if (!currentDoc) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="google-docs-editor">
            <header className="docs-header">
                <div className="header-left">
                    <img src={logo} alt="BrainBox" className="docs-logo" onClick={handleBack} />
                        <div className="docs-title-container">
                            <div className="title-row">
                                <input 
                                    type="text" 
                                    className="docs-title-input" 
                                    value={currentDoc.title}
                                    onChange={(e) => setCurrentDoc(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Untitled note"
                                />
                                <div className="docs-star">☆</div>
                            </div>
                            {isSaving && <span className="saving-status">Saving...</span>}
                        </div>
                </div>
                <div className="header-right">
                    <button className="icon-btn-docs" onClick={toggleHistory}><History size={20} /></button>
                    <div className="user-avatar-docs">J</div>
                </div>
            </header>

            <MenuBar editor={editor} />

            {showStats && <StatsBar stats={stats} />}

            <div className="docs-main-container">
                {!isFocusMode && (
                    <SidebarLeft
                        currentDoc={currentDoc}
                        categoryDocs={categoryDocs}
                        categories={categories}
                        onSelectDoc={(docId) => navigate(`/document/${docId}`)}
                        onChangeCategory={(category) =>
                            setCurrentDoc((prev) => ({ ...prev, category }))
                        }
                    />
                )}
                
                <main className={`docs-editor-content ${isFocusMode ? 'focus-mode' : ''}`}>
                    <div className="editor-paper">
                        <NoteEditor 
                            editor={editor}
                        />
                    </div>
                </main>

                {!isFocusMode && (
                    <SidebarRight
                        onSave={handleSave}
                        onClose={handleBack}
                        onExportPdf={() => {}}
                        onExportDocx={() => {}}
                        onToggleStats={toggleStats}
                        showStats={showStats}
                        onToggleFocus={toggleFocus}
                        isFocusMode={isFocusMode}
                        onToggleSearch={toggleSearchPanel}
                        onToggleChat={toggleChat}
                        onToggleHistory={toggleHistory}
                    />
                )}

                {!isFocusMode && (
                    <>
                        <ChatSidebar isVisible={showChat} />
                        <HistorySidebar isVisible={showHistory} />
                    </>
                )}
            </div>

            <Modal 
                isOpen={showSearchPanel} 
                onClose={toggleSearchPanel}
                title="Search and Replace"
            >
                <div className="docs-search-panel" style={{ border: 'none', padding: 0 }}>
                    <div className="docs-search-row">
                        <input
                            type="text"
                            className="docs-search-input"
                            placeholder="Find..."
                            value={searchQuery}
                            onChange={(e) => handleSearchQueryChange(e.target.value)}
                        />
                    </div>
                    <div className="docs-search-row">
                        <input
                            type="text"
                            className="docs-search-input"
                            placeholder="Replace with..."
                            value={replaceText}
                            onChange={(e) => setReplaceText(e.target.value)}
                        />
                    </div>
                    <div className="docs-search-actions">
                        <button type="button" onClick={() => goToMatch(-1)}>
                            Prev
                        </button>
                        <button type="button" onClick={() => goToMatch(1)}>
                            Next
                        </button>
                        <button type="button" onClick={handleReplaceOne}>
                            Replace
                        </button>
                        <button type="button" onClick={handleReplaceAll}>
                            Replace all
                        </button>
                    </div>
                    <div className="docs-search-status">
                        {matches.length > 0 ? (
                            <span>
                                {currentMatchIndex + 1} / {matches.length}
                            </span>
                        ) : (
                            <span>No matches</span>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default NoteEditorPage;
