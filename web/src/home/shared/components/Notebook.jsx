import { Link } from "react-router-dom"
import { BookOpen, Clock, FileText } from 'lucide-react';
import { formatUpdatedAt } from "../../../common/utils/date";

const Notebook = ({ notebook, variant = 'continue' }) => {
    const isLibrary = variant === 'library';
    const cardClass = isLibrary ? 'dashboard-library-card' : 'dashboard-continue-card';
    const iconClass = isLibrary ? 'dashboard-library-card-icon' : 'dashboard-continue-icon';
    const metaClass = isLibrary ? 'dashboard-library-meta' : 'dashboard-continue-meta';

    return (
        <Link to={`/notebook/${notebook.id}`} className={`${cardClass} ${cardClass}-link`}>
            <div className={iconClass}>
                {isLibrary ? (
                    <FileText size={22} strokeWidth={1.75} />
                ) : (
                    <BookOpen size={22} strokeWidth={1.75} />
                )}
            </div>
            <h3>{notebook.title}</h3>
            <div className={metaClass}>
                {isLibrary ? (
                    `${notebook.sections?.length || 0} sections`
                ) : (
                    <>
                        <Clock size={14} />
                        {formatUpdatedAt(notebook.updatedAt)}
                    </>
                )}
            </div>
        </Link>
    );
};

export default Notebook;