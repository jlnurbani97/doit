import { Link } from 'react-router-dom';
import logo from '../assets/logoSmall.png';

//Header applicazione
export default function Header() {
  return (
    <header className="bg-light border-b border-primary/20 px-8 py-4 flex justify-between items-center">
      {/* Logo  con link verso home*/}
      <Link to="/">
        <img src={logo} className="h-14 w-auto object-contain" />
      </Link>

      {/* Barra di navigazione*/}
      <nav className="flex items-center gap-8 text-primary font-medium">
        <Link to="/" className="hover:text-accent transition">
          Home
        </Link>
        <Link to="#" className="hover:text-accent transition">
          Login
        </Link>
        <Link to="#" className="hover:text-accent transition">
          Register
        </Link>
      </nav>
    </header>
  );
}
