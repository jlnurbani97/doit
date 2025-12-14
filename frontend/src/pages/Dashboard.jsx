import React, { useState, useEffect } from 'react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import CreateTodoModal from '../components/CreateTodoModal';
import DashboardColumn from '../components/DashBoardColumn';

export default function Dashboard() {
  const { isCreateModalOpen, closeCreateModal, openCreateModal } = useUI();
  const { user } = useAuth();

  const [states, setStates] = useState([]);
  const [todos, setTodos] = useState([]);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [error, setError] = useState(null);

  // --- FETCH DEGLI STATI  ---
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/states');
        if (!res.ok) {
          throw new Error('Impossibile caricare gli stati della board.');
        }
        const data = await res.json();
        setStates(data);
      } catch (err) {
        setError('Errore nel caricamento delle colonne: ' + err.message);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // --- 2. FETCH DEI TODO ---
  useEffect(() => {
    if (!loadingStates && states.length > 0 && user && user.id) {
      setLoadingTodos(true);

      const fetchTodos = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/todos/${user.id}`);
          if (!res.ok) {
            throw new Error('Impossibile caricare le attività.');
          }
          const data = await res.json();
          setTodos(data);
        } catch (err) {
          console.error('Errore nel recupero dei todos:', err);
          setError('Errore nel caricamento delle attività.');
        } finally {
          setLoadingTodos(false);
        }
      };
      fetchTodos();
    }
  }, [loadingStates, states.length, user]);

  // ---CREAZIONE DI NUOVI TODO ---
  const handleTodoCreated = (newTodo) => {
    const todoToDisplay = newTodo.todo || newTodo;
    setTodos((prevTodos) => [todoToDisplay, ...prevTodos]);
  };

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">{error}</div>
    );
  }

  const isLoading = loadingStates || loadingTodos;

  //TODO: Da migliorare posizionameno
  return (
    <div className=" p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">La tua Dashboard</h1>
        <button
          onClick={openCreateModal}
          className="bg-accent text-white py-2 px-4 rounded-lg shadow-md hover:bg-primary transition disabled:opacity-50"
          disabled={isLoading || states.length === 0}
        >
          + Aggiungi Attività
        </button>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-gray-600">
          Caricamento Board e Attività...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* ITERAZIONE SULLE COLONNE*/}
          {states.map((state) => (
            <DashboardColumn
              key={state.id}
              title={state.name}
              stateId={state.id}
              allTodos={todos}
            />
          ))}
        </div>
      )}

      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onTodoCreated={handleTodoCreated}
      />
    </div>
  );
}
