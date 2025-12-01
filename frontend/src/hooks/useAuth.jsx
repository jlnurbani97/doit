import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Esportiamo sl'hook personalizzato
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Controllo per debugging
  if (context === null) {
    throw new Error(
      "useAuth deve essere utilizzato all'interno di un AuthProvider"
    );
  }

  return context;
};
