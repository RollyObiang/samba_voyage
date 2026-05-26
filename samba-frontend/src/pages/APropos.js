import React, { useState } from 'react';
import { ShieldCheck, Globe, Award, MapPin, PhoneCall, FileText, Quote, Download, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- TES IMAGES LOCALES ---
import img6 from '../assets/img7.jpg'; 
import logoSamba from '../assets/Logo Samba.jpeg'; 
import im10 from '../assets/im10.jpg'; // Import de ton image équipe

const APropos = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('infos');
    const [selectedNews, setSelectedNews] = useState(null);

    const newsData = [
        { 
            tag: "Groupe Samba", 
            title: "Samba Assurances : Une équipe d'experts à votre écoute.", 
            color: "#ed1c24", 
            img: im10, // Utilisation de im10.jpg ici
            details: "Nos équipes travaillent quotidiennement pour vous offrir le meilleur de l'assurance voyage au Gabon. Notre expertise locale alliée à un réseau international garantit votre sérénité."
        },
        { 
            tag: "Actualité", 
            title: "Nouveaux plafonds de couverture pour la zone Schengen en 2026.", 
            color: "#39b54a", 
            img: img6, // Utilisation de img11.jpg ici
            details: "Pour répondre aux nouvelles directives européennes, Samba Voyage augmente ses plafonds de prise en charge médicale à 50 000€ pour garantir une acceptation sans faille de vos visas Schengen."
        },
        { 
            tag: "Récompenses", 
            title: "Samba Assurances récompensé pour son excellence digitale.", 
            color: "#0070bb", 
            img: im10, // Exemple avec im8
            details: "Le prix de l'Innovation Gabonaise a été décerné à Samba Assurances pour sa plateforme de souscription en ligne."
        },
        { 
            tag: "Samba International", 
            title: "Un réseau d'assistance renforcé sur les 5 continents.", 
            color: "#39b54a", 
            img: img6, // Exemple avec img13
            details: "Grâce au réseau AFA, Samba International déploie désormais des correspondants locaux dans plus de 160 pays."
        }
    ];

    const témoignages = [
        { nom: "Marc OBAME.", texte: "Attestation obtenue en quelques minutes pour mon visa. Service très efficace !", ville: "Libreville" },
        { nom: "Sonia BOUKANDOU.", texte: "L'assistance a été parfaite lors de mon séjour à l'étranger. Je me suis sentie en sécurité.", ville: "Port-Gentil" },
        { nom: "Jean MOUSSAVOU.", texte: "Le meilleur rapport qualité-prix au Gabon pour l'assurance voyage.", ville: "Franceville" }
    ];

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', color: '#334155', lineHeight: '1.6', backgroundColor: '#fff', overflowX: 'hidden' }}>
            
            {/* MODAL POUR "EN SAVOIR PLUS" */}
            <AnimatePresence>
                {selectedNews && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={styles.modalOverlay}
                        onClick={() => setSelectedNews(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 50 }}
                            style={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedNews(null)} style={styles.closeBtn}><X /></button>
                            <img src={selectedNews.img} alt={selectedNews.title} style={styles.modalImg} />
                            <div style={styles.modalBody}>
                                <span style={{ ...styles.newsTag, color: selectedNews.color }}>{selectedNews.tag}</span>
                                <h2 style={styles.modalTitle}>{selectedNews.title}</h2>
                                <p style={styles.modalText}>{selectedNews.details}</p>
                                <button style={{...styles.headerBadge, border:'none', cursor:'pointer'}} onClick={() => setSelectedNews(null)}>Fermer</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. BARRE DE NAVIGATION */}
            <nav style={styles.navbar}>
                <img 
                    src={logoSamba} 
                    alt="Logo Samba Voyage" 
                    style={styles.logoSmall} 
                    onClick={() => navigate('/')}
                />
            </nav>

            {/* 2. EN-TÊTE AVEC VOTRE IMAGE TÉLÉCHARGÉE */}
            <section style={{...styles.header, backgroundImage: `url(${img6})`}}>
                <div style={styles.overlay}></div>
                <div style={styles.headerNav}>
                    {['infos', 'temoignages', 'brochure'].map((tab) => (
                        <motion.button 
                            key={tab}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab)} 
                            style={activeTab === tab ? styles.headerTabActive : styles.headerTab}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </motion.button>
                    ))}
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={styles.headerContent}>
                    <h1 style={styles.headerTitle}>SAMBA VOYAGE</h1>
                    <p style={styles.headerSubtitle}>La référence de l'assurance voyage au Gabon.</p>
                    <div style={styles.headerBadge}>Une initiative de SAMBA ASSURANCES</div>
                </motion.div>
            </section>

            {/* TEXTE DÉFILANT */}
            <div style={styles.marqueeContainer}>
                <div style={styles.marqueeText}>
                    ✈️ ASSISTANCE MONDIALE 24H/24 • CONFORMITÉ VISA CIMA/EUROPE • RÉSEAU AFA • PLUS DE 10 ANS D'EXPERTISE AU GABON • N'OUBLIEZ PAS DE VOUS ASSURER AFIN D'ÊTRE PROTÉGÉ!
                </div>
            </div>

            {/* 3. CONTENU DYNAMIQUE */}
            <section style={styles.content}>
                <AnimatePresence mode="wait">
                    {activeTab === 'infos' && (
                        <motion.div key="infos" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
                            <div style={styles.row}>
                                <div style={styles.textCol}>
                                    <div style={styles.sectionTag}>Notre Vocation</div>
                                    <h2 style={styles.sectionTitle}>Simplifier votre Protection à l'International</h2>
                                    <p style={styles.p}>SAMBA VOYAGE est née de la volonté de <strong>SAMBA ASSURANCES</strong>, leader du courtage au Gabon, de répondre spécifiquement aux besoins des voyageurs.</p>
                                    <p style={styles.p}>Grâce à notre partenariat exclusif avec <strong>Africa First Assist (AFA)</strong>, nous vous garantissons une prise en charge médicale immédiate, sans avance de frais lourds.</p>
                                </div>
                                <div style={styles.imgCol}>
                                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }} style={styles.iconCircle}>🌍</motion.div>
                                    <motion.a whileHover={{ backgroundColor: '#e2e8f0', x: 5 }} href="https://africafirstassist.com/" target="_blank" rel="noopener noreferrer" style={styles.partnerBadge}>
                                        En partenariat avec AFA <ExternalLink size={14} />
                                    </motion.a>
                                </div>
                            </div>

                            <div style={styles.newsSection}>
                                <div style={styles.newsGrid}>
                                    {newsData.map((item, idx) => (
                                        <motion.div 
                                            key={idx} 
                                            whileHover={{ y: -8 }}
                                            style={styles.newsCard}
                                            onClick={() => setSelectedNews(item)}
                                        >
                                            <div style={styles.newsImgWrapper}>
                                                <img src={item.img} alt={item.tag} style={styles.newsImg} />
                                            </div>
                                            <div style={styles.newsContent}>
                                                <span style={{ ...styles.newsTag, color: item.color }}>{item.tag}</span>
                                                <h3 style={styles.newsCardTitle}>{item.title}</h3>
                                                <div style={{ ...styles.newsLink, color: item.color }}>
                                                    En savoir plus <ExternalLink size={14} style={{ marginLeft: '5px' }} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'temoignages' && (
                        <motion.div key="temoignages" initial="hidden" animate="visible" exit="hidden" variants={fadeIn} style={styles.testimonialGrid}>
                            {témoignages.map((t, i) => (
                                <motion.div key={i} whileHover={{ scale: 1.03, backgroundColor: '#fff' }} style={styles.testimonyCard}>
                                    <Quote size={30} color="#39b54a" style={{ opacity: 0.3 }} />
                                    <p style={styles.testimonyText}>{t.texte}</p>
                                    <strong>{t.nom}</strong>
                                    <p style={{fontSize: '12px', color: '#94a3b8'}}>{t.ville}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'brochure' && (
                        <motion.div key="brochure" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
                            <motion.div whileHover={{ borderColor: '#39b54a', backgroundColor: '#f0fdf4' }} style={styles.downloadBox}>
                                <FileText size={50} color="#0070bb" />
                                <div style={{flex: 1}}>
                                    <h3>Brochure Officielle 2026</h3>
                                    <p>Consultez nos garanties et plafonds d'assistance en format PDF.</p>
                                </div>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} style={styles.btnDownload}>
                                    <Download size={18} /> TÉLÉCHARGER
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* SECTION CONTACT AVEC GOOGLE MAPS */}
            <section style={styles.contactSection}>
                <h2 style={styles.sectionTitleCenteredWhite}>Où nous Trouver ?</h2>
                <div style={styles.contactWrapper}>
                    <div style={styles.mapContainer}>
                        <iframe 
                            title="Samba Assurances Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75678485237!2d9.4475!3d0.3897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjMnMjIuOSJOIDnCsDI2JzUxLjAiRQ!5e0!3m2!1sfr!2sga!4v1647450000000!5m2!1sfr!2sga"
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, borderRadius: '20px' }} 
                            allowFullScreen="" 
                            loading="lazy" 
                        ></iframe>
                    </div>
                    
                    <div style={styles.contactDetails}>
                        <div style={styles.contactItem}>
                            <MapPin size={32} color="#39b54a" />
                            <div>
                                <h4 style={{margin: 0, color: '#fff'}}>Notre Siège</h4>
                                <p style={{margin: '5px 0 0 0'}}>Avenue de COINTET, Libreville, Gabon</p>
                            </div>
                        </div>
                        <div style={styles.contactItem}>
                            <PhoneCall size={32} color="#39b54a" />
                            <div>
                                <h4 style={{margin: 0, color: '#fff'}}>Ligne Directe</h4>
                                <p style={{margin: '5px 0 0 0'}}>074 40 41 41</p>
                            </div>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <button 
                                onClick={() => window.open('https://maps.google.com', '_blank')}
                                style={styles.btnItinerary}
                            >
                                <ExternalLink size={16} /> Ouvrir dans Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// ... Styles identiques à ton code (Inchangés)
const styles = {
    navbar: { width: '100%', height: '70px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 5%', borderBottom: '1px solid #eee', position: 'relative', zIndex: 10 },
    logoSmall: { height: '50px', width: 'auto', cursor: 'pointer', objectFit: 'contain' },
    header: { position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', padding: '100px 10%', textAlign: 'center', minHeight: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '5px solid #39b54a' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1 },
    headerNav: { position: 'absolute', top: '20px', right: '5%', display: 'flex', gap: '15px', zIndex: 10 },
    headerTab: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', backdropFilter: 'blur(5px)' },
    headerTabActive: { background: '#39b54a', border: '1px solid #39b54a', color: 'white', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(57, 181, 74, 0.4)' },
    headerContent: { position: 'relative', zIndex: 2 },
    headerTitle: { fontSize: '48px', margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '2px' },
    headerSubtitle: { fontSize: '22px', margin: '0 0 30px 0', fontWeight: '300' },
    headerBadge: { background: '#39b54a', color: 'white', padding: '10px 25px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold' },
    marqueeContainer: { width: '100%', background: '#1e293b', color: '#fff', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' },
    marqueeText: { display: 'inline-block', paddingLeft: '100%', animation: 'marquee 25s linear infinite', fontSize: '14px', fontWeight: 'bold' },
    content: { padding: '80px 10%' },
    row: { display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '60px', flexWrap: 'wrap' },
    textCol: { flex: 2, minWidth: '300px' },
    imgCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px' },
    iconCircle: { width: '160px', height: '160px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '70px', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
    partnerBadge: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '12px 25px', borderRadius: '50px', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' },
    newsSection: { marginBottom: '80px' },
    newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
    newsCard: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f1f5f9' },
    newsImgWrapper: { height: '160px', overflow: 'hidden' },
    newsImg: { width: '100%', height: '100%', objectFit: 'cover' },
    newsContent: { padding: '20px' },
    newsTag: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', display: 'block' },
    newsCardTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', margin: '0 0 15px 0' },
    newsLink: { fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center' },
    sectionTag: { color: '#39b54a', fontWeight: '800', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' },
    sectionTitle: { fontSize: '36px', color: '#0f172a', marginBottom: '25px', fontWeight: '800' },
    sectionTitleCentered: { fontSize: '36px', textAlign: 'center', marginBottom: '50px', fontWeight: '800' },
    sectionTitleCenteredWhite: { fontSize: '36px', color: 'white', textAlign: 'center', marginBottom: '40px', fontWeight: '800' },
    p: { fontSize: '17px', color: '#475569', marginBottom: '15px' },
    testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
    testimonyCard: { padding: '35px', border: '1px solid #f1f5f9', borderRadius: '25px', background: '#fcfcfc' },
    testimonyText: { fontStyle: 'italic', marginBottom: '20px', fontSize: '16px' },
    downloadBox: { display: 'flex', alignItems: 'center', gap: '25px', padding: '40px', border: '2px dashed #39b54a', borderRadius: '25px' },
    btnDownload: { background: '#39b54a', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' },
    contactSection: { background: '#0f172a', color: '#f1f5f9', padding: '80px 10%' },
    contactWrapper: { display: 'flex', gap: '40px', flexWrap: 'wrap', alignItems: 'stretch' },
    mapContainer: { flex: 2, minWidth: '300px', height: '400px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' },
    contactDetails: { flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '30px' },
    contactItem: { display: 'flex', gap: '15px', alignItems: 'center' },
    btnItinerary: { background: 'transparent', border: '1px solid #39b54a', color: '#39b54a', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalContent: { backgroundColor: '#fff', borderRadius: '30px', width: '100%', maxWidth: '600px', overflow: 'hidden', position: 'relative' },
    modalImg: { width: '100%', height: '250px', objectFit: 'cover' },
    modalBody: { padding: '30px' },
    modalTitle: { fontSize: '24px', fontWeight: '800', marginBottom: '15px', color: '#0f172a' },
    modalText: { fontSize: '16px', color: '#475569', marginBottom: '25px', lineHeight: '1.8' },
    closeBtn: { position: 'absolute', top: '15px', right: '15px', background: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 10 }
};

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `@keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }`;
document.head.appendChild(styleSheet);

export default APropos;