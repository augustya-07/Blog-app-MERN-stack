import { Menu, PenLine, Search, ShieldCheck, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navClass = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? 'text-leaf' : 'text-ink/70 hover:text-ink'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    setOpen(false);
    navigate('/');
  }

  const links = (
    <>
      <NavLink to="/" className={navClass} onClick={() => setOpen(false)}>
        Explore
      </NavLink>
      {user && (
        <NavLink to="/dashboard" className={navClass} onClick={() => setOpen(false)}>
          Dashboard
        </NavLink>
      )}
      {['author', 'admin'].includes(user?.role) && (
        <NavLink to="/editor" className={navClass} onClick={() => setOpen(false)}>
          Write
        </NavLink>
      )}
      {user?.role === 'admin' && (
        <NavLink to="/admin" className={navClass} onClick={() => setOpen(false)}>
          Admin
        </NavLink>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-2xl font-bold tracking-normal">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-base text-white">I</span>
          Inkspire
        </Link>

        <div className="hidden items-center gap-7 md:flex">{links}</div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/?focus=search" className="btn-secondary px-3" title="Search posts">
            <Search size={18} />
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="btn-secondary">
                <UserRound size={18} />
                Profile
              </Link>
              <button onClick={handleLogout} className="btn-primary">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Join
              </Link>
            </>
          )}
        </div>

        <button
          className="btn-secondary px-3 md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <div className="container-page flex flex-col gap-4 py-4">
            {links}
            {user?.role === 'admin' && (
              <div className="flex items-center gap-2 text-sm font-semibold text-gold">
                <ShieldCheck size={16} />
                Admin access
              </div>
            )}
            {user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/profile" className="btn-secondary" onClick={() => setOpen(false)}>
                  <UserRound size={18} />
                  Profile
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="btn-secondary" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary" onClick={() => setOpen(false)}>
                  <PenLine size={18} />
                  Join
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
