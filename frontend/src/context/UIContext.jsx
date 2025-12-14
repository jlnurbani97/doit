import { createContext, useState } from 'react';

//inizializzazione Context
const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  // Stato modale di creazione
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modale di Creazione
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const value = {
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export { UIContext };
