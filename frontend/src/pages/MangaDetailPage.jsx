import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft, Trash2, Edit, Star, BookOpen,
    Calendar, Layers, MonitorPlay, CheckCircle2, Bookmark, Heart, ThumbsUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { getRatingColor } from '../lib/utils';

const MangaDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await axiosInstance.get(`${id}`);
                setManga(response.data);
            } catch (error) {
                console.error('Failed to fetch manga detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchManga();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete this from your collection?');
        if (!confirmDelete) return;

        try {
            setIsDeleting(true);
            await axiosInstance.delete(`${id}`);
            toast.success('Removed from collection');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete manga:', error);
            toast.error(error.response?.data?.message || 'Failed to delete');
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_40px_rgba(245,158,11,0.2)]"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Synchronizing Data...</span>
            </div>
        );
    }

    if (!manga) {
        return (
            <div className="text-center py-40">
                <div className="inline-flex p-6 bg-red-500/10 rounded-full mb-6">
                    <BookOpen className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-white uppercase italic mb-4">Entry Undiscoverable</h2>
                <button
                    onClick={() => navigate('/')}
                    className="text-primary font-black uppercase tracking-widest text-[10px] hover:underline"
                >
                    Return to Mission Control
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row gap-12">

                {/* Left Col: Hero Poster & Primary Actions */}
                <div className="lg:w-[380px] space-y-8 flex-shrink-0">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="aspect-[3/4.5] bg-surface rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl z-10">
                            {manga.posterUrl ? (
                                <img
                                    src={manga.posterUrl}
                                    alt={manga.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-text-muted gap-4">
                                    <BookOpen className="w-20 h-20 opacity-10" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">No Visualization</span>
                                </div>
                            )}

                            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]"></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{manga.readStatus}</span>
                                </div>
                                <div className="px-4 py-2 bg-blue-500/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-2 w-fit">
                                    <div className={`w-1.5 h-1.5 rounded-full ${manga.mangaStatus === 'Ongoing' ? 'bg-green-500' : manga.mangaStatus === 'Completed' ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{manga.mangaStatus}</span>
                                </div>
                            </div>

                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
                                {manga.isFavourite && (
                                    <div className="p-2.5 bg-red-500 backdrop-blur-xl rounded-2xl shadow-xl">
                                        <Heart className="w-4 h-4 text-white fill-current" />
                                    </div>
                                )}
                                {manga.isRecommended && (
                                    <div className="p-2.5 bg-blue-500 backdrop-blur-xl rounded-2xl shadow-xl">
                                        <ThumbsUp className="w-4 h-4 text-white fill-current" />
                                    </div>
                                )}
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 group relative z-10">
                        <button
                            onClick={() => navigate(`/edit/${id}`)}
                            className="w-full px-8 py-4 bg-white text-background hover:bg-primary hover:text-background transition-all rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95"
                        >
                            <Edit className="w-4 h-4" />
                            Modify Records
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="w-full px-8 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-black uppercase tracking-widest text-xs border border-red-500/20 hover:border-transparent flex items-center justify-center gap-3 active:scale-95"
                        >
                            <Trash2 className="w-4 h-4" />
                            {isDeleting ? 'Erasing...' : 'Delete Entry'}
                        </button>
                    </div>
                </div>

                {/* Right Col: Deep Intelligence (Bento Layout) */}
                <div className="flex-grow space-y-8">
                    {/* Primary Header */}
                    <div className="glass-panel rounded-[2.5rem] p-10 relative overflow-hidden group">
                        <div className="absolute -right-20 -top-20 bg-primary/5 w-60 h-60 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-primary text-background text-[10px] font-black uppercase tracking-[0.2em] rounded-xl">
                                {manga.type}
                            </span>
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-surface-light/40 border border-white/5 rounded-xl">
                                <Star className={`w-3.5 h-3.5 ${getRatingColor(manga.rating)} fill-current`} />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                    {manga.rating || 'N/A'}<span className="text-text-muted"> / 10</span>
                                </span>
                            </div>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4 uppercase italic leading-none">
                            {manga.title}
                        </h1>

                        {manga.description && (
                            <p className="text-text-muted text-sm font-medium mb-6 line-clamp-3 hover:line-clamp-none transition-all cursor-default max-w-2xl bg-white/5 p-4 rounded-2xl border border-white/5 whitespace-pre-wrap break-words">
                                {manga.description}
                            </p>
                        )}
                        <div className="flex items-center gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Author / Producer</label>
                                <p className="text-xl font-bold text-white">{manga.author}</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 block mb-1">Release Protocol</label>
                                <p className="text-xl font-bold text-white">{manga.releaseYear || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-8">
                            {manga.genre && manga.genre.map((g, idx) => (
                                <span key={idx} className="px-4 py-2 rounded-xl bg-surface border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white hover:border-primary/30 transition-all cursor-default shadow-sm">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Technical Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 group hover:border-primary/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Asset Volume</span>
                            </div>
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Chapters</h3>
                            <p className="text-4xl font-black text-white italic">{manga.chapters || '000'}</p>
                        </div>

                        <div className="glass-panel p-8 rounded-[2rem] border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                    <MonitorPlay className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Transmission Hub</span>
                            </div>
                            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Reading Platform</h3>
                            <p className="text-3xl font-black text-white italic uppercase truncate" title={manga.readingPlatform}>
                                {manga.readingPlatform || 'LOCAL ARCHIVE'}
                            </p>
                        </div>
                    </div>

                    {/* Metadata Analytics */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-6 bg-surface-light/20 border border-white/5 rounded-[2rem]">
                        <div className="flex items-center gap-10">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted block mb-1">Log Initialized</label>
                                <p className="text-xs font-bold text-white uppercase">{new Date(manga.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                            <div className="w-px h-8 bg-white/5 hidden sm:block"></div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.15em] text-text-muted block mb-1">Last Data Sync</label>
                                <p className="text-xs font-bold text-primary uppercase">{new Date(manga.updatedAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MangaDetailPage;
