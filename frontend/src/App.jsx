import { useEffect, useState } from 'react';
import { listTasks, createTask, updateTask, toggleTask, deleteTask } from './api';
import Dashboard from './Dashboard';
import SettingsView from './SettingsView';
// import ParticlesBackground from './ParticlesBackground'; // <-- DESLIGADO
import { HomeIcon, Cog6ToothIcon, MagnifyingGlassIcon, BellIcon, PlusIcon, PencilSquareIcon, TrashIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); 
  
  const [themeColor, setThemeColor] = useState(localStorage.getItem('themeColor') || '#f59e0b');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', description: '', category: 'Geral', priority: 'Média', image_url: '', due_date: '', subtasks: [] 
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', themeColor);
    document.documentElement.style.setProperty('--accent-hover', themeColor + 'cc');
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  async function load() {
    try {
      const data = await listTasks();
      setTasks(data);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      let safeSubtasks = [];
      try {
        if (Array.isArray(task.subtasks)) safeSubtasks = task.subtasks;
        else if (typeof task.subtasks === 'string') safeSubtasks = JSON.parse(task.subtasks);
      } catch (e) { console.error("Erro ao ler subtarefas", e); }

      setFormData({ 
        ...task, 
        due_date: task.due_date || '', 
        subtasks: safeSubtasks 
      });
    } else {
      setEditingTask(null);
      setFormData({ title: '', description: '', category: 'Geral', priority: 'Média', image_url: '', due_date: '', subtasks: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) await updateTask(editingTask.id, formData);
      else await createTask(formData);
      setIsModalOpen(false);
      load();
    } catch (error) {
      alert("Erro ao salvar a tarefa.");
    }
  };

  const handleDelete = async (id) => { 
    if(window.confirm('Excluir esta tarefa?')) { 
      await deleteTask(id); 
      load(); 
    } 
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image_url: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addSubtask = () => setFormData({ ...formData, subtasks: [...formData.subtasks, { id: Date.now(), text: '', done: false }] });
  const updateSubtask = (id, text) => setFormData({ ...formData, subtasks: formData.subtasks.map(st => st.id === id ? { ...st, text } : st) });
  const removeSubtask = (id) => setFormData({ ...formData, subtasks: formData.subtasks.filter(st => st.id !== id) });

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const isDone = destination.droppableId === 'done';
    const task = tasks.find(t => t.id.toString() === draggableId);
    if (task.done !== (isDone ? 1 : 0)) {
      await toggleTask(task.id, isDone);
      load();
    }
  };

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  const isOverdue = (task) => {
    if (!task.due_date || task.done) return false;
    return new Date(task.due_date) < new Date(new Date().setHours(0,0,0,0));
  };

  return (
    <div className="app-layout">
      
      {/* <ParticlesBackground themeColor={themeColor} /> */} {/* <-- DESLIGADO */}

      <aside className="sidebar" style={{ zIndex: 10 }}>
        <div className="logo-icon">TF</div>
        <nav className="menu">
          <button onClick={() => setActiveTab('dashboard')} className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}><HomeIcon width={26} /></button>
          <button onClick={() => setActiveTab('board')} className={`menu-item ${activeTab === 'board' ? 'active' : ''}`}><ViewColumnsIcon width={26} /></button>
          <button onClick={() => setActiveTab('settings')} className={`menu-item ${activeTab === 'settings' ? 'active' : ''}`}><Cog6ToothIcon width={26} /></button>
        </nav>
      </aside>

      <main className="main-content" style={{ zIndex: 10 }}>
        <header className="topbar">
          <div>
            <h1>{activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'board' ? 'Quadro Kanban' : 'Configurações'}</h1>
            <p style={{ color: '#a1a1aa', fontSize: '15px', marginTop: '4px' }}>Gestão de produtividade e infraestrutura.</p>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="search-container">
              <MagnifyingGlassIcon width={22} color="#a1a1aa" />
              <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><BellIcon width={28} /></button>
            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: `url(${localStorage.getItem('profilePic') || 'https://i.pravatar.cc/100'}) center/cover`, border: `2px solid ${themeColor}` }}></div>
          </div>
        </header>

        {loading ? <p style={{ textAlign: 'center' }}>Carregando...</p> : (
          <div className="page-content">
            
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <Dashboard key={themeColor} tasks={tasks} themeColor={themeColor} />
                
                <div className="tasks-panel">
                  <div className="tasks-header">
                    <h3>Todas as Atividades</h3>
                    <button className="btn-primary" onClick={() => openModal()}><PlusIcon width={20} /> Nova Tarefa</button>
                  </div>
                  <div className="tasks-list">
                    {filteredTasks.map(task => (
                      <div key={task.id} className={`task-item ${task.done ? 'done' : ''} ${isOverdue(task) ? 'overdue' : ''}`}>
                        <div className="task-img-container">
                          {task.image_url ? <img src={task.image_url} alt="Capa" /> : <div className="img-fallback">{task.category.charAt(0)}</div>}
                        </div>
                        <div className="task-info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h4>{task.title}</h4>
                            {isOverdue(task) && <span className="badge prio-alta">Atrasada</span>}
                          </div>
                          <p>{task.description}</p>
                          <div className="badges">
                            <span className={`badge prio-${task.priority.toLowerCase()}`}>{task.priority}</span>
                            <span className="badge cat">{task.category}</span>
                            {task.subtasks?.length > 0 && (
                              <span className="badge cat">📋 {task.subtasks.filter(st => st.done).length}/{task.subtasks.length} Subtarefas</span>
                            )}
                          </div>
                        </div>
                        <div className="task-actions">
                          <button className="btn-icon" onClick={() => openModal(task)}><PencilSquareIcon width={20} /></button>
                          <button className="btn-icon danger" onClick={() => handleDelete(task.id)}><TrashIcon width={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'board' && (
              <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', height: '100%' }}>
                  <Droppable droppableId="pending">
                    {(provided) => (
                      <div className="board-column" ref={provided.innerRef} {...provided.droppableProps}>
                        <h3>Em Andamento ({filteredTasks.filter(t => !t.done).length})</h3>
                        <div className="board-list">
                          {filteredTasks.filter(t => !t.done).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided) => (
                                <div className="kanban-card" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => openModal(task)}>
                                  <span className={`badge prio-${task.priority.toLowerCase()}`}>{task.priority}</span>
                                  <h4>{task.title}</h4>
                                  <p>{task.category}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>

                  <Droppable droppableId="done">
                    {(provided) => (
                      <div className="board-column" ref={provided.innerRef} {...provided.droppableProps}>
                        <h3>Concluídas ({filteredTasks.filter(t => t.done).length})</h3>
                        <div className="board-list">
                          {filteredTasks.filter(t => t.done).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided) => (
                                <div className="kanban-card done" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => openModal(task)}>
                                  <h4 style={{ textDecoration: 'line-through' }}>{task.title}</h4>
                                  <p>{task.category}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            )}

            {activeTab === 'settings' && (
              <SettingsView 
                themeColor={themeColor} 
                setThemeColor={setThemeColor} 
              />
            )}
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingTask ? 'Editar Atividade' : 'Nova Atividade'}</h2>
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="input-group">
                  <label>Título</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Descrição</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="input-row">
                  <div className="input-group">
                    <label>Prioridade</label>
                    <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                      <option>Baixa</option><option>Média</option><option>Alta</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Categoria</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Geral</option><option>Trabalho</option><option>Estudos</option><option>Pessoal</option>
                    </select>
                  </div>
                </div>
                <div className="input-group">
                  <label>Data de Vencimento</label>
                  <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Upload de Imagem (Capa)</label>
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ background: 'transparent', border: 'none', padding: '0' }} />
                  {formData.image_url && <img src={formData.image_url} alt="Preview" style={{ height: '60px', borderRadius: '8px', marginTop: '10px', objectFit: 'cover' }} />}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '1px solid #27272a', paddingLeft: '20px' }}>
                <label style={{ fontSize: '14px', color: '#a1a1aa' }}>Checklist de Subtarefas</label>
                {formData.subtasks.map((st) => (
                  <div key={st.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="text" placeholder="Nova subtarefa..." value={st.text} onChange={(e) => updateSubtask(st.id, e.target.value)} style={{ flex: 1, background: '#09090b', border: '1px solid #27272a', padding: '10px', borderRadius: '8px', color: 'white' }} />
                    <button type="button" onClick={() => removeSubtask(st.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
                <button type="button" onClick={addSubtask} className="btn-secondary" style={{ padding: '10px' }}>+ Adicionar Subtarefa</button>
              </div>

              <div className="modal-actions" style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Atividade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}