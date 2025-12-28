import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export default function ViewEditTodoModal({
  isOpen,
  onClose,
  todo,
  onUpdate,
  onDelete,
  availableStates,
  userId,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const [error, setError] = useState('');

  useEffect(() => {
    if (todo) {
      setFormData({
        ...todo,
        startingDate: formatDate(todo.startingDate),
        endingDate: formatDate(todo.endingDate),
      });
      setIsEditing(false);
      setError('');
    }
  }, [todo]);

  if (!isOpen || !todo || !userId) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFetchError = async (res) => {
    let errorBody = {};
    try {
      errorBody = await res.json();
    } catch (err) {
      console.log(err);
    }
    return errorBody.error || `Errore HTTP ${res.status}`;
  };
  //Update todo
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    try {
      const dataToSend = {
        ...formData,
        stateId: parseInt(formData.stateId, 10),
      };

      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorMessage = await handleFetchError(res);
        throw new Error(errorMessage);
      }

      const updatedTodo = await res.json();
      onUpdate(updatedTodo);
    } catch (error) {
      setError(`Aggiornamento fallito: ${error.message}`);
      console.error(error);
    }
  };
  //Delete todo
  const handleDelete = async () => {
    if (!window.confirm('Sei sicuro di voler eliminare questa attività?'))
      return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorMessage = await handleFetchError(res);
        throw new Error(errorMessage);
      }

      onDelete(todo.id);
    } catch (error) {
      setError(`Cancellazione fallita: ${error.message}`);
      console.error(error);
    }
  };

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toISOString().substring(0, 10) : '';
  const displayDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('it-IT') : 'N/A';

  // Trova il nome dello stato attuale per la visualizzazione
  const currentState = availableStates.find((s) => s.id === todo.stateId);
  //truttura del Modale
  return (
    <div className="fixed inset-0 z-50 bg-gray-400/40 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header del Modale */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h3 className="text-xl font-extrabold text-gray-900">
            {isEditing ? 'Modifica Attività' : todo.title}
          </h3>
          <div className="flex space-x-2">
            {/* Tasto Cancella */}
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
              title="Elimina attività"
            >
              <TrashIcon className="w-6 h-6" />
            </button>

            {/* Tasto Modifica / Salva */}
            <button
              onClick={() => (isEditing ? handleUpdate() : setIsEditing(true))}
              className={`p-2 rounded-lg transition ${
                isEditing
                  ? 'bg-primary text-white hover:bg-accent'
                  : 'bg-primary text-white hover:bg-accent'
              }`}
              title={isEditing ? 'Salva Modifiche' : 'Modifica Attività'}
            >
              {isEditing ? (
                <CheckIcon className="w-6 h-6" />
              ) : (
                <PencilSquareIcon className="w-6 h-6" />
              )}
            </button>

            {/* Tasto Chiudi */}
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
              title="Chiudi"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Corpo del Modale */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Sezione Stato */}
          <div className="flex items-center space-x-3 pb-3 border-b">
            <TagIcon className="w-6 h-6 text-indigo-500" />
            <label className="text-sm font-semibold text-gray-700 w-20">
              Stato:
            </label>

            {isEditing ? (
              <select
                name="stateId"
                value={formData.stateId || ''}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 grow"
              >
                {availableStates.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800`}
              >
                {currentState?.name || 'Sconosciuto'}
              </span>
            )}
          </div>

          {/* Sezione Titolo/Descrizione */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Titolo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              ) : (
                <p className="mt-1 text-xl font-bold">{todo.title}</p>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <ClipboardDocumentListIcon className="w-5 h-5 text-gray-500" />
                <label className="text-sm font-semibold text-gray-700">
                  Descrizione
                </label>
              </div>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows="4"
                />
              ) : (
                <p className="mt-1 text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {todo.description || 'Nessuna descrizione dettagliata.'}
                </p>
              )}
            </div>
          </div>

          {/* Sezione Date */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {['startingDate', 'endingDate'].map((field) => (
              <div key={field}>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                  <label className="text-sm font-semibold text-gray-700">
                    {field === 'startingDate' ? 'Data Inizio' : 'Scadenza'}
                  </label>
                </div>

                {isEditing ? (
                  <input
                    type="date"
                    name={field}
                    value={formData[field] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  />
                ) : (
                  <p className="mt-1 text-gray-800">
                    {displayDate(todo[field])}
                  </p>
                )}
              </div>
            ))}
          </div>
          {/*Messaggio di errore */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center font-medium">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
