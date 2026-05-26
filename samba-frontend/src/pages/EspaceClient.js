import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg';

const EspaceClient = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const nouveauClientData = location.state?.info;
    const numPolice = location.state?.police;
    const estNouveau = location.state?.nouveauClient;

    const [identifiant, setIdentifiant] = useState('');
    const [password, setPassword] = useState('');

    // --- FONCTION DE CONNEXION ---
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!identifiant || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/contrats/login-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifiant, password }),
            });

            const data = await response.json();

            if (data.success) {
                // CORRECTION : On récupère le nom et prénom depuis la nouvelle structure de données
                const clientNomComplet = `${data.client.prenom} ${data.client.nom}`;
                
                // On enregistre les infos dans le localStorage pour les utiliser sur le Dashboard
                localStorage.setItem('clientConnecte', JSON.stringify(data.client));
                
                alert(`Bienvenue ${clientNomComplet} !`);
                
                // On active la redirection
                navigate('/dashboard-client'); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Erreur login:", error);
            alert("Le serveur de connexion ne répond pas.");
        }
    };

    return (
        <div style={styles.splitLayout}>
            {/* --- PARTIE GAUCHE : RÉCAPITULATIF --- */}
            <div style={styles.leftPanel}>
                {estNouveau ? (
                    <>
                        <div style={styles.successHeader}>
                            <CheckCircle size={50} color="#39b54a" />
                            <h1 style={styles.mainTitle}>Félicitations !</h1>
                            <p style={styles.subTitle}>Votre compte Samba Voyage est prêt.</p>
                        </div>

                        <div style={styles.dataCard}>
                            <div style={styles.cardHeader}>
                                <ShieldCheck size={20} color="#39b54a" />
                                <span>RÉCAPITULATIF DE SOUSCRIPTION</span>
                            </div>
                            <div style={styles.dataContent}>
                                <p><strong>Client :</strong> {nouveauClientData?.souscripteur_nom}</p>
                                <p><strong>N° Police :</strong> <span style={{color: '#e11d48'}}>{numPolice}</span></p>
                                <p><strong>Destination :</strong> {nouveauClientData?.destination}</p>
                                <p><strong>Montant payé :</strong> {nouveauClientData?.montant} FCFA</p>
                            </div>
                            <div style={styles.idReminder}>
                                <p style={{fontSize: '12px', margin: '0 0 5px 0'}}>VOTRE IDENTIFIANT DE CONNEXION :</p>
                                <div style={styles.idBadge}>{nouveauClientData?.identifiant_client}</div>
                                <p style={{fontSize: '10px', marginTop: '10px', color: '#64748b'}}>
                                    Mot de passe par défaut : <strong>Password1234</strong>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{textAlign: 'center'}}>
                        <img src={logoSamba} style={{width: '150px', marginBottom: '20px', borderRadius: '10px'}} alt="Samba" />
                        <h2>Bienvenue sur votre portail</h2>
                        <p>Gérez vos contrats en toute simplicité.</p>
                    </div>
                )}
            </div>

            {/* --- PARTIE DROITE : FORMULAIRE DE CONNEXION --- */}
            <div style={styles.rightPanel}>
                <div style={styles.loginContainer}>
                    <div style={styles.loginHeader}>
                        <h2 style={{margin: 0}}>Connexion</h2>
                        <p style={{fontSize: '14px', color: '#64748b'}}>Accédez à vos données personnelles</p>
                    </div>

                    <form style={styles.form} onSubmit={handleLogin}>
                        <div style={styles.inputBox}>
                            <User size={20} color="#94a3b8" />
                            <input 
                                type="text" 
                                placeholder="Identifiant" 
                                style={styles.inputField} 
                                value={identifiant}
                                onChange={(e) => setIdentifiant(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputBox}>
                            <Lock size={20} color="#94a3b8" />
                            <input 
                                type="password" 
                                placeholder="Mot de passe" 
                                style={styles.inputField}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" style={styles.btnSubmit}>
                            SE CONNECTER <ArrowRight size={18} />
                        </button>
                    </form>
                    
                    <button onClick={() => navigate('/')} style={styles.btnBack}>
                        Retour au site officiel
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    splitLayout: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Segoe UI, sans-serif' },
    leftPanel: { 
        flex: 1, 
        background: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '5%',
        borderRight: '1px solid #f1f5f9'
    },
    successHeader: { marginBottom: '30px' },
    mainTitle: { fontSize: '32px', color: '#1e293b', margin: '10px 0' },
    subTitle: { fontSize: '18px', color: '#64748b' },
    dataCard: { background: '#f8fafc', borderRadius: '20px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 'bold', color: '#39b54a', marginBottom: '20px', letterSpacing: '1px' },
    dataContent: { fontSize: '15px', color: '#334155', lineHeight: '1.8' },
    idReminder: { marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', textAlign: 'center' },
    idBadge: { background: '#39b54a', color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '24px', fontWeight: 'bold', display: 'inline-block' },
    rightPanel: { flex: 1, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loginContainer: { width: '100%', maxWidth: '400px', padding: '20px' },
    loginHeader: { marginBottom: '30px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputBox: { display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #cbd5e1' },
    inputField: { border: 'none', outline: 'none', width: '100%', fontSize: '16px' },
    btnSubmit: { background: '#1e293b', color: 'white', border: 'none', padding: '18px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.3s' },
    btnBack: { background: 'none', border: 'none', color: '#64748b', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline', width: '100%' }
};

export default EspaceClient;