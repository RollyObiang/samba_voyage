import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User } from 'lucide-react'; 
import logoSamba from '../../assets/Logo Samba.jpeg';

const LoginAgence = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Force la déconnexion si on arrive sur cette page
    useEffect(() => {
        localStorage.removeItem('role');
        localStorage.removeItem('agenceConnectee'); // Nettoyage propre
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok && data.user.role === 'agence') {
                // --- MODIFICATIONS ICI ---
                localStorage.setItem('role', 'agence');
                // On stocke tout l'objet user (contient l'ID, l'email, le nom, etc.)
                localStorage.setItem('agenceConnectee', JSON.stringify(data.user)); 
                
                navigate('/dashboard-agence');
            } else { 
                alert(data.error || "Accès refusé"); 
            }
        } catch (err) { 
            alert("Erreur serveur"); 
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.containerFixed}>
                <div style={styles.card}>
                    <img 
                        src={logoSamba} 
                        alt="Logo Samba" 
                        style={styles.logo} 
                        onClick={() => navigate('/')}
                        title="Retour à l'accueil"
                    />
                    
                    <h2 style={styles.title}>Portail Agence</h2>
                    
                    <form onSubmit={handleLogin} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <User size={18} style={styles.inputIcon} />
                            <input 
                                type="email" 
                                placeholder="Email" 
                                style={styles.input} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input 
                                type="password" 
                                placeholder="Mot de passe" 
                                style={styles.input} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" style={{...styles.button, background: '#ed1c24'}}>
                            Se connecter
                        </button>
                    </form>
                    
                    <Link to="/inscription-agence" style={styles.registerLink}>
                        Créer un compte
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Tes styles restent strictement identiques
const styles = {
    body: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' },
    containerFixed: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
    card: { background: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px', textAlign: 'center' },
    logo: { height: '60px', marginBottom: '20px', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.2s ease' },
    title: { color: '#1e293b', fontSize: '22px', fontWeight: 'bold', marginBottom: '25px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '15px', color: '#cbd5e1' },
    input: { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box', fontSize: '14px' },
    button: { color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '5px' },
    registerLink: { marginTop: '20px', color: '#ed1c24', fontSize: '13px', textDecoration: 'none', display: 'block', fontWeight: '500' }
};

export default LoginAgence;