import FormatToolbar from './FormatToolbar';
import PlaybackBar from './PlaybackBar';

const SectionView = ({ section }) => {
  return (
    <div className="section-view">
      <article className="section-view-content">
        <h1 className="section-view-title">{section?.title || 'Untitled section'}</h1>
        <FormatToolbar />
        <div className="section-view-body" contentEditable suppressContentEditableWarning>
          <p>
            This is the content area for the current section. Use the toolbar above for bold, italic,
            lists, and headings. In Section view, only one section is visible at a time for focused study.
          </p>
          <p>
            BrainBox keeps your attention on a single topic before moving to the next, supporting
            deeper comprehension and retention.
          </p>
        </div>
      </article>
      <PlaybackBar />
    </div>
  );
};

export default SectionView;
