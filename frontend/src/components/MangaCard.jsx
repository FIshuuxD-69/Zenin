import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, User, Heart, ThumbsUp } from 'lucide-react';
import { getRatingColor } from '../lib/utils';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const MangaCard = ({ manga, onToggleFavorite }) => {
    const [isFav, setIsFav] = useState(manga.isFavourite);

    const toggleFavourite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const newFavStatus = !isFav;
        setIsFav(newFavStatus);
        if (onToggleFavorite) onToggleFavorite(manga._id, newFavStatus);

        try {
            await axiosInstance.put(`${manga._id}`, {
                isFavourite: newFavStatus
            });
            toast.success(newFavStatus ? 'Added to favorites' : 'Removed from favorites');
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            setIsFav(!newFavStatus);
            if (onToggleFavorite) onToggleFavorite(manga._id, !newFavStatus);
            toast.error('Failed to update favorite status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Reading': return 'bg-primary text-background';
            case 'Completed': return 'bg-green-500 text-white';
            case 'Plan to Read': return 'bg-blue-500 text-white';
            case 'Dropped': return 'bg-red-500 text-white';
            case 'On Hold': return 'bg-yellow-500 text-background';
            default: return 'bg-surface-light text-text-muted';
        }
    };

    return (
        <Link
            to={`/manga/${manga._id}`}
            className="block group relative glass-panel rounded-3xl overflow-hidden card-hover-effect border border-white/5"
        >
            <div className="aspect-[2/3] overflow-hidden relative">
                {manga.posterUrl ? (
                    <img
                        src={manga.posterUrl}
                        alt={manga.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface/50 border border-white/5">
                        <BookOpen className="w-16 h-16 opacity-20" />
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${getStatusColor(manga.readStatus)}`}>
                        {manga.readStatus}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${manga.mangaStatus === 'Ongoing' ? 'bg-green-500' : manga.mangaStatus === 'Completed' ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
                        {manga.mangaStatus}
                    </span>
                </div>

                {/* Action Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                    <button
                        type="button"
                        onClick={toggleFavourite}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${isFav ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-background/40 text-white/60 hover:text-white border border-white/10'}`}
                    >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    {manga.isRecommended && (
                        <div className="p-2.5 rounded-full bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] backdrop-blur-md">
                            <ThumbsUp className="w-4 h-4 fill-current" />
                        </div>
                    )}
                </div>

                {/* Gradient Overlay for Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 pt-10">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {manga.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                        <User className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{manga.author}</span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-primary fill-current" />
                            <span className="text-xs font-black text-white">{manga.rating || 'N/A'}</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-bold text-text-muted uppercase">
                            {manga.type}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MangaCard;
