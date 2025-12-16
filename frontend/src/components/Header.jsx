import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logoSmall.png';
import { useAuth } from '../hooks/useAuth';
import { useUI } from '../hooks/useUI';
import {
  PlusIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline';

//Header applicazione
export default function Header() {
  const navigate = useNavigate();

  const { user, isLoggedIn, logout } = useAuth();
  const { openCreateModal } = useUI();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewCard = () => {
    openCreateModal();
  };

  const logoLinkTo = isLoggedIn ? '/dashboard' : '/';

  return (
    <header className="bg-light border-b border-primary/20 px-8 py-4 flex justify-between items-center">
      {/* Logo  con link verso home o verso dashboard per utente Loggato*/}
      <Link to={logoLinkTo}>
        <img
          src={logo}
          className="h-12 w-auto object-contain transition transform hover:scale-[1.03]"
          alt="Logo applicazione"
        />
      </Link>

      {/* Barra di navigazione dinameica*/}
      {/* Todo modificare, non mi piace molto!*/}
      <nav className="flex items-center gap-8 text-primary font-medium">
        {isLoggedIn ? (
          // --- Stato LOGGATO (Dashboard) ---
          <div className="flex items-center space-x-4">
            {/* Saluto all'utente */}
            <span className="text-gray-700 font-semibold text-lg hidden sm:block">
              Ciao, {user.firstName || user.username}!
            </span>

            {/* Pulsante Crea Card [+] */}
            <button
              onClick={handleNewCard}
              className="p-2 bg-accent text-white rounded-full shadow-lg hover:bg-primary transition transform hover:scale-105"
              aria-label="Crea nuova card"
            >
              <PlusIcon className="w-6 h-6" />
            </button>

            {/* Pulsante Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-primary hover:text-red-500 transition"
              aria-label="Esci"
              title="Esci"
            >
              <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          // --- Stato NON LOGGATO ---
          <>
            <Link to="/" className="hover:text-accent transition ">
              Home
            </Link>
            <Link to="/login" className="hover:text-accent transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-accent transition">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
