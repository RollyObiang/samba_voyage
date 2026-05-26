import React from 'react';
import { Facebook, Instagram, Linkedin, Phone, Mail, MapPin, Globe } from 'lucide-react';
// Importation du logo noir
import logoFooter from '../assets/samb-assurances.png'; 

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.footerGrid}>
                {/* BLOC LOGO ET DESCRIPTION */}
                <div style={styles.brandCol}>
                    <a href="https://samba-assurances.com/" target="_blank" rel="noopener noreferrer">
                        <img src={logoFooter} alt="Samba Assurances" style={styles.footerLogo} />
                    </a>
                    <p style={styles.description}>
                        Samba Voyage, leader de l'assurance voyage au Gabon. 
                        Une protection optimale pour vos déplacements en Afrique et en Europe, en partenariat avec Africa First Assist.
                    </p>
                    <div style={styles.socials}>
                        <a href="https://www.facebook.com/samba.assurances/" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
                            <Facebook size={20} />
                        </a>
                        <a href="https://www.instagram.com/sambaassurances/" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
                            <Instagram size={20} />
                        </a>
                        <a href="https://www.linkedin.com/company/sambaassurances/?originalSubdomain=ga" target="_blank" rel="noopener noreferrer" style={styles.iconLink}>
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>

                {/* BLOC CONTACTS RAPIDES */}
                <div style={styles.contactCol}>
                    <h3 style={styles.title}>Contactez-nous</h3>
                    
                    {/* SITE WEB OFFICIEL */}
                    <div style={styles.infoLine}>
                        <Globe size={16} color="#39b54a" /> 
                        <a href="https://samba-assurances.com/" target="_blank" rel="noopener noreferrer" style={styles.clickableLink}>
                            www.samba-assurances.com
                        </a>
                    </div>

                    <div style={styles.infoLine}>
                        <MapPin size={16} color="#39b54a" /> 
                        <a href="https://www.google.com/maps/search/Samba+Assurances+Libreville" target="_blank" rel="noopener noreferrer" style={styles.clickableLink}>
                          Avenue de COINTET | Centre - Ville | Libreville | Gabon  
                        </a>
                    </div>
                    
                    <div style={styles.infoLine}>
                        <Phone size={16} color="#39b54a" /> 
                        <a href="tel:+241060086262" style={styles.clickableLink}>
                            +241 060 08 62 62
                        </a>
                    </div>

                    <div style={styles.infoLine}>
                        <Mail size={16} color="#39b54a" /> 
                        <a href="mailto: infos@samba-assurances.com" style={styles.clickableLink}>
                            infos@samba-assurances.com
                        </a>
                    </div>
                </div>
            </div>

            <div style={styles.copyright}>
                © {new Date().getFullYear()} Samba Assurances - Tous droits réservés.
            </div>
        </footer>
    );
};

const styles = {
    footer: { 
        background: '#000000', 
        color: 'white', 
        padding: '60px 10% 20px', 
        marginTop: 'auto' 
    },
    footerGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '50px' 
    },
    footerLogo: { 
        height: '70px', 
        marginBottom: '20px', 
        objectFit: 'contain',
        cursor: 'pointer'
    },
    description: { 
        color: '#ffffff', 
        lineHeight: '1.6', 
        fontSize: '14px',
        maxWidth: '300px'
    },
    socials: { 
        display: 'flex', 
        gap: '15px', 
        marginTop: '20px' 
    },
    iconLink: { 
        cursor: 'pointer', 
        color: '#ffffff',
        textDecoration: 'none',
        transition: 'color 0.3s'
    },
    clickableLink: {
        color: '#cbd5e1',
        textDecoration: 'none',
        transition: 'color 0.3s',
        cursor: 'pointer'
    },
    title: { 
        borderBottom: '2px solid #39b54a', 
        width: 'fit-content', 
        paddingBottom: '5px', 
        marginBottom: '20px',
        fontSize: '18px'
    },
    infoLine: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '12px', 
        color: '#cbd5e1', 
        fontSize: '14px' 
    },
    copyright: { 
        textAlign: 'center', 
        borderTop: '1px solid #334155', 
        marginTop: '40px', 
        paddingTop: '20px', 
        fontSize: '12px', 
        color: '#64748b' 
    }
};

export default Footer;