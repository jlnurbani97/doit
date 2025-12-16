// src/components/CreateTodoModal.jsx
import { useState } from 'react';
import {
  XMarkIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
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
      className="fixed inset-0 z-50 bg-gray-400/40 flex justify-center items-center p-4"
      onClick={handleClose}
    >
      {/* 💡 Contenitore Modale*/}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 💡 Intestazione */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-extrabold text-gray-900">
            Crea Nuova Attività
          </h2>
          {/* 💡 Bottone di chiusura*/}
          <button
            onClick={handleClose}
            className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
            aria-label="Chiudi"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo del Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* 💡 Error Message*/}
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* 💡 Sezione Titolo/Descrizione*/}
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-1"
                htmlFor="title"
              >
                Titolo <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                id="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="block w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                placeholder="Inserisci il titolo dell'attività (es. Aggiungi feature X)"
                required
              />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />{' '}
                {/* Icona Descrizione */}
                <label
                  className="block text-sm font-semibold text-gray-700 mb-1"
                  htmlFor="description"
                >
                  Descrizione
                </label>
              </div>
              <textarea
                name="description"
                id="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-primary focus:border-primary"
                placeholder="Dettagli aggiuntivi (Opzionale)"
              />
            </div>
          </div>

          {/* 💡 Sezione Dati Temporali */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {['startingDate', 'endingDate'].map((field) => (
              <div key={field}>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />{' '}
                  {/* Icona Calendario */}
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-1"
                    htmlFor={field}
                  >
                    {field === 'startingDate' ? 'Data Inizio' : 'Scadenza'}
                  </label>
                </div>
                <input
                  name={field}
                  id={field}
                  type="date"
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:border-primary outline-none text-sm"
                />
              </div>
            ))}
          </div>

          {/* 💡 Pulsante Submit*/}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:bg-accent transition disabled:opacity-50 font-semibold"
            >
              {loading ? 'Creazione in corso...' : 'Crea Attività'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
