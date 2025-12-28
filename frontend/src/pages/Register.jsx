import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    secondName: '',
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
  //Post Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Errore sconosciuto');
        setLoading(false);
        return;
      }

      // Redirect alla Login page
      navigate('/login');
    } catch (err) {
      setError('Errore di connessione al server');
      console.log(err);
    }

    setLoading(false);
  };

  return (
    <div
      className="flex justify-center items-center min-h-dvh
                    bg-linear-to-br from-accent to-light"
    >
      {/* Form inserimento dati registrazione */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          Registrati
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

        {/* Input firstName */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nome
          </label>
          <input
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-150"
            required
          />
        </div>

        {/* Input secondName */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Cognome
          </label>
          <input
            name="secondName"
            type="text"
            value={form.secondName}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition duration-150"
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
          {loading ? 'Caricamento...' : 'Registrati'}
        </button>
      </form>
    </div>
  );
}
