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
            const response = await fetch('https://sambavoyage.vercel.app/api/contrats/login-client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifiant, password }),
            });

            const data = await response.json();

            if (data.success) {
                const clientNomComplet = `${data.client.prenom} ${data.client.nom}`;
                
                localStorage.setItem('clientConnecte', JSON.stringify(data.client));
                
                alert(`Bienvenue ${clientNomComplet} !`);
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
        <div style={styles.splitLayout} className="responsive-layout">
            {/* --- PARTIE GAUCHE : RÉCAPITULATIF OU LOGO --- */}
            <div style={styles.leftPanel} className="responsive-panel panel-left">
                {estNouveau ? (
                    <>
                        <div style={styles.successHeader}>
                            <CheckCircle size={50} color="#39b54a" />
                            <h1 style={styles.mainTitle} className="responsive-title">Félicitations !</h1>
                            <p style={styles.subTitle}>Votre compte Samba Voyage est prêt.</p>
                        </div>

                        <div style={styles.dataCard}>
                            <div style={styles.cardHeader}>
                                <ShieldCheck size={20} color="#39b54a" />
                                <span>RÉCAPITULATIF DE SOUSCRIPTION</span>
                            </div>
                            <div style={styles.dataContent}>
                                <p><strong>Client :</strong> {nouveauClientData?.souscripteur_nom}</p>
                                <p><strong>N° Police :</strong> <span style={{color: '#e11d48', fontWeight: '700'}}>{numPolice}</span></p>
                                <p><strong>Destination :</strong> {nouveauClientData?.destination}</p>
                                <p><strong>Montant payé :</strong> {nouveauClientData?.montant} FCFA</p>
                            </div>
                            <div style={styles.idReminder}>
                                <p style={{fontSize: '12px', margin: '0 0 5px 0', fontWeight: '700', color: '#475569'}}>VOTRE IDENTIFIANT DE CONNEXION :</p>
                                <div style={styles.idBadge}>{nouveauClientData?.identifiant_client}</div>
                                <p style={{fontSize: '11px', marginTop: '10px', color: '#64748b'}}>
                                    Mot de passe par défaut : <strong>Password1234</strong>
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{textAlign: 'center', width: '100%'}}>
                        <img src={logoSamba} style={styles.centerLogo} alt="Samba" />
                        <h2 style={{color: '#1e293b', fontWeight: '800', margin: '10px 0'}}>Bienvenue sur votre portail</h2>
                        <p style={{color: '#64748b', margin: 0}}>Gérez vos contrats en toute simplicité.</p>
                    </div>
                )}
            </div>

            {/* --- PARTIE DROITE : FORMULAIRE DE CONNEXION --- */}
            <div style={styles.rightPanel} className="responsive-panel panel-right">
                <div style={styles.loginContainer}>
                    <div style={styles.loginHeader}>
                        <h2 style={{margin: '0 0 6px 0', fontWeight: '800', color: '#1e293b', fontSize: '26px'}}>Connexion</h2>
                        <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>Accédez à vos données personnelles</p>
                    </div>

                    <form style={styles.form} onSubmit={handleLogin}>
                        <div style={styles.inputBox}>
                            <User size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
                            <input 
                                type="text" 
                                placeholder="Identifiant" 
                                style={styles.inputField} 
                                value={identifiant}
                                onChange={(e) => setIdentifiant(e.target.value)}
                            />
                        </div>

                        <div style={styles.inputBox}>
                            <Lock size={20} color="#94a3b8" style={{ flexShrink: 0 }} />
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

// --- DESIGN SYSTEM DES STYLES EN LIGNE (PC PAR DÉFAUT) ---
const styles = {
    splitLayout: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Segoe UI, Roboto, sans-serif', boxSizing: 'border-box' },
    leftPanel: { 
        flex: 1, 
        background: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '5%',
        borderRight: '1px solid #f1f5f9',
        boxSizing: 'border-box',
        overflowY: 'auto'
    },
    successHeader: { marginBottom: '25px' },
    mainTitle: { color: '#1e293b', margin: '10px 0 5px 0', fontWeight: '800' },
    subTitle: { fontSize: '16px', color: '#64748b', margin: 0 },
    dataCard: { background: '#f8fafc', borderRadius: '20px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontWeight: '800', color: '#39b54a', marginBottom: '15px', letterSpacing: '0.5px' },
    dataContent: { fontSize: '14px', color: '#334155', lineHeight: '1.8' },
    idReminder: { marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e2e8f0', textAlign: 'center' },
    idBadge: { background: '#39b54a', color: 'white', padding: '8px 20px', borderRadius: '10px', fontSize: '22px', fontWeight: '800', display: 'inline-block', letterSpacing: '0.5px' },
    centerLogo: { width: '140px', marginBottom: '15px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' },
    
    rightPanel: { flex: 1, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', overflowY: 'auto' },
    loginContainer: { width: '100%', maxWidth: '380px', background: 'transparent' },
    loginHeader: { marginBottom: '25px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    inputBox: { display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', transition: 'border-color 0.2s' },
    inputField: { border: 'none', outline: 'none', width: '100%', fontSize: '15px', color: '#1e293b' },
    btnSubmit: { background: '#1e293b', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'background-color 0.2s', fontSize: '15px' },
    btnBack: { background: 'none', border: 'none', color: '#64748b', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline', width: '100%', fontSize: '14px', fontWeight: '500' }
};

// --- CODE STYLE CSS INJECTÉ POUR LE RESPONSIVE MOBILE ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
/* Styles spécifiques pour grands écrans */
@media (min-width: 768px) {
    .responsive-title { font-size: 36px; }
}

/* Bascule responsive pour Tablettes et Smartphones */
@media (max-width: 767px) {
    .responsive-layout {
        flex-direction: column !important;
        height: auto !important;
        overflow: -webkit-paged-x !important; /* Nettoyage scroll */
    }
    .responsive-panel {
        flex: none !important;
        width: 100% !important;
    }
    .panel-left {
        padding: 40px 24px !important;
        border-right: none !important;
        border-bottom: 1px solid #f1f5f9 !important;
    }
    .panel-right {
        padding: 40px 24px 60px 24px !important;
        background-color: #f8fafc !important; /* Adoucissement du fond gris sur mobile */
    }
    .responsive-title {
        font-size: 28px !important;
    }
}
`;
document.head.appendChild(styleSheet);

export default EspaceClient;