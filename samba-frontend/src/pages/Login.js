import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const [estInscription, setEstInscription] = useState(false);
  const [identifiant, setIdentifiant] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const gererAuth = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifiant, mot_de_passe: password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userNom', data.user.nom);
        localStorage.setItem('userRole', data.user.role);
        if (data.user.role === 'client') navigate('/espace-client');
        else if (data.user.role === 'agence') navigate('/dashboard');
        else navigate('/portail-afa');
      } else { alert(data.error); }
    } catch (error) { alert("Erreur serveur"); }
  };

  return (
    <div style={styles.body}>
      <div style={styles.loginCard}>
        <img src="/Logo Samba.jpeg" width="120" alt="Logo" style={{marginBottom: 20}} />
        <h2 style={{color: '#1e293b'}}>{estInscription ? "Activer mon compte" : "Espace Client"}</h2>
        
        <form onSubmit={gererAuth}>
          <div style={styles.inputGroup}>
            <User size={18} style={styles.icon} />
            <input 
              type="text" 
              placeholder={estInscription ? "Nom complet" : "Email ou Nom complet"}
              style={styles.input}
              onChange={(e) => setIdentifiant(e.target.value)}
              required 
            />
          </div>
          
          <div style={styles.inputGroup}>
            <Lock size={18} style={styles.icon} />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" style={styles.btnLogin}>
            {estInscription ? "ACTIVER L'ACCÈS" : "CONNEXION"} <ArrowRight size={18} style={{marginLeft: 10}} />
          </button>
        </form>
        
        <span style={styles.toggleLink} onClick={() => setEstInscription(!estInscription)}>
          <ShieldCheck size={14} style={{marginRight: 5}} />
          {estInscription ? "Déjà un compte ? Se connecter" : "Première connexion ? Activer mon compte"}
        </span>
      </div>
    </div>
  );
};

const styles = {
  body: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0f4f8' },
  loginCard: { background: 'white', padding: '40px', borderRadius: '16px', width: '90%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderTop: '5px solid #39b54a' },
  inputGroup: { display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #ddd', borderRadius: '8px', margin: '12px 0', padding: '0 12px' },
  icon: { color: '#64748b' },
  input: { width: '100%', padding: '12px', border: 'none', background: 'transparent', outline: 'none' },
  btnLogin: { width: '100%', padding: '14px', background: '#39b54a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  toggleLink: { marginTop: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#39b54a', fontSize: '13px', cursor: 'pointer' }
};

export default Login;