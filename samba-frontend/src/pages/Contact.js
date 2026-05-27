import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import de ton composant Navbar global

// Importation de tes images
import servImg from '../assets/serv.jpg'; 
import logoSamba from '../assets/Logo Samba.jpeg'; 

const Contact = () => {
    const navigate = useNavigate();
    
    // États pour gérer le survol (hover)
    const [hoveredItem, setHoveredItem] = useState(null);
    const [imgHover, setImgHover] = useState(false);

    return (
        <div style={{ backgroundColor: '#fff', overflowX: 'hidden' }}>
            
            {/* 1. LA BARRE DE NAVIGATION COMMUNE */}
            <Navbar />

            {/* CONTENEUR PRINCIPAL DE LA PAGE */}
            <div style={styles.container} className="responsive-container">
                
                {/* PETIT FIL D'ARIANE / LOGO OPTIONNEL SI PAS DE NAVBAR REPRISE EN HAUT */}
                <div style={styles.logoContainer}>
                    <img 
                        src={logoSamba} 
                        alt="Logo Samba" 
                        style={styles.logoSmall} 
                        onClick={() => navigate('/')} 
                    />
                </div>

                {/* GRILLE PRINCIPALE (INFOS | FORMULAIRE) */}
                <div style={styles.grid} className="responsive-grid">
                    
                    {/* COLONNE DE GAUCHE : INFORMATIONS */}
                    <div style={styles.infoCol}>
                        
                        {/* IMAGE AVEC EFFET SURVOL */}
                        <div style={{ overflow: 'hidden', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                            <img 
                                src={servImg} 
                                alt="Support Client" 
                                style={{
                                    ...styles.servImage,
                                    transform: imgHover ? 'scale(1.04)' : 'scale(1)',
                                }} 
                                onMouseEnter={() => setImgHover(true)}
                                onMouseLeave={() => setImgHover(false)}
                            />
                        </div>

                        <h1 style={styles.title} className="responsive-title">Contactez-nous</h1>
                        <p style={styles.subtitle}>Une question ? Notre équipe d'experts vous répond sous 24h.</p>
                        
                        {/* ITEM : SIÈGE SOCIAL (Ouvre Google Maps sur l'Avenue de Cointet) */}
                        <div 
                            style={{
                                ...styles.infoItem,
                                backgroundColor: hoveredItem === 'map' ? '#f0fdf4' : 'transparent',
                                transform: hoveredItem === 'map' ? 'translateX(8px)' : 'translateX(0)',
                                border: hoveredItem === 'map' ? '1px solid #39b54a' : '1px solid #f1f5f9'
                            }}
                            onMouseEnter={() => setHoveredItem('map')}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => window.open('https://maps.google.com/?q=Avenue+de+COINTET,+Libreville,+Gabon', '_blank')}
                        >
                            <div style={{...styles.iconWrapper, background: '#e8f7ec'}}><MapPin color="#39b54a" size={22} /></div>
                            <div>
                                <strong style={styles.itemLabel}>Siège Social</strong>
                                <p style={styles.itemText}>Avenue de COINTET, Libreville, Gabon</p>
                            </div>
                        </div>

                        {/* ITEM : TÉLÉPHONE (Appel Direct) */}
                        <a 
                            href="tel:+24174404141"
                            style={{
                                ...styles.infoItem,
                                textDecoration: 'none',
                                color: 'inherit',
                                backgroundColor: hoveredItem === 'phone' ? '#f0fdf4' : 'transparent',
                                transform: hoveredItem === 'phone' ? 'translateX(8px)' : 'translateX(0)',
                                border: hoveredItem === 'phone' ? '1px solid #39b54a' : '1px solid #f1f5f9'
                            }}
                            onMouseEnter={() => setHoveredItem('phone')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <div style={{...styles.iconWrapper, background: '#e0f2fe'}}><Phone color="#0070bb" size={22} /></div>
                            <div>
                                <strong style={styles.itemLabel}>Téléphone</strong>
                                <p style={styles.itemText}>074 40 41 41 / +241 065 65 00 00</p>
                            </div>
                        </a>

                        {/* ITEM : EMAIL (Envoi Direct) */}
                        <a 
                            href="mailto:infos@samba-assurances.com"
                            style={{
                                ...styles.infoItem,
                                textDecoration: 'none',
                                color: 'inherit',
                                backgroundColor: hoveredItem === 'mail' ? '#f0fdf4' : 'transparent',
                                transform: hoveredItem === 'mail' ? 'translateX(8px)' : 'translateX(0)',
                                border: hoveredItem === 'mail' ? '1px solid #39b54a' : '1px solid #f1f5f9'
                            }}
                            onMouseEnter={() => setHoveredItem('mail')}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <div style={{...styles.iconWrapper, background: '#e0f2fe'}}><Mail color="#0070bb" size={22} /></div>
                            <div>
                                <strong style={styles.itemLabel}>Email général</strong>
                                <p style={styles.itemText}>infos@samba-assurances.com</p>
                            </div>
                        </a>
                    </div>

                    {/* COLONNE DE DROITE : FORMULAIRE DE CONTACT */}
                    <div style={styles.formCol} className="responsive-form-col">
                        <h2 style={{margin: '0 0 20px 0', color: '#0f172a', fontWeight: '800'}}>Écrivez-nous</h2>
                        <form style={styles.form}>
                            <label style={styles.label}>Nom complet</label>
                            <input style={styles.input} type="text" placeholder="Ex: Marc Obame" required />
                            
                            <label style={styles.label}>Adresse Email</label>
                            <input style={styles.input} type="email" placeholder="Ex: marc@gmail.com" required />
                            
                            <label style={styles.label}>Votre Message</label>
                            <textarea style={styles.textarea} placeholder="Dites-nous comment nous pouvons vous aider..." required></textarea>
                            
                            <button type="submit" style={styles.btn}>
                                ENVOYER LE MESSAGE <Send size={18} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- LE DESIGN SYSTEM STYLES EN LIGNE ---
const styles = {
    container: { boxSizing: 'border-box', background: 'white', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
    logoContainer: { marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' },
    logoSmall: { height: '45px', width: 'auto', cursor: 'pointer', borderRadius: '8px' },
    grid: { display: 'grid', gap: '50px' },
    infoCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
    title: { color: '#0f172a', fontWeight: '800', margin: '15px 0 5px 0' },
    subtitle: { color: '#64748b', margin: '0 0 10px 0', fontSize: '16px' },
    
    servImage: {
        width: '100%',
        height: '280px',
        objectFit: 'cover',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default'
    },

    infoItem: { 
        display: 'flex', 
        gap: '20px', 
        alignItems: 'center', 
        padding: '18px', 
        borderRadius: '16px', 
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box'
    },
    iconWrapper: {
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '46px'
    },
    itemLabel: { display: 'block', fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '2px' },
    itemText: { margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.4' },

    formCol: { background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '24px', alignSelf: 'start', boxSizing: 'border-box' },
    form: { display: 'flex', flexDirection: 'column' },
    label: { fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '6px', paddingLeft: '2px' },
    input: { padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', marginBottom: '20px', fontSize: '15px', outline: 'none', transition: 'border 0.2s' },
    textarea: { padding: '14px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#fff', minHeight: '140px', marginBottom: '25px', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', outline: 'none' },
    btn: { background: '#39b54a', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 20px rgba(57, 181, 74, 0.25)', transition: 'background 0.2s' }
};

// --- INJECTION AUTO DES CONFIGURATIONS RESPONSIVES (CSS MEDIA QUERIES) ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
/* Styles pour Ordinateurs et Tablettes larges */
@media (min-width: 992px) {
    .responsive-container { padding: 60px 10% 100px 10%; }
    .responsive-grid { grid-template-columns: 1.1fr 0.9fr; gap: 80px; }
    .responsive-form-col { padding: 45px; }
    .responsive-title { font-size: 38px; }
}

/* Styles pour Tablettes et Écrans intermédiaires */
@media (min-width: 768px) and (max-width: 991px) {
    .responsive-container { padding: 50px 5% 80px 5%; }
    .responsive-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
    .responsive-form-col { padding: 30px; }
    .responsive-title { font-size: 32px; }
}

/* Styles pour Téléphones portables (Mobiles) */
@media (max-width: 767px) {
    .responsive-container { padding: 30px 20px 60px 20px; }
    .responsive-grid { grid-template-columns: 1fr; gap: 40px; }
    .responsive-form-col { padding: 25px; }
    .responsive-title { font-size: 28px; text-align: center; }
    .responsive-container p { text-align: center; }
}
`;
document.head.appendChild(styleSheet);

export default Contact;