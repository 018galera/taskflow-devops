const API_URL = import.meta.env.VITE_API_URL || 'https://taskflow-backend-tejo.onrender.com';
export async function listTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData)
  });
  return res.json();
}

export async function updateTask(id, taskData) {
  await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(taskData)
  });
}

export async function toggleTask(id, done) {
  await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done })
  });
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
}