import { useRef, useEffect } from 'react';

const LongDocumentView = ({ sections, activeSectionId }) => {
  const containerRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (activeSectionId && sectionRefs.current[activeSectionId] && containerRef.current) {
      sectionRefs.current[activeSectionId].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeSectionId]);

  const renderSection = (section, depth = 0) => (
    <section
      key={section.id}
      ref={(el) => { sectionRefs.current[section.id] = el; }}
      id={`section-${section.id}`}
      className="long-doc-section"
      data-depth={depth}
    >
      <h2 className="long-doc-section-title">{section.title || 'Untitled section'}</h2>
      <div className="long-doc-section-body">
        <p>
          Section content appears here. In Long document view, all sections are shown in one
          continuous scroll—like a chapter or textbook. Use the sidebar to jump to any section.
        </p>
      </div>
      {section.children?.length > 0 && (
        <div className="long-doc-children">
          {section.children.map((child) => renderSection(child, depth + 1))}
        </div>
      )}
    </section>
  );

  return (
    <div ref={containerRef} className="long-document-view">
      <div className="long-document-inner">
        {sections.map((section) => renderSection(section))}
      </div>
    </div>
  );
};

export default LongDocumentView;
