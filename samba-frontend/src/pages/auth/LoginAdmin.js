import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSamba from '../../assets/samb-assurances.png';

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Nettoie la session à l'arrivée sur la page
    useEffect(() => {
        localStorage.removeItem('role');
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://sambavoyage.vercel.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.user.role === 'admin') {
                localStorage.setItem('role', 'admin');
                navigate('/admin-samba');
            } else { 
                alert(data.error || "Accès refusé : Identifiants administrateur incorrects"); 
            }
        } catch (err) { 
            alert("Erreur : Impossible de joindre le serveur"); 
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.containerFixed}>
                <div style={styles.card}>
                    {/* LOGO CLIQUABLE VERS L'ACCUEIL */}
                    <img 
                        src={logoSamba} 
                        alt="Logo Samba" 
                        style={styles.logo} 
                        onClick={() => navigate('/')}
                        title="Retour à l'accueil"
                    />
                    
                    <h2 style={styles.title}> Admin Samba</h2>
                    <p style={styles.subtitle}>Supervision du système</p>
                    
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input 
                            type="email" 
                            placeholder="Email Admin" 
                            style={styles.input} 
                            onChange={(e)=>setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Mot de passe" 
                            style={styles.input} 
                            onChange={(e)=>setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit" style={styles.button}> 
                            Ouvrir la session
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    body: { 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#0f172a' 
    },
    containerFixed: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    card: { 
        background: 'white', 
        padding: '40px', 
        borderRadius: '25px', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', 
        width: '100%', 
        maxWidth: '380px', 
        textAlign: 'center' 
    },
    logo: { 
        height: '65px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        cursor: 'pointer',
        transition: '0.3s',
        // Suppression du filtre gris pour que le logo garde ses couleurs sur la page login
    },
    title: { 
        color: '#1e293b', 
        fontSize: '22px', 
        fontWeight: 'bold', 
        margin: '0' 
    },
    subtitle: {
        color: '#64748b',
        fontSize: '14px',
        marginBottom: '25px'
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px' 
    },
    input: { 
        width: '100%', 
        padding: '12px 15px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        outline: 'none',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    button: { 
        background: '#1e293b',
        color: 'white', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px'
    }
};

export default LoginAdmin;