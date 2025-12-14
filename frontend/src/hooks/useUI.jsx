import { useContext } from 'react';
import { UIContext } from '../context/UIContext';

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === null) {
    throw new Error(
      "useUI deve essere utilizzato all'interno di un UIProvider"
    );
  }
  return context;
};
