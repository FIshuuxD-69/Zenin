import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, LayoutGrid } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <nav className="sticky top-0 z-[100] glass-panel border-b border-white/5 px-6 py-4">
            <div className="container mx-auto flex items-center justify-between gap-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-2xl font-black tracking-tighter text-primary hover:scale-105 transition-transform duration-300"
                >
                    <LayoutGrid className="w-8 h-8 fill-primary/20" />
                    <span className="hidden sm:inline">MANGAZONE</span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        to="/create"
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-background hover:bg-primary-hover transition-all duration-300 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">New Entry</span>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
