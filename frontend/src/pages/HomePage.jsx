import { useState, useEffect, useMemo, useRef } from 'react';
import { Filter, SortAsc, Search, Heart, Trophy, LayoutGrid, ChevronDown } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useSearch } from '../context/SearchContext';
import MangaCard from '../components/MangaCard';
import MangaNotFound from '../components/MangaNotFound';

const HomePage = () => {
    const [mangas, setMangas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const { searchTerm, setSearchTerm } = useSearch();
    const [sortField, setSortField] = useState('title');
    const [activeTab, setActiveTab] = useState('all');
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const dropdownRef = useRef(null);
    const sortDropdownRef = useRef(null);

    useEffect(() => {
        fetchMangas();
    }, [sortField, searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsGenreOpen(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchMangas = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (sortField) queryParams.append('sort', sortField);
            if (searchTerm) queryParams.append('search', searchTerm);

            const response = await axiosInstance.get(`?${queryParams.toString()}`);
            setMangas(response.data);
        } catch (error) {
            console.error('Failed to fetch mangas:', error);
        } finally {
            setLoading(false);
        }
    };

    const uniqueGenres = useMemo(() => {
        const genres = new Set();
        mangas.forEach(manga => {
            if (manga.genre && Array.isArray(manga.genre)) {
                manga.genre.forEach(g => genres.add(g));
            }
        });
        return Array.from(genres).sort();
    }, [mangas]);

    const filteredMangas = useMemo(() => {
        let result = mangas;

        if (activeTab === 'favorites') {
            result = result.filter(manga => manga.isFavourite);
        } else if (activeTab === 'recommended') {
            result = result.filter(manga => manga.isRecommended || manga.rating >= 8);
        } else if (activeTab !== 'all') {
            result = result.filter(manga => manga.readStatus === activeTab);
        }

        if (filter) {
            result = result.filter(manga =>
                manga.genre && manga.genre.includes(filter)
            );
        }

        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase();
            result = result.filter(manga => {
                const matchesTitle = manga.title && manga.title.toLowerCase().includes(lowercasedSearch);
                const matchesAuthor = manga.author && manga.author.toLowerCase().includes(lowercasedSearch);
                const matchesGenre = manga.genre && manga.genre.some(g => g.toLowerCase().includes(lowercasedSearch));
                return matchesTitle || matchesAuthor || matchesGenre;
            });
        }

        return result;
    }, [mangas, filter, searchTerm, activeTab]);

    const statusTabs = [
        { id: 'all', label: 'All' },
        { id: 'Reading', label: 'Reading' },
        { id: 'Completed', label: 'Completed' },
        { id: 'Plan to Read', label: 'To Read' },
        { id: 'On Hold', label: 'On Hold' },
        { id: 'Dropped', label: 'Dropped' },
    ];

    const sortOptions = [
        { value: 'title', label: 'Title (A-Z)' },
        { value: '-rating', label: 'Highest Rated' },
        { value: '-releaseYear', label: 'Newest First' },
        { value: 'releaseYear', label: 'Oldest First' },
    ];

    const handleToggleFavorite = (id, isFavourite) => {
        setMangas(prev => prev.map(m => m._id === id ? { ...m, isFavourite } : m));
    };

    return (
        <div className="w-full pb-20 max-w-7xl mx-auto">
            {/* Discovery Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-8">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-primary/10 rounded-3xl border border-primary/20 hidden sm:block shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                        <LayoutGrid className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase italic">
                                Discovery
                            </h1>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full h-fit mt-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">System Online</span>
                            </div>
                        </div>
                        <p className="text-text-muted text-sm font-medium">Explore your curated manga universe and track your reading journey.</p>
                    </div>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    {/* Search Field (Local Override) */}
                    <div className="relative flex-grow lg:w-80">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Filter current view..."
                            className="w-full pl-11 pr-4 py-3 bg-surface/50 border border-white/5 rounded-2xl focus:outline-none focus:border-primary/40 focus:bg-surface transition-all text-sm font-bold placeholder:text-text-muted/50"
                        />
                    </div>
                </div>
            </div>

            {/* Status Tabs (Pill Buttons) */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${activeTab === tab.id
                            ? 'bg-primary text-background border-primary shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-105'
                            : 'bg-surface-light/40 text-text-muted border-white/5 hover:bg-surface-light hover:text-white hover:border-white/10'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Second Row: Filters & Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 glass-panel p-2 rounded-2xl relative z-50">
                <div className="flex gap-2 w-full">
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'favorites' ? 'bg-red-500 text-white shadow-lg' : 'bg-surface-light/50 text-text-muted hover:text-white'}`}
                    >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        Favorites
                    </button>
                    <button
                        onClick={() => setActiveTab('recommended')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'recommended' ? 'bg-yellow-500 text-background shadow-lg' : 'bg-surface-light/50 text-text-muted hover:text-white'}`}
                    >
                        <Trophy className="w-3.5 h-3.5 fill-current" />
                        Top Picks
                    </button>

                    <div className="hidden md:block flex-grow"></div>

                    {/* Genre Dropdown */}
                    <div className="relative flex-grow md:flex-none md:min-w-[180px]" ref={dropdownRef}>
                        <button
                            onClick={() => setIsGenreOpen(!isGenreOpen)}
                            className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 bg-background/50 border border-white/5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white hover:bg-surface-light"
                        >
                            <Filter className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                            <span className="truncate">{filter || 'All Genres'}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isGenreOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isGenreOpen && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-surface border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl backdrop-blur-xl p-2 space-y-1">
                                <button
                                    onClick={() => { setFilter(''); setIsGenreOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${!filter ? 'bg-primary text-background' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
                                >
                                    All Genres
                                </button>
                                {uniqueGenres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => { setFilter(genre); setIsGenreOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${filter === genre ? 'bg-primary text-background' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative flex-grow md:flex-none md:min-w-[180px]" ref={sortDropdownRef}>
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="w-full flex items-center justify-between pl-10 pr-4 py-2.5 bg-background/50 border border-white/5 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-white hover:bg-surface-light"
                        >
                            <SortAsc className="w-3.5 h-3.5 absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                            <span className="truncate">
                                {sortOptions.find(opt => opt.value === sortField)?.label || 'Sort By'}
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isSortOpen && (
                            <div className="absolute top-full right-0 mt-3 w-64 bg-surface border border-white/10 rounded-2xl overflow-hidden z-[100] shadow-2xl backdrop-blur-xl p-2 space-y-1">
                                {sortOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setSortField(opt.value); setIsSortOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${sortField === opt.value ? 'bg-primary text-background' : 'text-text-muted hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-40 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_40px_rgba(245,158,11,0.2)]"></div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">Syncing Collection...</span>
                </div>
            ) : filteredMangas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    {filteredMangas.map((manga) => (
                        <MangaCard
                            key={manga._id}
                            manga={manga}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <MangaNotFound />
            )}
        </div>
    );
};

export default HomePage;
