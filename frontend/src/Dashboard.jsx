import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function Dashboard({ tasks, themeColor }) {
  // Se a cor não vier, usa o laranja como padrão
  const mainColor = themeColor || '#f59e0b';

  const areaData = [
    { name: 'Jan', tarefas: 5 }, { name: 'Fev', tarefas: 12 }, { name: 'Mar', tarefas: 25 },
    { name: 'Abr', tarefas: 20 }, { name: 'Mai', tarefas: 35 }, { name: 'Jun', tarefas: 45 },
    { name: 'Jul', tarefas: 30 }, { name: 'Ago', tarefas: 60 }, { name: 'Set', tarefas: 55 },
    { name: 'Out', tarefas: 70 }, { name: 'Nov', tarefas: 85 }, 
    { name: 'Dez', tarefas: 50 + tasks.filter(t => t.done).length }
  ];

  const categories = ['Trabalho', 'Estudos', 'Pessoal', 'Geral'];
  // A primeira cor do gráfico de pizza pega a cor do usuário
  const colors = [mainColor, '#10b981', '#3b82f6', '#a855f7']; 
  
  const categoryData = categories.map((cat, i) => ({
    name: cat,
    value: tasks.filter(t => t.category === cat).length,
    color: colors[i]
  })).filter(d => d.value > 0);

  if (categoryData.length === 0) {
    categoryData.push({ name: 'Sem Tarefas', value: 1, color: '#27272a' });
  }

  const weekData = [
    { day: 'Seg', qtd: 3 }, { day: 'Ter', qtd: 5 }, { day: 'Qua', qtd: 2 },
    { day: 'Qui', qtd: 6 }, { day: 'Sex', qtd: 8 }, { day: 'Sáb', qtd: 1 }, { day: 'Dom', qtd: 4 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <div className="metric-box"><span>Total Tarefas</span><h2 style={{ color: mainColor }}>{tasks.length}</h2></div>
        <div className="metric-box"><span>Concluídas</span><h2 style={{ color: mainColor }}>{tasks.filter(t => t.done).length}</h2></div>
        <div className="metric-box"><span>Pendentes</span><h2 style={{ color: mainColor }}>{tasks.filter(t => !t.done).length}</h2></div>
        <div className="metric-box"><span>Foco</span><h2 style={{ color: mainColor }}>{tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0}%</h2></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        
        {/* Gráfico de Área */}
        <div className="chart-panel">
          <h3 style={{ marginBottom: '20px' }}>Evolução de Produtividade (Anual)</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mainColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: mainColor }} />
                <Area type="monotone" dataKey="tarefas" stroke={mainColor} strokeWidth={3} fillOpacity={1} fill="url(#colorGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Donut */}
        <div className="chart-panel">
          <h3 style={{ marginBottom: '20px' }}>Divisão por Categoria</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: mainColor }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Gráfico de Barras */}
      <div className="chart-panel">
        <h3 style={{ marginBottom: '20px' }}>Atividades da Semana</h3>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={weekData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} itemStyle={{ color: mainColor }} />
              <Bar dataKey="qtd" fill={mainColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}