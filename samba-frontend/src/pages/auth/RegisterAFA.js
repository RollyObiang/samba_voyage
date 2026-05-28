import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';
import logoAFA from '../../assets/Africa First Assist_.jpeg'; // Import du logo pour la cohérence

const InscriptionAFA = () => {
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://sambavoyage.vercel.app/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nom_complet: nom,      
                    email: email, 
                    mot_de_passe: password, 
                    role: 'afa' 
                })
            });

            if (res.ok) {
                alert("Compte Gestionnaire AFA créé !");
                navigate('/login-afa');
            } else {
                const data = await res.json();
                alert(data.error || "Erreur d'inscription AFA");
            }
        } catch (err) {
            alert("Erreur de connexion au serveur");
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

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <UserCheck size={30} color="#0070bb" />
                    </div>
                    
                    <h2 style={styles.title}>Inscription Portail AFA</h2>
                    <p style={styles.subtitle}>Demande d'accès gestionnaire</p>
                    
                    <form onSubmit={handleRegister} style={styles.form}>
                        <input 
                            style={styles.input} 
                            type="text" 
                            placeholder="Nom complet" 
                            onChange={(e) => setNom(e.target.value)} 
                            required 
                        />
                        <input 
                            style={styles.input} 
                            type="email" 
                            placeholder="Email professionnel (@afa.com)" 
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
                        <button type="submit" style={styles.button}>Créer mon accès AFA</button>
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
        maxWidth: '400px', 
        textAlign: 'center' 
    },
    logo: { 
        height: '55px', 
        marginBottom: '20px', 
        borderRadius: '8px', 
        cursor: 'pointer',
        transition: 'transform 0.2s'
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
        padding: '12px 15px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        outline: 'none',
        fontSize: '14px'
    },
    button: { 
        background: '#0070bb', 
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

export default InscriptionAFA;