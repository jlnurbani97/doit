import React from 'react';
import { ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function TodoCard({ todo, onClick }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
      });
    } catch {
      return dateString.split('T')[0];
    }
  };

  const startingDate = formatDate(todo.startingDate);
  const endingDate = formatDate(todo.endingDate);

  // Determina il colore di sfondo se la scadenza è vicina/passata
  const isOverdue =
    todo.endingDate &&
    new Date(todo.endingDate) < new Date() &&
    todo.stateId !== 3;

  return (
    <div
      key={todo.id}
      onClick={onClick}
      className={`p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out cursor-grab 
                  ${isOverdue ? 'border-red-400 bg-red-50' : ''}`}
    >
      {/* Titolo e ID */}
      <h4 className="font-semibold text-base text-gray-900 mb-2">
        {todo.title}
      </h4>

      {/* Descrizione*/}
      {todo.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {todo.description}
        </p>
      )}

      {/* Dettagli temporali / Icone */}
      <div className="flex items-center space-x-4 text-xs text-gray-500">
        {/* Data di Inizio */}
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1 text-primary" />
          <span>Inizio: {startingDate}</span>
        </div>

        {/* Data di Scadenza */}
        <div
          className={`flex items-center ${
            isOverdue ? 'text-red-500 font-bold' : ''
          }`}
        >
          <ClockIcon className="w-4 h-4 mr-1" />
          <span>Fine: {endingDate}</span>
        </div>
      </div>
    </div>
  );
}
