import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Importation de tes images
import servImg from '../assets/serv.jpg'; 
import logoSamba from '../assets/Logo Samba.jpeg'; 

const Contact = () => {
    const navigate = useNavigate();
    
    // États pour gérer le survol (hover)
    const [hoveredItem, setHoveredItem] = useState(null);
    const [imgHover, setImgHover] = useState(false);

    return (
        <div style={styles.container}>
            {/* LOGO CLIQUABLE EN HAUT À GAUCHE */}
            <div style={styles.logoContainer}>
                <img 
                    src={logoSamba} 
                    alt="Logo Samba" 
                    style={styles.logoSmall} 
                    onClick={() => navigate('/')} 
                />
            </div>

            <div style={styles.grid}>
                <div style={styles.infoCol}>
                    
                    {/* IMAGE AVEC EFFET SURVOL UNIQUEMENT */}
                    <div style={{ overflow: 'hidden', borderRadius: '15px' }}>
                        <img 
                            src={servImg} 
                            alt="Support Client" 
                            style={{
                                ...styles.servImage,
                                transform: imgHover ? 'scale(1.05)' : 'scale(1)',
                            }} 
                            onMouseEnter={() => setImgHover(true)}
                            onMouseLeave={() => setImgHover(false)}
                        />
                    </div>

                    <h1>Contactez-nous</h1>
                    <p>Une question ? Notre équipe vous répond sous 24h.</p>
                    
                    {/* ITEM : SIÈGE SOCIAL (Survol + Clic) */}
                    <div 
                        style={{
                            ...styles.infoItem,
                            backgroundColor: hoveredItem === 'map' ? '#f0fdf4' : 'transparent',
                            transform: hoveredItem === 'map' ? 'translateX(10px)' : 'translateX(0)',
                            border: hoveredItem === 'map' ? '1px solid #39b54a' : '1px solid transparent'
                        }}
                        onMouseEnter={() => setHoveredItem('map')}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => window.open('https://maps.google.com', '_blank')}
                    >
                        <MapPin color="#39b54a" />
                        <div>
                            <strong>Siège Social</strong>
                            <p>Immeuble Samba, Centre-Ville, Libreville, Gabon</p>
                        </div>
                    </div>

                    {/* ITEM : TÉLÉPHONE (Survol + Clic) */}
                    <a 
                        href="tel:+24165650000"
                        style={{
                            ...styles.infoItem,
                            textDecoration: 'none',
                            color: 'inherit',
                            backgroundColor: hoveredItem === 'phone' ? '#f0fdf4' : 'transparent',
                            transform: hoveredItem === 'phone' ? 'translateX(10px)' : 'translateX(0)',
                            border: hoveredItem === 'phone' ? '1px solid #0070bb' : '1px solid transparent'
                        }}
                        onMouseEnter={() => setHoveredItem('phone')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Phone color="#0070bb" />
                        <div>
                            <strong>Téléphone</strong>
                            <p>+241 065 65 00 00 / 074 40 41 41</p>
                        </div>
                    </a>

                    {/* ITEM : EMAIL (Survol + Clic) */}
                    <a 
                        href="mailto:contact@samba-voyage.ga"
                        style={{
                            ...styles.infoItem,
                            textDecoration: 'none',
                            color: 'inherit',
                            backgroundColor: hoveredItem === 'mail' ? '#f0fdf4' : 'transparent',
                            transform: hoveredItem === 'mail' ? 'translateX(10px)' : 'translateX(0)',
                            border: hoveredItem === 'mail' ? '1px solid #0070bb' : '1px solid transparent'
                        }}
                        onMouseEnter={() => setHoveredItem('mail')}
                        onMouseLeave={() => setHoveredItem(null)}
                    >
                        <Mail color="#0070bb" />
                        <div>
                            <strong>Email</strong>
                            <p>infos@samba-assurances.com</p>
                        </div>
                    </a>
                </div>

                <div style={styles.formCol}>
                    <form style={styles.form}>
                        <input style={styles.input} type="text" placeholder="Votre Nom" />
                        <input style={styles.input} type="email" placeholder="Votre Email" />
                        <textarea style={styles.textarea} placeholder="Votre message..."></textarea>
                        <button type="button" style={styles.btn}>
                            ENVOYER <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '40px 10% 80px 10%', background: 'white' },
    logoContainer: { marginBottom: '30px', display: 'flex', justifyContent: 'flex-start' },
    logoSmall: { height: '50px', width: 'auto', cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px' },
    infoCol: { display: 'flex', flexDirection: 'column', gap: '15px' },
    
    servImage: {
        width: '100%',
        height: '380px',
        objectFit: 'cover',
        transition: 'transform 0.5s ease',
        cursor: 'default'
    },

    infoItem: { 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'start', 
        padding: '15px', 
        borderRadius: '12px', 
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },

    formCol: { background: '#f1f5f9', padding: '40px', borderRadius: '20px', alignSelf: 'start' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' },
    textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', minHeight: '150px' },
    btn: { background: '#39b54a', color: 'white', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }
};

export default Contact;