import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoAFA from '../../assets/Africa First Assist_.jpeg';

const LoginAFA = () => {
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
            const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok && data.user.role === 'afa') {
                localStorage.setItem('role', 'afa');
                navigate('/portail-afa');
            } else { 
                alert(data.error || "Accès refusé : Identifiants AFA incorrects"); 
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
                        src={logoAFA} 
                        alt="Logo AFA" 
                        style={styles.logo} 
                        onClick={() => navigate('/')}
                        title="Retour à l'accueil"
                    />

                    <h2 style={styles.title}>Portail AFA</h2>
                    <p style={styles.subtitle}>Espace Gestionnaire Africa First Assist</p>
                    
                    <form onSubmit={handleLogin} style={styles.form}>
                        <input 
                            type="email" 
                            placeholder="Email professionnel @afa.com" 
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
                            Accéder aux dossiers
                        </button>
                    </form>
                    
                    <div style={{marginTop: '15px'}}>
                        <Link to="/inscription-afa" style={styles.link}>
                            Demander un accès AFA
                        </Link>
                    </div>
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
        background: '#f0f9ff' 
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
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '380px', 
        textAlign: 'center' 
    },
    logo: { 
        height: '60px', 
        marginBottom: '15px', 
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease'
    },
    title: { 
        color: '#0c4a6e', 
        fontSize: '22px', 
        fontWeight: 'bold', 
        margin: '0' 
    },
    subtitle: {
        color: '#94a3b8',
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
        background: '#0070bb',
        color: 'white', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        fontSize: '16px'
    },
    link: {
        fontSize: '13px', 
        color: '#0070bb', 
        textDecoration: 'none'
    }
};

export default LoginAFA;