import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenziali non valide');
        setLoading(false);
        return;
      }
      login(data.user, data.token);
      console.log('LOGIN TOKEN:', data.token);
      console.log('LOGIN USER:', data.user);

      // Redirect alla dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Errore di connessione al server');
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex justify-center items-center h-screen 
                 bg-linear-to-br from-light to-accent"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          Accedi
        </h1>
        {/* Separatore */}
        <div className="w-16 h-1 bg-accent mx-auto rounded-full mb-6"></div>

        {/* Input username */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-150"
            required
          />
        </div>

        {/* Input password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-150"
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center font-medium">
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-xl shadow-md 
                     hover:bg-accent-str hover:shadow-lg transition transform hover:scale-[1.01] 
                     disabled:opacity-70 disabled:cursor-not-allowed font-bold"
        >
          {loading ? 'Caricamento...' : 'Accedi'}
        </button>

        {/* Link per la Registrazione */}
        <p className="text-center mt-4 text-sm text-gray-600">
          Non hai un account?
          <button
            onClick={() => navigate('/register')}
            className="text-primary hover:text-accent font-semibold ml-1 transition"
          >
            Registrati qui
          </button>
        </p>
      </form>
    </div>
  );
}
