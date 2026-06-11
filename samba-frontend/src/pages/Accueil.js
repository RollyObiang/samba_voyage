import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Plane, PhoneCall, ChevronRight, LayoutDashboard, Search,
    ShieldCheck, X, Info, CheckCircle2, ArrowRight as LucideArrowRight, MapPin
} from 'lucide-react';

// Import de ton nouveau composant Navbar global
import Navbar from '../components/Navbar';

import imgSambaHero from '../assets/img1.jpg';

// --- IMPORTS DES IMAGES ---
import imgGabon from '../assets/gabon1.jpg';
import imgSenegal from '../assets/senegal1.jpg';
import imgCoteIvoire from '../assets/cote_ivoire1.jpg';
import imgFrance from '../assets/france1.jpg';
import imgCameroun from '../assets/cameroun1.jpg';
import imgBenin from '../assets/benin1.jpg';
import imgTogo from '../assets/togo1.jpg';
import imgBurkinaFaso from '../assets/burkina1.jpg';

const Accueil = () => {
    const navigate = useNavigate();

    const [hoveredCard, setHoveredCard] = useState(null);
    const [hoverBtnHero, setHoverBtnHero] = useState(false);

    // --- ÉTATS POUR LES DESTINATIONS & MODALE ---
    const [voirTout, setVoirTout] = useState(false);
    const [hoverDest, setHoverDest] = useState(null);
    const [paysSelectionne, setPaysSelectionne] = useState(null);

    // --- NOUVEAUX ÉTATS POUR LES AVANTAGES ---
    const [avantageSelectionne, setAvantageSelectionne] = useState(null);
    const [hoveredAvantage, setHoveredAvantage] = useState(null);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scrollText { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
            .animate-fade { animation: fadeInUp 0.8s ease-out forwards; }
            .marquee-container { overflow: hidden; white-space: nowrap; background: #1e293b; color: #39b54a; padding: 10px 0; font-weight: 600; font-size: 14px; border-bottom: 3px solid #39b54a; }
            .marquee-text { display: inline-block; animation: scrollText 25s linear infinite; }
            .dest-card-img { height: 200px; background-size: cover; background-position: center; border-bottom-left-radius: 80px; transition: all 0.5s ease; }
            .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 10px; backdrop-filter: blur(10px); }
            .modal-content { background: white; width: 100%; max-width: 1000px; max-height: 95vh; border-radius: 20px; overflow-y: auto; position: relative; animation: fadeInUp 0.4s ease-out; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            
            /* --- AJOUTS DES MEDIA QUERIES POUR LE RESPONSIVE --- */
            @media (max-width: 768px) {
                .hero-section { height: auto !important; min-height: 60vh; padding: 100px 20px 60px 20px !important; }
                .hero-title { font-size: 1.8rem !important; }
                .hero-subtitle { font-size: 1rem !important; }
                .portal-container { margin-top: -30px !important; padding: 0 20px !important; gap: 15px !important; }
                .portal-card-item { width: 100% !important; max-width: 320px; }
                .section-responsive { padding: 50px 20px !important; }
                .section-title { font-size: 1.6rem !important; }
                
                /* Modale responsive */
                .modal-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
                .modal-header-img { height: 250px !important; }
                .modal-header-overlay { padding: 20px !important; }
                .modal-header-overlay h2 { font-size: 2rem !important; }
                .modal-body-padding { padding: 20px !important; }
            }
        `;
        document.head.appendChild(styleSheet);
    }, []);

    const portails = [
        { id: 'agence', title: 'Portail Agence', desc: 'Gestion des ventes réservée aux agents.', icon: <LayoutDashboard size={32} color="#0070bb" />, path: '/dashboard-agence', border: '#0070bb' },
        { id: 'afa', title: 'Portail AFA', desc: 'Gestion des urgences et rapatriements.', icon: <PhoneCall size={32} color="#39b54a" />, path: '/portail-afa', border: '#39b54a' },
        { id: 'admin', title: 'Admin Samba', desc: 'Statistiques et pilotage national.', icon: <ShieldCheck size={32} color="#ed1c24" />, path: '/admin-samba', border: '#ed1c24' },
        { id: 'verif', title: 'Vérification', desc: 'Contrôle de validité des attestations.', icon: <Search size={32} color="#f59e0b" />, path: '/suivi-client', border: '#f59e0b' }
    ];

    const toutesDestinations = [
        {
            id: 1, pays: 'GABON', zone: 'Afrique (CIMA)', img: imgGabon,
            capital: 'Libreville',
            desc: "Joyau de l'Afrique Centrale, le Gabon est couvert à 85% par la forêt tropicale. Bien que Libreville offre des infrastructures correctes, un déplacement vers Port-Gentil ou les parcs nationaux nécessite une vigilance sanitaire accrue, Le Gabon s’affirme comme le poumon stratégique de l’Afrique Centrale, où l’exploitation responsable des ressources rencontre une ambition écologique sans précédent, Au-delà de sa capitale Libreville, le pays déploie un potentiel industriel unique via la Zone Économique Spéciale de Nkok, tout en préservant son identityé de Berceau de l'humanité grâce à ses treize parcs nationaux classés.",
            pourquoi: "SAMBA VOYAGE garantit une prise en charge immédiate dans les meilleures cliniques de Libreville et organise votre évacuation sanitaire depuis les zones isolées.",
            points: ["Évacuation sanitaire rapide", "Frais médicaux en clinique privée", "Assistance 24h/24"]
        },
        {
            id: 2, pays: 'SENEGAL', zone: 'Afrique (CIMA)', img: imgSenegal,
            capital: 'Dakar',
            desc: "Le Sénégal attire pour Dakar et ses stations balnéaires. Les frais médicaux dans le secteur privé sont élevés pour les non-résidents. Porté par le Plan Sénégal Émergent (PSE), le pays transforme son paysage économique avec des projets d'envergure comme la ville nouvelle de Diamniadio.",
            pourquoi: "Notre réseau à Dakar évite toute avance de frais hospitaliers lourds et couvre les incidents comme le vol de bagages.",
            points: ["Zéro avance de frais", "Couverture vol de bagages", "Assistance juridique"]
        },
        {
            id: 3, pays: 'COTE D\'IVOIRE', zone: 'Afrique (CIMA)', img: imgCoteIvoire,
            capital: 'Abidjan',
            desc: "Puissance économique régionale. Les risques liés au paludisme et aux accidents justifient une couverture solide. Avec le déploiement massif d'infrastructures telles que le troisième pont ou le métro d'Abidjan, le pays attire les sièges sociaux des plus grandes multinationales.",
            pourquoi: "Accès garanti sans avance de frais aux établissements de référence comme la PISAM à Abidjan.",
            points: ["Réseau cliniques VIP", "Protection Accidents", "Rapatriement express"]
        },
        {
            id: 4, pays: 'FRANCE', zone: 'Europe (France)', img: imgFrance,
            capital: 'Paris',
            desc: "L'entrée dans l'espace Schengen impose une assurance voyage stricte avec une garantie minimale de 30 000 €. Au-delà de la simple formalité administrative pour l'obtention du visa, cette couverture doit impérativement include le rapatriement sanitaire.",
            pourquoi: "Attestation 100% conforme aux exigences consulaires pour l'obtention de votre visa Schengen.",
            points: ["Visa Schengen garanti", "Couverture 30 000 €", "Assistance rapatriement"]
        },
        {
            id: 5, pays: 'CAMEROUN', zone: 'Afrique (CIMA)', img: imgCameroun,
            capital: 'Yaoundé',
            desc: "Une grande diversité géographique qui nécessite une couverture pour les villes comme Douala et Yaoundé. Entre l'effervescence commerciale de Douala, poumon économique tourné vers l'Atlantique, et le calme institutionnel de Yaoundé.",
            pourquoi: "Connexion immédiate à notre plateforme d'assistance active sur tout le territoire camerounais.",
            points: ["Urgence médicale CEMAC", "Assistance 24/7", "Avance de fonds"]
        },
        { id: 6, pays: 'BENIN', zone: 'Afrique (CIMA)', img: imgBenin, capital: 'Cotonou', desc: "Destination culturelle puissante. Porté par une dynamique de réformes structurelles, le pays se transforme rapidement en un pôle touristique et économique majeur de l'Afrique de l'ouest.", pourquoi: "Protection contre les maladies tropicales et accidents.", points: ["Prise en charge Paludisme", "Rapatriement", "Perte de documents"] },
        { id: 7, pays: 'TOGO', zone: 'Afrique (CIMA)', img: imgTogo, capital: 'Lomé', desc: "Le Togo s'impose aujourd'hui comme l'escale d'affaires incontournable de l'Afrique de l'Est, portée par une vision stratégique qui transforme le pays en un véritable hub logistique et financier de premier plan.", pourquoi: "Assistance réactive à Lomé incluant la responsabilité civile.", points: ["Couverture médicale Lomé", "Responsabilité Civile", "Aide logistique"] },
        { id: 8, pays: 'BURKINA FASO', zone: 'Afrique (CIMA)', img: imgBurkinaFaso, capital: 'Ouagadougou', desc: "Destination culturelle au cœur du Sahel. Pays des « Hommes Intègres », il offre un dynamisme créatif unique et une hospitalité légendaire qui facilitent les échanges.", pourquoi: "Protection sanitaire à Ouagadougou et rapatriement garanti.", points: ["Urgences Ouagadougou", "Évacuation sanitaire", "Assistance rapatriement"] },
    ];

    const destinationsAAfficher = voirTout ? toutesDestinations : toutesDestinations.slice(0, 4);

    return (
        <div style={styles.wrapper}>
            {/* Insertion de ta Navbar dynamique et responsive */}
            <Navbar />

            <div className="marquee-container">
                <div className="marquee-text">FLASH INFO : SAMB'A VOYAGE renforce son réseau d'assistance avec Africa First Assist — 🛡️ Souscrivez en ligne en moins de 2 minutes — ✈️ Rappel : Votre attestation est disponible immédiatement après paiement.</div>
            </div>

            <header className="hero-section" style={{ ...styles.hero, backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${imgSambaHero})` }}>
                <div className="animate-fade" style={styles.heroContent}>
                    <h1 className="hero-title" style={styles.heroTitle}>Voyagez l'esprit tranquille avec <span style={{ color: '#39b54a' }}> SAMB'A-VOYAGE </span></h1>
                    <p className="hero-subtitle" style={styles.heroSubtitle}>L'assurance voyage gabonaise qui vous accompagne partout dans le monde.</p>
                    <button onClick={() => navigate('/souscription')} onMouseEnter={() => setHoverBtnHero(true)} onMouseLeave={() => setHoverBtnHero(false)} style={{ ...styles.btnHero, transform: hoverBtnHero ? 'scale(1.05) translateY(-3px)' : 'scale(1)', boxShadow: hoverBtnHero ? '0 10px 20px rgba(57, 181, 74, 0.4)' : 'none', transition: 'all 0.3s ease' }}>SOUSCRIRE EN LIGNE <ChevronRight size={20} /></button>
                </div>
            </header>

            <section className="portal-container" style={styles.sectionPortal}>
                {portails.map((p) => (
                    <div className="portal-card-item" key={p.id} onMouseEnter={() => setHoveredCard(p.id)} onMouseLeave={() => setHoveredCard(null)} onClick={() => navigate(p.path)} style={{ ...styles.portalCard, border: `1px solid ${p.border}`, transform: hoveredCard === p.id ? 'translateY(-12px) scale(1.03)' : 'translateY(0)', boxShadow: hoveredCard === p.id ? `0 20px 40px rgba(0,0,0,0.15)` : '0 10px 20px rgba(0,0,0,0.08)', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>{p.icon}</div>
                        <h3 style={{ fontSize: '18px', marginBottom: '10px', fontWeight: '700' }}>{p.title}</h3>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>{p.desc}</p>
                    </div>
                ))}
            </section>

            <section className="section-responsive" style={{ ...styles.section, background: '#fff' }}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title" style={{ fontSize: '2rem', fontWeight: '800' }}>Découvrez les <span style={{ color: '#39b54a' }}>destinations</span> populaires</h2>
                    <p style={{ color: '#64748b' }}>Nous couvrons toute la zone CIMA et la zone EUROPE.</p>
                </div>

                <div style={styles.destGrid}>
                    {destinationsAAfficher.map((d) => (
                        <div
                            key={d.id}
                            onMouseEnter={() => setHoverDest(d.id)}
                            onMouseLeave={() => setHoverDest(null)}
                            style={{
                                ...styles.destCard,
                                transform: hoverDest === d.id ? 'translateY(-10px)' : 'none',
                                boxShadow: hoverDest === d.id ? '0 20px 30px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div className="dest-card-img" style={{ backgroundImage: `url(${d.img})` }}></div>
                            <div style={styles.destBody}>
                                <span style={styles.destTag}>{d.zone}</span>
                                <h3 style={styles.destTitle}>L'assurance voyage - {d.pays}</h3>
                                <button onClick={() => setPaysSelectionne(d)} style={styles.btnSavoirPlus}>En savoir plus <LucideArrowRight size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>

                {!voirTout && (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <button onClick={() => setVoirTout(true)} style={styles.btnVoirTout}>Voir toutes les destinations</button>
                    </div>
                )}
            </section>

            {/* --- MODALE DE DÉTAILS DESTINATIONS --- */}
            {paysSelectionne && (
                <div className="modal-overlay" onClick={() => setPaysSelectionne(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setPaysSelectionne(null)}><X size={24} /></button>
                        <div className="modal-header-img" style={{ ...styles.modalImgHeaderLarge, backgroundImage: `url(${paysSelectionne.img})` }}>
                            <div className="modal-header-overlay" style={styles.modalImgOverlayLarge}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <MapPin size={22} color="#39b54a" />
                                        <span style={{ background: '#39b54a', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            Destination {paysSelectionne.zone}
                                        </span>
                                    </div>
                                    <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>
                                        {paysSelectionne.pays}
                                    </h2>
                                    <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Capitale : {paysSelectionne.capital}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-body-padding" style={{ padding: '40px 50px' }}>
                            <div className="modal-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '40px' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', color: '#0070bb', fontWeight: 'bold', alignItems: 'center' }}>
                                        <Info size={20} /> Présentation
                                    </div>
                                    <p style={{ lineHeight: '1.7', color: '#475569', fontSize: '1.05rem', marginBottom: '30px', marginTop: 0 }}>
                                        {paysSelectionne.desc}
                                    </p>
                                    <div style={styles.whySambaBlock}>
                                        <ShieldCheck size={28} color="#39b54a" style={{ flexShrink: 0 }} />
                                        <p style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                            <strong>Engagement SAMB'A :</strong> {paysSelectionne.pourquoi}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', alignSelf: 'start' }}>
                                    <h4 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#1e293b' }}>Vos garanties incluses :</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                                        {paysSelectionne.points.map((p, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem' }}>
                                                <CheckCircle2 size={18} color="#39b54a" style={{ flexShrink: 0 }} />
                                                <span style={{ color: '#475569' }}>{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => navigate('/souscription', { state: { destination: paysSelectionne.pays } })}
                                        style={{ ...styles.btnHero, width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(57, 181, 74, 0.3)' }}
                                    >
                                        Souscrire pour ce pays
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION POURQUOI NOUS CHOISIR --- */}
            <section className="section-responsive" style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Pourquoi nous choisir ?</h2>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#424e5e', lineHeight: '1.6', maxWidth: '800px', margin: '20px auto 0 auto' }}>
                        <span style={{ color: '#39b54a' }}>Des assurances pour tous, 100% en ligne</span> :
                        expatriés, étudiants, PVT, jeunes au pair, entreprises... Nous assurons tous ceux qui partent à l'étranger.
                    </p>
                </div>
                <div style={styles.gridPropos}>
                    {/* CARTE FIABILITÉ */}
                    <div
                        onMouseEnter={() => setHoveredAvantage('fiabilite')}
                        onMouseLeave={() => setHoveredAvantage(null)}
                        onClick={() => setAvantageSelectionne({
                            title: "Fiabilité & Expertise",
                            icon: <Shield size={50} color="#39b54a" />,
                            text: "Depuis plus de 3 ans, SAMB'A-VOYAGE s'impose comme le leader de l'assurance voyage en ligne au Gabon. We travaillons en partenariat étroit avec les plus grands réseaux d'assistance mondiaux pour garantir que chaque contrat émis est reconnu par les ambassades.",
                            details: ["Expertise locale reconnue", "Partenariats certifiés", "Validité Visa Garantie"]
                        })}
                        style={{
                            ...styles.cardPropos,
                            transform: hoveredAvantage === 'fiabilite' ? 'translateY(-10px)' : 'none',
                            boxShadow: hoveredAvantage === 'fiabilite' ? '0 15px 30px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.05)',
                            border: hoveredAvantage === 'fiabilite' ? '2px solid #39b54a' : '2px solid transparent',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center' }}><Shield size={40} color="#39b54a" /></div>
                        <h3 style={{ marginTop: '15px', fontWeight: '700' }}>Fiabilité</h3>
                        <p style={{ color: '#64748b' }}>Plus de 3 ans d'expertise dans l'assurance au Gabon.</p>
                        <span style={{ color: '#39b54a', fontSize: '12px', fontWeight: 'bold' }}>En savoir plus +</span>
                    </div>

                    {/* CARTE SÉRÉNITÉ */}
                    <div
                        onMouseEnter={() => setHoveredAvantage('serenite')}
                        onMouseLeave={() => setHoveredAvantage(null)}
                        onClick={() => setAvantageSelectionne({
                            title: "Sérénité & Assistance",
                            icon: <Plane size={50} color="#0070bb" />,
                            text: "Notre plateau d'assistance est joignable 24h/24 et 7j/7. Que ce soit pour une simple consultation ou un rapatriement d'urgence, nos équipes gèrent l'intégralité des coûts avec les hôpitaux à l'étranger.",
                            details: ["Assistance 24/7", "Aucune avance de frais", "Rapatriement sanitaire"]
                        })}
                        style={{
                            ...styles.cardPropos,
                            transform: hoveredAvantage === 'serenite' ? 'translateY(-10px)' : 'none',
                            boxShadow: hoveredAvantage === 'serenite' ? '0 15px 30px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.05)',
                            border: hoveredAvantage === 'serenite' ? '2px solid #0070bb' : '2px solid transparent',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'center' }}><Plane size={40} color="#0070bb" /></div>
                        <h3 style={{ marginTop: '15px', fontWeight: '700' }}>Sérénité</h3>
                        <p style={{ color: '#64748b' }}>Une assistance disponible 24h/24 où que vous soyez.</p>
                        <span style={{ color: '#0070bb', fontSize: '12px', fontWeight: 'bold' }}>En savoir plus +</span>
                    </div>
                </div>
            </section>

            {/* --- MODALE POUR LES AVANTAGES --- */}
            {avantageSelectionne && (
                <div className="modal-overlay" onClick={() => setAvantageSelectionne(null)}>
                    <div className="modal-content" style={{ maxWidth: '500px', padding: '30px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <button style={styles.closeBtn} onClick={() => setAvantageSelectionne(null)}><X size={24} /></button>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>{avantageSelectionne.icon}</div>
                        <h2 style={{ color: '#1e293b', marginBottom: '15px', fontSize: '1.6rem', fontWeight: '700' }}>{avantageSelectionne.title}</h2>
                        <p style={{ lineHeight: '1.6', color: '#64748b', marginBottom: '25px' }}>{avantageSelectionne.text}</p>
                        <div style={{ textAlign: 'left', background: '#f8fafc', padding: '20px', borderRadius: '15px' }}>
                            {avantageSelectionne.details.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                    <CheckCircle2 size={16} color="#39b54a" />
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>{d}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    wrapper: { fontFamily: 'Segoe UI, sans-serif', color: '#1e293b', background: '#f8fafc', overflowX: 'hidden' },
    hero: { height: '65vh', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' },
    heroContent: { maxWidth: '800px', padding: '20px', margin: '0 auto' },
    heroTitle: { fontSize: '2.8rem', marginBottom: '20px', fontWeight: '800', lineHeight: '1.2' },
    heroSubtitle: { fontSize: '1.2rem', marginBottom: '35px', opacity: 0.95 },
    btnHero: { background: '#39b54a', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '30px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '10px' },
    sectionPortal: { display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 5%', marginTop: '-60px', flexWrap: 'wrap', zIndex: 10, position: 'relative' },
    portalCard: { background: 'white', padding: '25px', borderRadius: '20px', width: '240px', cursor: 'pointer', textAlign: 'center' },
    section: { padding: '70px 10%' },
    sectionHeader: { textAlign: 'center', marginBottom: '50px' },
    gridPropos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', justifyContent: 'center' },
    cardPropos: { padding: '40px 25px', textAlign: 'center', background: 'white', borderRadius: '20px' },
    destGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' },
    destCard: { background: 'white', borderRadius: '20px', overflow: 'hidden', cursor: 'pointer', border: '1px solid #f1f5f9' },
    destBody: { padding: '25px' },
    destTag: { fontSize: '12px', color: '#64748b', fontWeight: '600' },
    destTitle: { fontSize: '18px', margin: '10px 0 20px 0', fontWeight: '700' },
    btnSavoirPlus: { background: 'none', border: 'none', color: '#39b54a', fontWeight: 'bold', display: 'flex', gap: '8px', cursor: 'pointer', padding: 0 },
    btnVoirTout: { background: '#0070bb', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },

    closeBtn: { position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)' },
    modalImgHeaderLarge: { height: '380px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' },
    modalImgOverlayLarge: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: '30px 40px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white' },
    whySambaBlock: { background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '20px', borderRadius: '15px', display: 'flex', gap: '15px', marginTop: '20px' },
};

export default Accueil;