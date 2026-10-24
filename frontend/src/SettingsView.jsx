import { useState } from 'react';

export default function SettingsView({ themeColor, setThemeColor }) {
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || 'https://i.pravatar.cc/150');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Administrador DevOps');
  
  // Cores pré-definidas para escolher
  const colors = ['#c084fc', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem('profilePic', reader.result);
        window.location.reload(); // Recarrega para atualizar a foto no topo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
    localStorage.setItem('userName', e.target.value);
  };

  return (
    <div className="settings-page">
      
      {/* PERFIL DO USUÁRIO */}
      <div className="settings-card">
        <h2>Perfil do Usuário</h2>
        <div className="profile-info">
          <div style={{ position: 'relative' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: `url(${profilePic}) center/cover`, border: `3px solid ${themeColor}`, boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}></div>
            <label style={{ position: 'absolute', bottom: '0', right: '0', background: themeColor, color: '#000', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 'bold' }}>
              ✎
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <input 
              type="text" 
              value={userName} 
              onChange={handleNameChange} 
              style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '24px', fontWeight: '600', outline: 'none', width: '100%', borderBottom: '1px solid #27272a', paddingBottom: '5px' }}
            />
            <p style={{ color: '#a1a1aa', marginTop: '10px' }}>admin@taskflow.com</p>
            <span className="badge cat" style={{ marginTop: '10px', display: 'inline-block', background: themeColor, color: '#000' }}>Plano Enterprise</span>
          </div>
        </div>
      </div>

      {/* PERSONALIZAÇÃO DE TEMA */}
      <div className="settings-card">
        <h2>Personalização do Sistema</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '14px' }}>Escolha a cor principal do seu workspace.</p>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          {colors.map(color => (
            <button
              key={color}
              onClick={() => setThemeColor(color)}
              style={{
                width: '50px', height: '50px', borderRadius: '50%', background: color, border: themeColor === color ? '3px solid white' : '3px solid transparent',
                cursor: 'pointer', transition: '0.3s', boxShadow: themeColor === color ? `0 0 15px ${color}` : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* INTEGRAÇÕES */}
      <div className="settings-card">
        <h2>Integrações do Sistema (CI/CD)</h2>
        <div className="integration-item">
          <div>
            <h4>GitHub Actions</h4>
            <p>Pipeline de testes automatizados</p>
          </div>
          <span className="status-badge online">Conectado</span>
        </div>
        <div className="integration-item">
          <div>
            <h4>UptimeRobot</h4>
            <p>Monitoramento de disponibilidade</p>
          </div>
          <span className="status-badge online">Ativo</span>
        </div>
        <div className="integration-item">
          <div>
            <h4>Vercel & Railway</h4>
            <p>Hospedagem de Frontend e Backend</p>
          </div>
          <span className="status-badge online">Online</span>
        </div>
      </div>

    </div>
  );
}