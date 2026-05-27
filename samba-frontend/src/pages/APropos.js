import React, { useState } from 'react';
import { ShieldCheck, Globe, Award, MapPin, PhoneCall, FileText, Quote, Download, ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar'; // Import de ton composant Navbar

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
            img: im10, 
            details: "Nos équipes travaillent quotidiennement pour vous offrir le meilleur de l'assurance voyage au Gabon. Notre expertise locale alliée à un réseau international garantit votre sérénité."
        },
        { 
            tag: "Actualité", 
            title: "Nouveaux plafonds de couverture pour la zone Schengen en 2026.", 
            color: "#39b54a", 
            img: img6, 
            details: "Pour répondre aux nouvelles directives européennes, Samba Voyage augmente ses plafonds de prise en charge médicale à 50 000€ pour garantir une acceptation sans faille de vos visas Schengen."
        },
        { 
            tag: "Récompenses", 
            title: "Samba Assurances récompensé pour son excellence digitale.", 
            color: "#0070bb", 
            img: im10, 
            details: "Le prix de l'Innovation Gabonaise a été décerné à Samba Assurances pour sa plateforme de souscription en ligne."
        },
        { 
            tag: "Samba International", 
            title: "Un réseau d'assistance renforcé sur les 5 continents.", 
            color: "#39b54a", 
            img: img6, 
            details: "Grâce au réseau AFA, Samba International déploie désormais des correspondants locaux dans plus de 160 pays."
        }
    ];

    const témoignages = [
        { nom: "Marc OBAME.", texte: "Attestation obtenue en quelques minutes pour mon visa. Service très efficient !", ville: "Libreville" },
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

            {/* 1. BARRE DE NAVIGATION (Intègre ton vrai composant global) */}
            <Navbar />

            {/* 2. EN-TÊTE RESPONSIVE */}
            <section style={{...styles.header, backgroundImage: `url(${img6})`}} className="responsive-header">
                <div style={styles.overlay}></div>
                <div style={styles.headerNav} className="responsive-tabs">
                    {['infos', 'temoignages', 'brochure'].map((tab) => (
                        <motion.button 
                            key={tab}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab(tab)} 
                            style={activeTab === tab ? styles.headerTabActive : styles.headerTab}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </motion.button>
                    ))}
                </div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} style={styles.headerContent}>
                    <h1 style={styles.headerTitle} className="responsive-title">SAMBA VOYAGE</h1>
                    <p style={styles.headerSubtitle} className="responsive-subtitle">La référence de l'assurance voyage au Gabon.</p>
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
            <section style={styles.content} className="responsive-padding">
                <AnimatePresence mode="wait">
                    {activeTab === 'infos' && (
                        <motion.div key="infos" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
                            <div style={styles.row} className="responsive-row">
                                <div style={styles.textCol}>
                                    <div style={styles.sectionTag}>Notre Vocation</div>
                                    <h2 style={styles.sectionTitle} className="responsive-section-title">Simplifier votre Protection à l'International</h2>
                                    <p style={styles.p}>SAMBA VOYAGE est née de la volonté de <strong>SAMBA ASSURANCES</strong>, leader du courtage au Gabon, de répondre spécifiquement aux besoins des voyageurs.</p>
                                    <p style={styles.p}>Grâce à notre partenariat exclusif avec <strong>Africa First Assist (AFA)</strong>, nous vous garantissons une prise en charge médicale immédiate, sans avance de frais lourds.</p>
                                </div>
                                <div style={styles.imgCol} className="responsive-img-col">
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
                            <motion.div whileHover={{ borderColor: '#39b54a', backgroundColor: '#f0fdf4' }} style={styles.downloadBox} className="responsive-download">
                                <FileText size={50} color="#0070bb" style={{ minWidth: '50px' }} />
                                <div style={{flex: 1}}>
                                    <h3>Brochure Officielle 2026</h3>
                                    <p>Consultez nos garanties et plafonds d'assistance en format PDF.</p>
                                </div>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} style={styles.btnDownload} className="responsive-btn-download">
                                    <Download size={18} /> TÉLÉCHARGER
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* SECTION CONTACT AVEC GOOGLE MAPS */}
            <section style={styles.contactSection} className="responsive-padding">
                <h2 style={styles.sectionTitleCenteredWhite} className="responsive-section-title">Où nous Trouver ?</h2>
                <div style={styles.contactWrapper} className="responsive-row">
                    <div style={styles.mapContainer} className="responsive-map">
                        <iframe 
                            title="Samba Assurances Location"
                            src="https://maps.google.com/maps?q=Avenue%20de%20COINTET,%20Libreville,%20Gabon&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, borderRadius: '20px' }} 
                            allowFullScreen="" 
                            loading="lazy" 
                        ></iframe>
                    </div>
                    
                    <div style={styles.contactDetails}>
                        <div style={styles.contactItem}>
                            <MapPin size={32} color="#39b54a" style={{ minWidth: '32px' }} />
                            <div>
                                <h4 style={{margin: 0, color: '#fff'}}>Notre Siège</h4>
                                <p style={{margin: '5px 0 0 0'}}>Avenue de COINTET, Libreville, Gabon</p>
                            </div>
                        </div>
                        <div style={styles.contactItem}>
                            <PhoneCall size={32} color="#39b54a" style={{ minWidth: '32px' }} />
                            <div>
                                <h4 style={{margin: 0, color: '#fff'}}>Ligne Directe</h4>
                                <p style={{margin: '5px 0 0 0'}}>074 40 41 41</p>
                            </div>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <button 
                                onClick={() => window.open('https://maps.google.com/?q=Avenue+de+COINTET,+Libreville,+Gabon', '_blank')}
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

// --- STYLES EN LIGNE CORRIGÉS POUR LE FLEX ---
const styles = {
    header: { position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: '5px solid #39b54a', boxSizing: 'border-box' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1 },
    headerNav: { display: 'flex', gap: '10px', zIndex: 10 },
    headerTab: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', backdropFilter: 'blur(5px)' },
    headerTabActive: { background: '#39b54a', border: '1px solid #39b54a', color: 'white', padding: '8px 16px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(57, 181, 74, 0.4)' },
    headerContent: { position: 'relative', zIndex: 2, padding: '0 20px' },
    headerTitle: { margin: '0 0 10px 0', fontWeight: '900', letterSpacing: '2px' },
    headerSubtitle: { margin: '0 0 30px 0', fontWeight: '300' },
    headerBadge: { background: '#39b54a', color: 'white', padding: '10px 25px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' },
    marqueeContainer: { width: '100%', background: '#1e293b', color: '#fff', padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' },
    marqueeText: { display: 'inline-block', paddingLeft: '100%', animation: 'marquee 25s linear infinite', fontSize: '14px', fontWeight: 'bold' },
    content: { boxSizing: 'border-box' },
    row: { display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '40px' },
    textCol: { flex: 2, minWidth: '280px' },
    imgCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '25px', minWidth: '250px' },
    iconCircle: { width: '140px', height: '140px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' },
    partnerBadge: { display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', padding: '12px 25px', borderRadius: '50px', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center' },
    newsSection: { marginBottom: '40px' },
    newsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
    newsCard: { background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', cursor: 'pointer', border: '1px solid #f1f5f9' },
    newsImgWrapper: { height: '160px', overflow: 'hidden' },
    newsImg: { width: '100%', height: '100%', objectFit: 'cover' },
    newsContent: { padding: '20px' },
    newsTag: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '10px', display: 'block' },
    newsCardTitle: { fontSize: '16px', fontWeight: '700', color: '#0f172a', lineHeight: '1.4', margin: '0 0 15px 0' },
    newsLink: { fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center' },
    sectionTag: { color: '#39b54a', fontWeight: '800', fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' },
    sectionTitle: { color: '#0f172a', marginBottom: '25px', fontWeight: '800' },
    sectionTitleCenteredWhite: { color: 'white', textAlign: 'center', marginBottom: '40px', fontWeight: '800' },
    p: { fontSize: '16px', color: '#475569', marginBottom: '15px' },
    testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' },
    testimonyCard: { padding: '30px', border: '1px solid #f1f5f9', borderRadius: '25px', background: '#fcfcfc', boxSizing: 'border-box' },
    testimonyText: { fontStyle: 'italic', marginBottom: '20px', fontSize: '15px' },
    downloadBox: { display: 'flex', alignItems: 'center', gap: '25px', padding: '30px', border: '2px dashed #39b54a', borderRadius: '25px', boxSizing: 'border-box' },
    btnDownload: { background: '#39b54a', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' },
    contactSection: { background: '#0f172a', color: '#f1f5f9', boxSizing: 'border-box' },
    contactWrapper: { display: 'flex', gap: '40px' },
    mapContainer: { flex: 1.5, minWidth: '280px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.3)' },
    contactDetails: { flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '25px' },
    contactItem: { display: 'flex', gap: '15px', alignItems: 'center' },
    btnItinerary: { background: 'transparent', border: '1px solid #39b54a', color: '#39b54a', padding: '12px 20px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', width: 'fit-content' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '15px', boxSizing: 'border-box' },
    modalContent: { backgroundColor: '#fff', borderRadius: '25px', width: '100%', maxWidth: '550px', overflow: 'hidden', position: 'relative' },
    modalImg: { width: '100%', height: '200px', objectFit: 'cover' },
    modalBody: { padding: '20px' },
    modalTitle: { fontSize: '20px', fontWeight: '800', marginBottom: '15px', color: '#0f172a' },
    modalText: { fontSize: '15px', color: '#475569', marginBottom: '20px', lineHeight: '1.6' },
    closeBtn: { position: 'absolute', top: '15px', right: '15px', background: '#fff', border: 'none', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.2)', zIndex: 10 }
};

// --- INJECTION DES MEDIA QUERIES ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }

/* Écrans PC et Tablettes */
@media (min-width: 769px) {
    .responsive-header { padding: 120px 10%; min-height: 480px; }
    .responsive-tabs { position: absolute; top: 20px; right: 5%; }
    .responsive-title { fontSize: 48px; }
    .responsive-subtitle { fontSize: 22px; }
    .responsive-padding { padding: 80px 10%; }
    .responsive-section-title { fontSize: 36px; }
    .responsive-row { flex-wrap: nowrap; }
    .responsive-map { height: 400px; }
}

/* Écrans Mobiles (Smartphones) */
@media (max-width: 768px) {
    .responsive-header { padding: 100px 20px 60px 20px; min-height: auto; }
    .responsive-tabs { position: relative; top: 0; right: 0; margin-bottom: 30px; width: 100%; justify-content: center; flex-wrap: wrap; }
    .responsive-title { fontSize: 32px; }
    .responsive-subtitle { fontSize: 18px; }
    .responsive-padding { padding: 40px 20px; }
    .responsive-section-title { fontSize: 26px; text-align: center; }
    .responsive-row { flex-direction: column; gap: 30px; }
    .responsive-img-col { order: -1; } /* L'illustration passe au-dessus sur mobile */
    .responsive-map { height: 250px; width: 100%; }
    .responsive-download { flex-direction: column; text-align: center; gap: 15px; }
    .responsive-btn-download { width: 100%; justify-content: center; }
}
`;
document.head.appendChild(styleSheet);

export default APropos;