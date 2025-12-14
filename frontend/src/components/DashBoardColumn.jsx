import TodoCard from './TodoCard';

const STATE_COLOR_MAP = {
  1: {
    columnBg: 'bg-blue-50',
    border: 'border-blue-500',
    badgeBg: 'bg-blue-500',
    badgeText: 'text-white',
  },
  2: {
    columnBg: 'bg-yellow-50',
    border: 'border-yellow-500',
    badgeBg: 'bg-yellow-600',
    badgeText: 'text-white',
  },
  3: {
    columnBg: 'bg-green-50',
    border: 'border-green-500',
    badgeBg: 'bg-green-500',
    badgeText: 'text-white',
  },
  4: {
    columnBg: 'bg-gray-100',
    border: 'border-gray-400',
    badgeBg: 'bg-gray-600',
    badgeText: 'text-white',
  },
};

export default function DashboardColumn({ title, stateId, allTodos }) {
  const columnTodos = allTodos.filter((todo) => todo.stateId === stateId);

  const colors = STATE_COLOR_MAP[stateId] || {
    columnBg: 'bg-gray-100',
    border: 'border-gray-400',
    badgeBg: 'bg-gray-700',
    badgeText: 'text-white',
  };

  return (
    <div
      className={`
        w-full 
        flex flex-col 
        ${colors.columnBg} rounded-xl shadow-lg 
        p-4 
        min-h-[400px] 
        border-t-4 ${colors.border} 
      `}
    >
      {/* Intestazione della Colonna */}
      <h2 className="text-xl font-extrabold text-gray-800 mb-4 flex justify-between items-center">
        {title}

        {/* Contatore delle attività */}
        <span
          className={`${colors.badgeBg} ${colors.badgeText} text-sm font-semibold py-1 px-3 rounded-full`}
        >
          {columnTodos.length}
        </span>
      </h2>

      {/* Contenitore delle Card scorrevole */}
      <div className="grow space-y-4 overflow-y-auto pr-1">
        {columnTodos.length === 0 ? (
          <p className="text-gray-500 text-sm italic pt-4 text-center">
            Nessuna attività in questa colonna. Inizia a crearne una!
          </p>
        ) : (
          columnTodos.map((todo) => (
            // 💡 Usiamo il componente TodoCard
            <TodoCard
              key={todo.id}
              todo={todo}
              // In futuro, qui potresti aggiungere props per il Drag and Drop
            />
          ))
        )}
      </div>
    </div>
  );
}
