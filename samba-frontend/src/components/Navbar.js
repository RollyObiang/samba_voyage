import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg';

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [hoverNavLink, setHoverNavLink] = useState(null);
    const [hoverBtnLogin, setHoverBtnLogin] = useState(false);

    const rafraichirAccueil = () => { window.location.href = "/"; };

    return (
        <>
            {/* Injection CSS locale pour la réactivité de la Navbar */}
            <style>{`
                .nav-links-desktop { display: flex; gap: 15px; align-items: center; }
                .burger-menu-btn { display: none; background: none; border: none; cursor: pointer; color: #1e293b; transition: transform 0.2s; }
                .burger-menu-btn:active { transform: scale(0.9); }
                
                @media (max-width: 768px) {
                    .nav-links-desktop { display: none !important; }
                    .burger-menu-btn { display: block !important; }
                }
            `}</style>

            <nav style={styles.navbar}>
                {/* LOGO */}
                <div style={styles.logoContainer}>
                    <img src={logoSamba} alt="Samba Voyage" style={styles.logo} onClick={rafraichirAccueil} />
                </div>

                {/* LIENS ORDINATEUR */}
                <div className="nav-links-desktop">
                    {['a-propos', 'faq', 'contact'].map((item) => (
                        <button 
                            key={item} 
                            onClick={() => navigate(`/${item}`)} 
                            onMouseEnter={() => setHoverNavLink(item)} 
                            onMouseLeave={() => setHoverNavLink(null)} 
                            style={{ 
                                ...styles.textBtn, 
                                color: hoverNavLink === item ? '#39b54a' : '#475569', 
                                transform: hoverNavLink === item ? 'translateY(-2px)' : 'translateY(0)', 
                                transition: 'all 0.3s ease' 
                            }}
                        >
                            {item === 'a-propos' ? 'À Propos' : item.toUpperCase()}
                        </button>
                    ))}
                    <button onClick={() => navigate('/suivi-client')} style={styles.btnNavAdmin}>
                        <Search size={16} /> SUIVI
                    </button>
                </div>

                {/* BOUTON COMPTE & BURGER MOBILE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button 
                        onClick={() => navigate('/espace-client')} 
                        onMouseEnter={() => setHoverBtnLogin(true)} 
                        onMouseLeave={() => setHoverBtnLogin(false)} 
                        style={{ 
                            ...styles.btnNavLogin, 
                            backgroundColor: hoverBtnLogin ? '#005a96' : '#0070bb', 
                            transform: hoverBtnLogin ? 'scale(1.05)' : 'scale(1)', 
                            transition: 'all 0.3s ease' 
                        }}
                    >
                        ESPACE CLIENT
                    </button>
                    
                    {/* BOUTON BURGER */}
                    <button className="burger-menu-btn" onClick={() => setMenuOuvert(!menuOuvert)}>
                        {menuOuvert ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>

                {/* MENU MOBILE DÉROULANT */}
                {menuOuvert && (
                    <div style={styles.mobileMenu}>
                        {['a-propos', 'faq', 'contact'].map((item) => (
                            <button 
                                key={item} 
                                onClick={() => { navigate(`/${item}`); setMenuOuvert(false); }} 
                                style={styles.mobileMenuLink}
                            >
                                {item === 'a-propos' ? 'À Propos' : item.toUpperCase()}
                            </button>
                        ))}
                        <button 
                            onClick={() => { navigate('/suivi-client'); setMenuOuvert(false); }} 
                            style={{...styles.btnNavAdmin, width: '100%', justifyContent: 'center', padding: '12px', marginTop: '5px'}}
                        >
                            <Search size={16} /> SUIVI CLIENT
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
};

const styles = {
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    logo: { height: '45px', width: 'auto', cursor: 'pointer', objectFit: 'contain' },
    logoContainer: { display: 'flex', alignItems: 'center' },
    textBtn: { background: 'none', border: 'none', color: '#475569', fontWeight: '500', fontSize: '14px', cursor: 'pointer', outline: 'none' },
    btnNavLogin: { background: '#0070bb', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' },
    btnNavAdmin: { background: '#f1f5f9', color: '#1e293b', border: 'none', padding: '10px 18px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' },
    mobileMenu: { position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', padding: '20px 5%', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', borderTop: '1px solid #f1f5f9', zIndex: 999 },
    mobileMenuLink: { background: 'none', border: 'none', color: '#1e293b', fontWeight: '600', fontSize: '16px', textAlign: 'left', padding: '12px 0', cursor: 'pointer', borderBottom: '1px solid #f8fafc' },
};

export default Navbar;