// src/components/CreateTodoModal.jsx
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

// ID 1 per lo stato iniziale "To Do"
const DEFAULT_STATE_ID = 1;

export default function CreateTodoModal({ isOpen, onClose, onTodoCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startingDate: '',
    endingDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      startingDate: '',
      endingDate: '',
    });
    setError('');
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      userId: user.id,
      stateId: DEFAULT_STATE_ID,
    };
    if (payload.startingDate === '') payload.startingDate = null;
    if (payload.endingDate === '') payload.endingDate = null;

    try {
      const res = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = {};
      if (res.headers.get('content-length') !== '0') {
        try {
          data = await res.json();
        } catch (err) {
          console.error(err);
        }
      }

      if (!res.ok) {
        setError(
          data.error ||
            data.message ||
            `Errore HTTP ${res.status} durante la creazione.`
        );
        setLoading(false);
        return;
      }

      onTodoCreated(data);
      resetForm();
      onClose();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    // 💡 Sfondo Modal
    <div
      className="fixed inset-0  bg-gray-400/40 flex justify-center items-center z-50 p-4"
      onClick={handleClose}
    >
      {/* 💡 Contenitore Modale  */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-xl relative 
                   border border-gray-100 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Intestazione */}
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Crea Nuova Attività
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 transition p-1 ml-4"
            aria-label="Chiudi"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo del Form */}
        <form onSubmit={handleSubmit}>
          {/* Sezione Principale: Titolo e Descrizione */}
          <div className="space-y-4 mb-6">
            <label
              className="block text-sm font-semibold text-gray-700"
              htmlFor="title"
            >
              Titolo
            </label>
            <input
              name="title"
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
              placeholder="Inserisci il titolo dell'attività (es. Aggiungi feature X)"
              required
            />

            <label
              className="block text-sm font-semibold text-gray-700 pt-2"
              htmlFor="description"
            >
              Descrizione
            </label>
            <textarea
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:ring-1 focus:ring-accent outline-none transition"
              placeholder="Dettagli aggiuntivi (Opzionale)"
            />
          </div>

          {/* Sezione Dati (Simile a come apparirà la card di visualizzazione) */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-gray-200">
            <h3 className="text-md font-bold text-primary mb-3">
              Dettagli Temporali
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-medium text-gray-500 mb-1"
                  htmlFor="startingDate"
                >
                  Data di Inizio
                </label>
                <input
                  name="startingDate"
                  id="startingDate"
                  type="date"
                  value={form.startingDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-primary outline-none text-sm"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-gray-500 mb-1"
                  htmlFor="endingDate"
                >
                  Data di Scadenza
                </label>
                <input
                  name="endingDate"
                  id="endingDate"
                  type="date"
                  value={form.endingDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-primary outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          {/* Pulsante Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-3 rounded-xl shadow-md 
                       hover:bg-primary transition disabled:opacity-70 disabled:cursor-not-allowed font-bold"
          >
            {loading ? 'Creazione in corso...' : 'Aggiungi Attività'}
          </button>
        </form>
      </div>
    </div>
  );
}
