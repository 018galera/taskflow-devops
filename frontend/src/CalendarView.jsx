import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function CalendarView({ tasks, onEdit, onToggle }) {
  const pending = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  return (
    <div className="calendar-board">
      <div className="board-column">
        <h3><ClockIcon width={20} /> Pendentes ({pending.length})</h3>
        <div className="board-list">
          {pending.map(task => (
            <div key={task.id} className="kanban-card" onClick={() => onEdit(task)}>
              <span className={`badge prio-${task.priority.toLowerCase()}`}>{task.priority}</span>
              <h4>{task.title}</h4>
              <p>{task.category}</p>
            </div>
          ))}
          {pending.length === 0 && <p className="empty-col">Tudo limpo por aqui!</p>}
        </div>
      </div>

      <div className="board-column">
        <h3><CheckCircleIcon width={20} color="#10b981" /> Concluídas ({done.length})</h3>
        <div className="board-list">
          {done.map(task => (
            <div key={task.id} className="kanban-card done" onClick={() => onToggle(task)}>
              <h4 style={{ textDecoration: 'line-through' }}>{task.title}</h4>
              <p>{task.category}</p>
            </div>
          ))}
          {done.length === 0 && <p className="empty-col">Nenhuma tarefa concluída.</p>}
        </div>
      </div>
    </div>
  );
}