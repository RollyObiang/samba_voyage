import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import logoSamba from '../../assets/Logo Samba.jpeg';

const InscriptionAgence = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nom_complet: nom,      
                    email: email, 
                    mot_de_passe: password, 
                    role: 'agence'          
                })
            });

            if (res.ok) {
                alert("Compte agence créé avec succès !");
                navigate('/login-agence');
            } else {
                const data = await res.json();
                alert(data.error || "Erreur d'inscription");
            }
        } catch (err) {
            alert("Impossible de joindre le serveur");
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.containerFixed}>
                <div style={styles.card}>
                    {/* LOGO CLIQUABLE */}
                    <img 
                        src={logoSamba} 
                        alt="Logo Samba" 
                        style={styles.logo} 
                        onClick={() => navigate('/')}
                        title="Retour à l'accueil"
                    />

                    <div style={styles.iconWrapper}>
                        <Building size={35} color="#ed1c24" />
                    </div>

                    <h2 style={styles.title}>Inscription Agence</h2>
                    <p style={styles.subtitle}>Créez votre accès partenaire</p>
                    
                    <form onSubmit={handleRegister} style={styles.form}>
                        <input 
                            style={styles.input} 
                            type="text" 
                            placeholder="Nom de l'agence" 
                            onChange={(e) => setNom(e.target.value)} 
                            required 
                        />
                        <input 
                            style={styles.input} 
                            type="email" 
                            placeholder="Email professionnel" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            style={styles.input} 
                            type="password" 
                            placeholder="Mot de passe" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button 
                            type="submit" 
                            style={styles.button}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#d11920'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#ed1c24'}
                        >
                            Créer mon compte
                        </button>
                    </form>

                    <p style={styles.footerText}>
                        Déjà inscrit ? <span style={styles.link} onClick={() => navigate('/login-agence')}>Connectez-vous</span>
                    </p>
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
        background: '#f8fafc',
        fontFamily: 'Arial, sans-serif'
    },
    containerFixed: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '20px'
    },
    card: { 
        background: 'white', 
        padding: '40px', 
        borderRadius: '25px', 
        boxShadow: '0 15px 35px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center' 
    },
    logo: { 
        height: '60px', 
        marginBottom: '15px', 
        borderRadius: '8px', 
        cursor: 'pointer'
    },
    iconWrapper: {
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '10px'
    },
    title: { 
        color: '#1e293b', 
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
        padding: '12px 15px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        outline: 'none',
        fontSize: '14px',
        transition: 'border-color 0.2s'
    },
    button: { 
        background: '#ed1c24', 
        color: 'white', 
        border: 'none', 
        padding: '14px', 
        borderRadius: '12px', 
        fontWeight: 'bold', 
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
        transition: 'background 0.3s ease'
    },
    footerText: {
        marginTop: '20px',
        fontSize: '13px',
        color: '#64748b'
    },
    link: {
        color: '#ed1c24',
        fontWeight: 'bold',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};

export default InscriptionAgence;