import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit2, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

const EditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        chapters: 0,
        type: 'Manga',
        genre: '',
        rating: 0,
        readStatus: 'Plan to Read',
        readingPlatform: '',
        releaseYear: new Date().getFullYear(),
        posterUrl: '',
        isFavourite: false,
        description: ''
    });

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await axiosInstance.get(`${id}`);
                const manga = response.data;

                // Format genre array back to comma separated string for the input
                const formattedGenre = manga.genre ? manga.genre.join(', ') : '';

                setFormData({
                    title: manga.title || '',
                    author: manga.author || '',
                    chapters: manga.chapters || 0,
                    type: manga.type || 'Manga',
                    genre: formattedGenre,
                    rating: manga.rating || 0,
                    readStatus: manga.readStatus || 'Plan to Read',
                    readingPlatform: manga.readingPlatform || '',
                    releaseYear: manga.releaseYear || new Date().getFullYear(),
                    posterUrl: manga.posterUrl || '',
                    isFavourite: manga.isFavourite || false,
                    description: manga.description || ''
                });
            } catch (error) {
                console.error('Failed to fetch manga for editing:', error);
                navigate('/'); // redirect if issue
            } finally {
                setIsLoading(false);
            }
        };

        fetchManga();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);

            // Process genre logically as an array
            const submitData = {
                ...formData,
                genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean)
            };

            await axiosInstance.put(`${id}`, submitData);
            toast.success('Manga updated successfully');
            navigate(`/manga/${id}`); // redirect back to detail view
        } catch (error) {
            console.error('Failed to update manga:', error);
            toast.error(error.response?.data?.message || 'Failed to update manga');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-40 flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_40px_rgba(245,158,11,0.2)]"></div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Retrieving Data...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="flex justify-between items-center mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 text-text-muted hover:text-white transition-all text-[10px] font-black uppercase tracking-widest bg-surface-light/20 px-6 py-3 rounded-2xl border border-white/5 hover:border-white/10"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="text-right">
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                        Edit Entry
                    </h1>
                    <p className="text-text-muted mt-1 text-sm font-medium">
                        Modifying: <span className="text-primary">{formData.title}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Manga Title *</label>
                        <input
                            required
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30"
                            placeholder="e.g. Solo Leveling"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Creator / Author *</label>
                        <input
                            required
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30"
                            placeholder="e.g. Chugong"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Total Chapters</label>
                        <input
                            type="number"
                            name="chapters"
                            value={formData.chapters}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Publication Type *</label>
                        <select
                            required
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold appearance-none cursor-pointer"
                        >
                            <option value="Manga">Manga</option>
                            <option value="Manhwa">Manhwa</option>
                            <option value="Manhua">Manhua</option>
                            <option value="Light Novel">Light Novel</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Genres * (comma separated)</label>
                        <input
                            required
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30"
                            placeholder="Action, Adventure, Supernatural"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Current Status *</label>
                        <select
                            required
                            name="readStatus"
                            value={formData.readStatus}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold appearance-none cursor-pointer"
                        >
                            <option value="Reading">Reading</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Dropped">Dropped</option>
                            <option value="Plan to Read">Plan to Read</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Rating (1-10)</label>
                        <input
                            type="number"
                            name="rating"
                            min="1" max="10"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Reading Hub / Platform</label>
                        <input
                            type="text"
                            name="readingPlatform"
                            value={formData.readingPlatform}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30"
                            placeholder="e.g. Tappytoon, Manganato"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Release Year</label>
                        <input
                            type="number"
                            name="releaseYear"
                            value={formData.releaseYear}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Media Poster URL</label>
                        <input
                            type="url"
                            name="posterUrl"
                            value={formData.posterUrl}
                            onChange={handleChange}
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30"
                            placeholder="https://images.collection.com/manga-cover.webp"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Manga Summary / Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-surface-light/30 border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-primary/50 focus:bg-surface-light/50 transition-all text-sm font-bold placeholder:text-text-muted/30 resize-none"
                            placeholder="Write a brief summary of the manga..."
                        ></textarea>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <label className="flex items-center gap-4 cursor-pointer group w-fit">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="isFavourite"
                                    checked={formData.isFavourite}
                                    onChange={handleChange}
                                    className="peer sr-only"
                                />
                                <div className="w-6 h-6 border-2 border-white/20 rounded-lg group-hover:border-primary transition-all peer-checked:bg-primary peer-checked:border-primary"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-background opacity-0 peer-checked:opacity-100 transition-opacity">
                                    <svg className="w-4 h-4 fill-current font-bold" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white group-hover:text-primary transition-colors">Mark as Primary Collection</span>
                        </label>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-12 mt-8 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-8 py-4 rounded-2xl bg-surface-light/20 text-text-muted hover:bg-white/5 hover:text-white transition-all font-black uppercase tracking-widest text-xs border border-white/5 flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 rounded-2xl bg-primary text-background hover:bg-primary-hover transition-all font-black uppercase tracking-widest text-xs flex-[2] flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_10px_30px_rgba(245,158,11,0.3)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.5)] active:scale-95"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            'Update Records'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPage;
