import { BookX } from 'lucide-react';
import { Link } from 'react-router-dom';

const MangaNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 glass-panel rounded-2xl">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 border border-white/5">
                <BookX className="w-12 h-12 text-textMuted" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Mangas Found</h2>
            <p className="text-textMuted mb-6 max-w-md">
                We couldn't track down any manga in your collection. You can add your first one to get started!
            </p>
            <Link
                to="/create"
                className="px-6 py-3 bg-primary hover:bg-primaryHover text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary/20"
            >
                Add New Manga
            </Link>
        </div>
    );
};

export default MangaNotFound;
