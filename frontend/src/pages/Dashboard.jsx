import { useUI } from '../hooks/useUI';
import CreateTodoModal from '../components/CreateTodoModal';
//Componente Dashboard
export default function Dashboard() {
  const { isCreateModalOpen, closeCreateModal } = useUI();

  return (
    <div className="bg-linear-to-br from-light to-accent min-h-screen">
      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        //On todo created
      />
      <h1 className="text-4xl">Dashboard</h1>
    </div>
  );
}
