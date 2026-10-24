import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard({ tasks }) {
  // Processa os dados para o gráfico (agrupando por mês)
  const dataMap = {};
  
  tasks.forEach(task => {
    if (task.done && task.completed_at) {
      const month = format(parseISO(task.completed_at), 'MMM', { locale: ptBR });
      dataMap[month] = (dataMap[month] || 0) + 1;
    }
  });

  const chartData = Object.keys(dataMap).map(month => ({
    name: month.charAt(0).toUpperCase() + month.slice(1),
    concluidas: dataMap[month]
  })).reverse(); // Do mais antigo para o mais recente

  // Se não tiver dados, mostra um gráfico vazio bonitinho
  if (chartData.length === 0) {
    chartData.push({ name: 'Mês Atual', concluidas: 0 });
  }

  return (
    <div className="dashboard-panel">
      <h2>📈 Produtividade</h2>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              itemStyle={{ color: '#60a5fa' }}
            />
            <Bar dataKey="concluidas" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Tarefas Concluídas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}