import React, { useState, useEffect } from 'react';
import { useUI } from '../hooks/useUI';
import { useAuth } from '../hooks/useAuth';
import CreateTodoModal from '../components/CreateTodoModal';
import DashboardColumn from '../components/DashBoardColumn';
import ViewEditTodoModal from '../components/ViewEditTodoModal';

export default function Dashboard() {
  const { isCreateModalOpen, closeCreateModal, openCreateModal } = useUI();
  const { user } = useAuth();

  const [states, setStates] = useState([]);
  const [todos, setTodos] = useState([]);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [error, setError] = useState(null);

  const [selectedTodo, setSelectedTodo] = useState(null);

  const openViewModal = (todo) => {
    setSelectedTodo(todo);
  };

  const closeViewModal = () => {
    setSelectedTodo(null);
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

  // --- FETCH DEGLI STATI  ---
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/states');
        if (!res.ok) {
          const errorMessage = await handleFetchError(res);
          throw new Error(errorMessage);
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

  // --- FETCH DEI TODO ---
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!loadingStates && states.length > 0 && user && user.id && token) {
      setLoadingTodos(true);

      const fetchTodos = async () => {
        const token = localStorage.getItem('token');
        try {
          const res = await fetch(`http://localhost:3000/api/todos/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) {
            const errorMessage = await handleFetchError(res);
            throw new Error(errorMessage);
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

  const handleTodoUpdated = (updatedTodo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    // Chiudi il modale dopo l'aggiornamento
    setSelectedTodo(null);
  };

  const handleTodoDeleted = (deletedTodoId) => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== deletedTodoId)
    );
    // Chiudi il modale dopo la cancellazione
    setSelectedTodo(null);
  };

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
        <div className="flex flex-wrap justify-center gap-6">
          {states.map((state) => (
            <div
              key={state.id}
              className="min-w-[300px] max-w-full md:min-w-[300px]"
            >
              <DashboardColumn
                title={state.name}
                stateId={state.id}
                allTodos={todos}
                onTodoClick={openViewModal}
              />
            </div>
          ))}
        </div>
      )}

      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onTodoCreated={handleTodoCreated}
      />

      {/* Modale Visualizzazione e modifica*/}
      <ViewEditTodoModal
        isOpen={!!selectedTodo}
        onClose={closeViewModal}
        todo={selectedTodo}
        onUpdate={handleTodoUpdated}
        onDelete={handleTodoDeleted}
        availableStates={states}
        userId={user?.id}
      />
    </div>
  );
}
