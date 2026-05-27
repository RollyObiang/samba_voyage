import React, { useState } from 'react';
import { 
    ChevronDown, CreditCard, User, ShieldCheck, 
    FileText, HelpCircle, FileSearch, Trash2, ArrowLeft, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Import de ton composant Navbar global

// Importation de tes images
import logoSamba from '../assets/Logo Samba.jpeg'; 
import faqImage from '../assets/img3.jpg'; 

const FAQ = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    const categories = [
        { 
            id: "Espace Client", title: "Espace Client", icon: <User size={28} />,
            content: {
                intro: "Gérez votre contrat et vos services en ligne en toute autonomie.",
                questions: [
                    { id: "ec1", title: "Qu’est-ce que l’Espace Assuré ?", text: "L’Espace Assuré vous permet de gérer toutes les démarches administratives : consulter vos documents, suivre vos remboursements, télécharger votre attestation et modifier vos infos bancaires." },
                    { id: "ec2", title: "Comment activer mon compte ?", text: "Après souscription, un e-mail vous est envoyé. Cliquez sur le lien pour créer votre mot de passe. Vos identifiants sont identiques pour l'Espace Assuré et l'appli Easy Claim." }
                ]
            }
        },
        { 
            id: "Souscription", title: "Souscription & Renouvellement", icon: <ShieldCheck size={28} />,
            content: {
                intro: "Nos conseils pour adhérer ou prolonger votre protection.",
                questions: [
                    { id: "sr1", title: "Documents nécessaires", text: "Munissez-vous de votre RIB (pour les remboursements), de votre carte bancaire et de vos antécédents médicaux si nécessaire." },
                    { id: "sr2", title: "Facture acquittée", text: "Téléchargeable dans la rubrique 'Cotisations' de votre Espace Assuré après chaque paiement." }
                ]
            }
        },
        { 
            id: "Garanties", title: "Garanties", icon: <HelpCircle size={28} />,
            content: {
                intro: "Comprendre l'étendue de votre protection internationale.",
                questions: [
                    { id: "ga1", title: "L’assistance rapatriement", text: "En cas d’accident grave, nous organisons votre transport vers l’hôpital le plus proche ou votre rapatriement sanitaire, 24h/24." },
                    { id: "ga2", title: "La responsabilité civile vie privée", text: "Elle prend en charge les dommages corporels ou matériels que vous pourriez causer involontairement à autrui à l'étranger." },
                    { id: "ga3", title: "L’assurance bagages", text: "Couverture jusqu'à 1 600 € en cas de vol, perte ou destruction durant le trajet ou le séjour." },
                    { id: "ga4", title: "La prévoyance", text: "Versement d'un capital en cas de décès accidentel ou d'indemnités journalières en cas d'arrêt de travail." }
                ]
            }
        },
        { 
            id: "Documents", title: "Documents & Attestations", icon: <FileText size={28} />,
            content: {
                intro: "Accédez à vos documents officiels en un clic.",
                questions: [
                    { id: "doc1", title: "Télécharger mes documents", text: "Dans l'onglet 'Contrat' > 'Documents', retrouvez votre carte assuré, certificat d'assurance et conditions générales." },
                    { id: "doc2", title: "La Carte Assuré (Wallet)", text: "Disponible sur l'appli Easy Claim ou l'Espace Assuré pour l'avoir toujours sur votre smartphone." },
                    { id: "doc3", title: "Attestation spécifique", text: "Pour un visa Chine ou une université, contactez notre service client pour un document personnalisé." }
                ]
            }
        },
        { 
            id: "Paiement", title: "Paiements", icon: <CreditCard size={28} />,
            content: {
                intro: "Réglez vos cotisations en toute sécurité.",
                questions: [
                    { id: "pay1", title: "Payer ma cotisation en ligne", text: "Rendez-vous dans 'Cotisations' sur votre Espace Assuré. Sélectionnez la période 'En attente' et payez par carte." },
                    { id: "pay2", title: "Modes de paiement", text: "Nous acceptons Visa, Mastercard, American Express et PayPal." }
                ]
            }
        },
        { 
            id: "Remboursement", title: "Remboursements", icon: <FileSearch size={28} />,
            content: {
                intro: "Comment vous faire rembourser vos frais de santé.",
                questions: [
                    { id: "rem1", title: "Demande au 1er euro", text: "Utilisez l'appli Easy Claim : prenez en photo vos factures et envoyez. C'est simple et rapide pour tous les montants." },
                    { id: "rem2", title: "Complément CFE", text: "Envoyez d'abord à la CFE via leur portail. La transmission vers nos services est automatique pour le remboursement complémentaire." },
                    { id: "rem3", title: "Suivre mes remboursements", text: "Consultez l'historique en temps réel dans la rubrique 'Demandes' de votre application." }
                ]
            }
        },
        { 
            id: "Résiliation", title: "Résiliation", icon: <Trash2 size={28} />,
            content: {
                intro: "Les modalités pour mettre fin à votre contrat.",
                questions: [
                    { id: "res1", title: "Contrat temporaire", text: "Possible en cas de retour définitif dans votre pays (justificatif requis : billet d'avion, bail, contrat d'embauche)." },
                    { id: "res2", title: "Contrat annuel", text: "Prenez rendez-vous en ligne avec nos conseillers pour faire le point sur votre situation et valider la clôture." }
                ]
            }
        },
        { 
            id: "Assistance", title: "Couverture à l'étranger", icon: <Globe size={28} />,
            content: {
                intro: "Tout savoir sur les systèmes de santé internationaux.",
                questions: [
                    { id: "int1", title: "Qu’est-ce qu’une couverture au 1er euro ?", text: "C'est un contrat qui rembourse dès la première dépense, sans avoir besoin de la Sécurité Sociale française." },
                    { id: "int2", title: "Obligations Visa Schengen", text: "L'assurance doit couvrir au minimum 30 000 € de frais médicaux et inclure le rapatriement." },
                    { id: "int3", title: "Limites de la Carte Bancaire", text: "Souvent limitée à 90 jours avec des plafonds bas (11 000 €), insuffisants pour des pays comme les USA." }
                ]
            }
        }
    ];

    const popularQuestions = [
        { q: "Mon attestation est-elle valable pour le visa ?", a: "Oui, nos contrats respectent les normes CIMA et Schengen (30 000€ min)." },
        { q: "Qui appeler en cas d'urgence ?", a: "Contactez l'assistance AFA au numéro sur votre carte assuré (24h/24)." },
        { q: "Puis-je souscrire depuis l'étranger ?", a: "Non, la loi impose de souscrire avant votre départ du Gabon." }
    ];

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        // Ajustement du scroll fluide selon la taille de l'écran
        const offset = window.innerWidth < 768 ? 550 : 380;
        window.scrollTo({ top: offset, behavior: 'smooth' });
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* 1. NAVBAR COMMUNE */}
            <Navbar />

            <div style={styles.container} className="responsive-container">
                {/* PETIT LOGO / FIL D'ARIANE */}
                <div style={styles.topBar}>
                    <img src={logoSamba} alt="Logo" style={styles.logo} onClick={() => navigate('/')} />
                </div>

                {/* HERO BANNER DE LA FAQ */}
                {!selectedCategory && (
                    <div style={styles.heroSection} className="responsive-hero">
                        <div style={styles.imageWrapper}>
                            <img src={faqImage} alt="FAQ" style={styles.heroImage} />
                        </div>
                        <div style={styles.textWrapper} className="responsive-text-center">
                            <h1 style={styles.title} className="responsive-main-title">Foire aux questions</h1>
                            <p style={styles.subtitle}>Besoin d'informations ? Cliquez sur une catégorie ci-dessous pour voir les détails.</p>
                        </div>
                    </div>
                )}

                {/* GRILLE DES CATÉGORIES (BOUTONS) */}
                <div style={styles.gridContainer} className="responsive-grid">
                    {categories.map((cat) => {
                        const isSelected = selectedCategory?.id === cat.id;
                        return (
                            <div 
                                key={cat.id} 
                                onClick={() => handleCategoryClick(cat)}
                                onMouseEnter={() => setHoveredId(cat.id)} 
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    ...styles.categoryCard, 
                                    borderColor: isSelected ? '#39b54a' : '#e2e8f0', 
                                    background: isSelected ? '#f0fdf4' : 'white', 
                                    transform: hoveredId === cat.id ? 'translateY(-4px)' : 'none',
                                    boxShadow: hoveredId === cat.id || isSelected ? '0 10px 20px rgba(0,0,0,0.04)' : 'none'
                                }}
                            >
                                <div style={{ color: isSelected || hoveredId === cat.id ? '#39b54a' : '#64748b', transition: 'color 0.2s' }}>
                                    {cat.icon}
                                </div>
                                <span style={{ ...styles.categoryTitle, color: isSelected ? '#39b54a' : '#334155' }}>
                                    {cat.title}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* ZONE D'AFFICHAGE DÉTAILLÉE */}
                {selectedCategory && (
                    <div style={styles.detailsContainer} className="responsive-details-padding">
                        <button onClick={() => setSelectedCategory(null)} style={styles.backBtn}>
                            <ArrowLeft size={16} /> Retour aux catégories
                        </button>
                        
                        <div style={styles.detailsFlex} className="responsive-details-flex">
                            {/* SOMMAIRE LATÉRAL (Masqué ou réorganisé sur mobile) */}
                            <div style={styles.sidebar} className="responsive-sidebar">
                                <h3 style={styles.sidebarTitle}>Sommaire</h3>
                                {selectedCategory.content.questions.map((q) => (
                                    <a key={q.id} href={`#${q.id}`} style={styles.sidebarLink}>{q.title}</a>
                                ))}
                            </div>
                            
                            {/* CONTENU PRINCIPAL DES RÉPONSES */}
                            <div style={styles.mainDetailContent}>
                                <h2 style={styles.detailMainTitle}>{selectedCategory.title}</h2>
                                <p style={styles.introText}>{selectedCategory.content.intro}</p>
                                
                                {selectedCategory.content.questions.map((q, i) => (
                                    <section id={q.id} key={q.id} style={styles.questionSection}>
                                        <h3 style={styles.questionTitle}>{i + 1}. {q.title}</h3>
                                        <p style={styles.questionText}>{q.text}</p>
                                        <a href="#" style={styles.loginLink}>Accéder à mon Espace Assuré →</a>
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ACCORDÉONS DES QUESTIONS POPULAIRES */}
                <div style={styles.popularSection}>
                    <h2 style={styles.sectionTitle} className="responsive-section-title">Questions les plus fréquentes</h2>
                    <div style={styles.faqWrapper}>
                        {popularQuestions.map((item, index) => (
                            <details key={index} style={styles.item} className="faq-details">
                                <summary style={styles.summary}>
                                    {item.q} <ChevronDown size={18} className="chevron-icon" />
                                </summary>
                                <div style={styles.answer}>{item.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DESIGN SYSTEM DES STYLES EN LIGNE ---
const styles = {
    container: { margin: '0 auto', fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', boxSizing: 'border-box' },
    topBar: { marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' },
    logo: { height: '45px', cursor: 'pointer', borderRadius: '8px' },
    heroSection: { display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '40px' },
    imageWrapper: { flex: 1, minWidth: '280px' },
    heroImage: { width: '100%', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
    textWrapper: { flex: 1 },
    title: { fontWeights: '800', color: '#0f172a', margin: 0 },
    subtitle: { fontSize: '16px', color: '#64748b', marginTop: '10px', lineHeight: '1.5' },
    
    gridContainer: { display: 'grid', gap: '15px', marginBottom: '50px' },
    categoryCard: { padding: '20px 15px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
    categoryTitle: { fontSize: '13px', fontWeight: '700', marginTop: '12px', lineHeight: '1.3' },
    
    detailsContainer: { background: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', marginBottom: '50px', boxSizing: 'border-box' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: 'none', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', color: '#475569', marginBottom: '30px', fontSize: '14px' },
    detailsFlex: { display: 'flex', gap: '40px' },
    sidebar: { flex: '0 0 240px' },
    sidebarTitle: { borderBottom: '2px solid #39b54a', paddingBottom: '8px', marginBottom: '15px', fontSize: '16px', fontWeight: '800', color: '#0f172a' },
    sidebarLink: { display: 'block', color: '#39b54a', textDecoration: 'none', marginBottom: '12px', fontSize: '14px', fontWeight: '600', lineHeight: '1.4' },
    mainDetailContent: { flex: 1 },
    detailMainTitle: { fontSize: '26px', color: '#0f172a', fontWeight: '800', margin: '0 0 10px 0' },
    introText: { color: '#64748b', fontStyle: 'italic', marginBottom: '30px', fontSize: '15px' },
    questionSection: { marginBottom: '35px', borderBottom: '1px solid #f1f5f9', paddingBottom: '25px' },
    questionTitle: { color: '#0f172a', fontSize: '18px', fontWeight: '700', margin: '0 0 12px 0' },
    questionText: { color: '#475569', lineHeight: '1.6', fontSize: '15px', margin: '0 0 12px 0' },
    loginLink: { color: '#39b54a', fontWeight: '700', fontSize: '13px', textDecoration: 'none' },
    
    popularSection: { borderTop: '2px solid #e2e8f0', paddingTop: '50px', marginBottom: '50px' },
    sectionTitle: { color: '#0f172a', fontWeight: '800', textAlign: 'center', marginBottom: '30px' },
    faqWrapper: { maxWidth: '800px', margin: '0 auto' },
    item: { background: 'white', padding: '18px', borderRadius: '14px', marginBottom: '12px', border: '1px solid #e2e8f0', transition: 'all 0.3s' },
    summary: { fontWeight: '700', color: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', listStyle: 'none' },
    answer: { marginTop: '12px', color: '#475569', borderTop: '1px solid #f1f5f9', paddingTop: '12px', lineHeight: '1.6', fontSize: '15px' }
};

// --- CODE STYLE INJECTÉ POUR LA FLEXIBILITÉ DES ÉCRANS (CSS) ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
/* Masquage des puces d'accordéon natifs */
.faq-details summary::-webkit-details-marker { display: none; }
.faq-details[open] .chevron-icon { transform: rotate(180deg); color: #39b54a; }
.chevron-icon { transition: transform 0.2s ease; color: #64748b; }

/* Écrans PC / Large Desktop */
@media (min-width: 992px) {
    .responsive-container { padding: 40px 10% 80px 10%; maxWidth: 1400px; }
    .responsive-grid { grid-template-columns: repeat(4, 1fr); }
    .responsive-main-title { font-size: 42px; }
    .responsive-section-title { font-size: 32px; }
    .responsive-details-padding { padding: 45px; }
}

/* Tablettes / Moyen écran */
@media (min-width: 768px) and (max-width: 991px) {
    .responsive-container { padding: 30px 5% 60px 5%; }
    .responsive-grid { grid-template-columns: repeat(3, 1fr); }
    .responsive-main-title { font-size: 34px; }
    .responsive-section-title { font-size: 28px; }
    .responsive-details-padding { padding: 30px; }
}

/* Smartphones / Petits formats */
@media (max-width: 767px) {
    .responsive-container { padding: 20px 20px 50px 20px; }
    .responsive-hero { flex-direction: column; gap: 20px; text-align: center; }
    .responsive-text-center { display: flex; flexDirection: column; align-items: center; }
    .responsive-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .responsive-main-title { font-size: 28px; }
    .responsive-section-title { font-size: 22px; }
    .responsive-details-padding { padding: 20px; }
    .responsive-details-flex { flex-direction: column; gap: 25px; }
    .responsive-sidebar { flex: 1; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
}
`;
document.head.appendChild(styleSheet);

export default FAQ;