const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function listTasks() {
  const res = await fetch(`${API_URL}/api/tasks`);
  return res.json();
}

export async function createTask(title) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  return res.json();
}

export async function toggleTask(id, done) {
  await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ done })
  });
}

export async function deleteTask(id) {
  await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
}