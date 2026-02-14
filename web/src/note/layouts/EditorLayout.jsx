import { Outlet } from 'react-router-dom';
import '../styles/editor-page.css';

const EditorLayout = () => {
  return (
    <div className="editor-layout">
      <Outlet />
    </div>
  );
};

export default EditorLayout;
