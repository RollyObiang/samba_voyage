import React, { useState } from 'react';
import { 
    ChevronDown, CreditCard, User, ShieldCheck, 
    FileText, HelpCircle, LifeBuoy, FileSearch, Trash2, ArrowLeft, Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoSamba from '../assets/Logo Samba.jpeg'; 
import faqImage from '../assets/img3.jpg'; 

const FAQ = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    const categories = [
        { 
            id: "Espace Client", title: "Espace Client", icon: <User size={30} />,
            content: {
                intro: "Gérez votre contrat et vos services en ligne en toute autonomie.",
                questions: [
                    { id: "ec1", title: "Qu’est-ce que l’Espace Assuré ?", text: "L’Espace Assuré vous permet de gérer toutes les démarches administratives : consulter vos documents, suivre vos remboursements, télécharger votre attestation et modifier vos infos bancaires." },
                    { id: "ec2", title: "Comment activer mon compte ?", text: "Après souscription, un e-mail vous est envoyé. Cliquez sur le lien pour créer votre mot de passe. Vos identifiants sont identiques pour l'Espace Assuré et l'appli Easy Claim." }
                ]
            }
        },
        { 
            id: "Souscription", title: "Souscription & Renouvellement", icon: <ShieldCheck size={30} />,
            content: {
                intro: "Nos conseils pour adhérer ou prolonger votre protection.",
                questions: [
                    { id: "sr1", title: "Documents nécessaires", text: "Munissez-vous de votre RIB (pour les remboursements), de votre carte bancaire et de vos antécédents médicaux si nécessaire." },
                    { id: "sr2", title: "Facture acquittée", text: "Téléchargeable dans la rubrique 'Cotisations' de votre Espace Assuré après chaque paiement." }
                ]
            }
        },
        { 
            id: "Garanties", title: "Garanties", icon: <HelpCircle size={30} />,
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
            id: "Documents", title: "Documents & Attestations", icon: <FileText size={30} />,
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
            id: "Paiement", title: "Paiements", icon: <CreditCard size={30} />,
            content: {
                intro: "Réglez vos cotisations en toute sécurité.",
                questions: [
                    { id: "pay1", title: "Payer ma cotisation en ligne", text: "Rendez-vous dans 'Cotisations' sur votre Espace Assuré. Sélectionnez la période 'En attente' et payez par carte." },
                    { id: "pay2", title: "Modes de paiement", text: "Nous acceptons Visa, Mastercard, American Express et PayPal." }
                ]
            }
        },
        { 
            id: "Remboursement", title: "Remboursements", icon: <FileSearch size={30} />,
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
            id: "Résiliation", title: "Résiliation", icon: <Trash2 size={30} />,
            content: {
                intro: "Les modalités pour mettre fin à votre contrat.",
                questions: [
                    { id: "res1", title: "Contrat temporaire", text: "Possible en cas de retour définitif dans votre pays (justificatif requis : billet d'avion, bail, contrat d'embauche)." },
                    { id: "res2", title: "Contrat annuel", text: "Prenez rendez-vous en ligne avec nos conseillers pour faire le point sur votre situation et valider la clôture." }
                ]
            }
        },
        { 
            id: "Assistance", title: "Couverture à l'étranger", icon: <Globe size={30} />,
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

    return (
        <div style={styles.container}>
            <div style={styles.topBar}>
                <img src={logoSamba} alt="Logo" style={styles.logo} onClick={() => navigate('/')} />
            </div>

            <div style={styles.content}>
                {!selectedCategory && (
                    <div style={styles.heroSection}>
                        <div style={styles.imageWrapper}><img src={faqImage} alt="FAQ" style={styles.heroImage} /></div>
                        <div style={styles.textWrapper}>
                            <h1 style={styles.title}>Foire aux questions</h1>
                            <p style={styles.subtitle}>Besoin d'infos ? Cliquez sur une catégorie pour voir les détails.</p>
                        </div>
                    </div>
                )}

                {/* GRILLE DE NAVIGATION */}
                <div style={styles.gridContainer}>
                    {categories.map((cat) => (
                        <div key={cat.id} onClick={() => { setSelectedCategory(cat); window.scrollTo({top: 400, behavior: 'smooth'}); }}
                            onMouseEnter={() => setHoveredId(cat.id)} onMouseLeave={() => setHoveredId(null)}
                            style={{...styles.categoryCard, borderColor: selectedCategory?.id === cat.id ? '#39b54a' : '#e2e8f0', background: selectedCategory?.id === cat.id ? '#f0fff4' : 'white', transform: hoveredId === cat.id ? 'translateY(-5px)' : 'none'}}>
                            <div style={{color: selectedCategory?.id === cat.id || hoveredId === cat.id ? '#39b54a' : '#64748b'}}>{cat.icon}</div>
                            <span style={{...styles.categoryTitle, color: selectedCategory?.id === cat.id ? '#39b54a' : '#334155'}}>{cat.title}</span>
                        </div>
                    ))}
                </div>

                {/* VUE DÉTAILLÉE (TYPE APRIL) */}
                {selectedCategory && (
                    <div style={styles.detailsContainer}>
                        <button onClick={() => setSelectedCategory(null)} style={styles.backBtn}><ArrowLeft size={18} /> Retour</button>
                        <div style={styles.detailsFlex}>
                            <div style={styles.sidebar}>
                                <h3 style={styles.sidebarTitle}>Sommaire</h3>
                                {selectedCategory.content.questions.map((q) => (
                                    <a key={q.id} href={`#${q.id}`} style={styles.sidebarLink}>{q.title}</a>
                                ))}
                            </div>
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

                {/* QUESTIONS PERSISTANTES EN BAS */}
                <div style={styles.popularSection}>
                    <h2 style={styles.sectionTitle}>Questions les plus fréquentes</h2>
                    <div style={styles.faqWrapper}>
                        {popularQuestions.map((item, index) => (
                            <details key={index} style={styles.item}>
                                <summary style={styles.summary}>{item.q} <ChevronDown size={18} /></summary>
                                <div style={styles.answer}>{item.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { padding: '20px 5%', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
    topBar: { marginBottom: '20px' },
    logo: { height: '50px', cursor: 'pointer', borderRadius: '8px' },
    content: { maxWidth: '1100px', margin: '0 auto' },
    heroSection: { display: 'flex', alignItems: 'center', gap: '40px', marginBottom: '40px' },
    imageWrapper: { flex: 1 },
    heroImage: { width: '100%', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },
    textWrapper: { flex: 1 },
    title: { fontSize: '38px', color: '#1e293b', margin: 0 },
    subtitle: { fontSize: '18px', color: '#64748b' },
    gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '50px' },
    categoryCard: { padding: '25px 10px', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: '0.3s', border: '1px solid #e2e8f0' },
    categoryTitle: { fontSize: '13px', fontWeight: 'bold', marginTop: '10px' },
    detailsContainer: { background: 'white', padding: '40px', borderRadius: '25px', border: '1px solid #e2e8f0', marginBottom: '50px' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '30px' },
    detailsFlex: { display: 'flex', gap: '50px', flexWrap: 'wrap' },
    sidebar: { flex: '0 0 220px' },
    sidebarTitle: { borderBottom: '2px solid #39b54a', paddingBottom: '10px', marginBottom: '15px' },
    sidebarLink: { display: 'block', color: '#39b54a', textDecoration: 'none', marginBottom: '12px', fontSize: '14px', fontWeight: '500' },
    mainDetailContent: { flex: 1 },
    detailMainTitle: { fontSize: '28px', color: '#1e293b' },
    introText: { color: '#64748b', fontStyle: 'italic', marginBottom: '30px' },
    questionSection: { marginBottom: '40px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' },
    questionTitle: { color: '#1e293b', fontSize: '20px' },
    questionText: { color: '#475569', lineHeight: '1.6' },
    loginLink: { color: '#39b54a', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none' },
    popularSection: { borderTop: '2px solid #e2e8f0', paddingTop: '40px' },
    sectionTitle: { textAlign: 'center', marginBottom: '30px' },
    faqWrapper: { maxWidth: '800px', margin: '0 auto' },
    item: { background: 'white', padding: '15px', borderRadius: '12px', marginBottom: '10px', border: '1px solid #e2e8f0' },
    summary: { fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', cursor: 'pointer' },
    answer: { marginTop: '10px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }
};

export default FAQ;