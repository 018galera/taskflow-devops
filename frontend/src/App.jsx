import { useEffect, useState } from 'react';
import { listTasks, createTask, toggleTask, deleteTask } from './api';
import Dashboard from './Dashboard';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await listTasks();
    setTasks(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask(title);
    setTitle('');
    load();
  }

  async function handleToggle(task) {
    await toggleTask(task.id, !task.done);
    load();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    load();
  }

  // Métricas
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;
  const rate = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="app-container">
      <header>
        <div className="header-title">
          <h1>🚀 TaskFlow <span className="badge">Analytics</span></h1>
          <p>CI/CD Monitorado e Gestão de Produtividade</p>
        </div>
      </header>

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : (
        <div className="grid-layout">
          
          {/* Coluna da Esquerda: Tarefas */}
          <div className="main-col">
            <div className="metrics-row">
              <div className="metric-card">
                <span>Total</span>
                <strong>{total}</strong>
              </div>
              <div className="metric-card text-blue">
                <span>Concluídas</span>
                <strong>{done}</strong>
              </div>
              <div className="metric-card text-orange">
                <span>Pendentes</span>
                <strong>{pending}</strong>
              </div>
              <div className="metric-card text-green">
                <span>Foco</span>
                <strong>{rate}%</strong>
              </div>
            </div>

            <form onSubmit={handleAdd} className="form">
              <input
                type="text"
                placeholder="Qual o próximo passo?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button type="submit">Criar</button>
            </form>

            <ul className="list">
              {tasks.map((task) => (
                <li key={task.id} className={task.done ? 'done' : ''}>
                  <input
                    type="checkbox"
                    checked={!!task.done}
                    onChange={() => handleToggle(task)}
                  />
                  <span>{task.title}</span>
                  <button onClick={() => handleDelete(task.id)} className="del">✕</button>
                </li>
              ))}
              {tasks.length === 0 && <p className="empty">Nenhuma tarefa. Crie a primeira!</p>}
            </ul>
          </div>

          {/* Coluna da Direita: Dashboard */}
          <div className="side-col">
            <Dashboard tasks={tasks} />
            
            <div className="status-panel">
              <h3>🟢 Status do Sistema</h3>
              <ul>
                <li><span>API Backend</span> <span className="green-text">Online</span></li>
                <li><span>Pipeline CI/CD</span> <span className="green-text">Ativo</span></li>
                <li><span>Deploy</span> <span className="green-text">Automatizado</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}