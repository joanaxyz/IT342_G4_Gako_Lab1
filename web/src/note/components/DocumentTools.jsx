import React from 'react';
import { Save, FileDown, FileType } from 'lucide-react';

const DocumentTools = ({ onSave, onExportPdf, onExportDocx }) => {
  return (
    <div className="right-sidebar-group">
      <div className="right-icon" onClick={onSave} title="Save note">
        <Save size={24} />
      </div>
      <div className="right-icon" onClick={onExportPdf} title="Export as PDF">
        <FileDown size={24} />
      </div>
      <div className="right-icon" onClick={onExportDocx} title="Export as Word">
        <FileType size={24} />
      </div>
    </div>
  );
};

export default DocumentTools;
