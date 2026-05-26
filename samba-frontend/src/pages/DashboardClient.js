import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, FileText, Shield, LogOut, 
    Download, AlertCircle, Calendar, MapPin, Clock, CheckCircle, XCircle, Info
} from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg';

const DashboardClient = () => {
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [mesSinistres, setMesSinistres] = useState([]);
    const [mesContrats, setMesContrats] = useState([]);
    const [sinistreDetail, setSinistreDetail] = useState(null);

    // Déplacé ici pour être accessible par la fonction d'impression
    const formatDate = (dateString) => {
        if (!dateString) return "Non définie";
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const imprimerAttestation = (contrat) => {
        const fenetreImpression = window.open('', '', 'height=900,width=850');
        fenetreImpression.document.write(`
            <html>
                <head>
                    <title>Attestation_${contrat.numero_police || 'Samba'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 30px; color: #000; }
                        .a4-container { width: 750px; margin: auto; border: 1px solid #d1d5db; padding: 30px; box-sizing: border-box; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                        .logo { width: 100px; }
                        .contract-title { text-align: center; }
                        .serial { color: #e11d48; font-weight: bold; text-align: right; font-size: 14px; }
                        .main-table td { border: 1px solid #000; padding: 10px; font-size: 12px; }
                        .section-title { background: #f8fafc; font-weight: bold; text-transform: uppercase; width: 110px; text-align: center; }
                        .label { font-weight: bold; width: 130px; }
                        .signature-section { display: flex; justify-content: space-between; margin-top: 30px; }
                        .sig-box { border: 1px solid #000; width: 180px; height: 70px; margin-top: 5px; }
                        .footer-note { text-align: center; font-size: 8px; color: #64748b; margin-top: 10px; }
                    </style>
                </head>
                <body>
                    <div class="a4-container">
                        <table>
                            <tr>
                                <td width="20%"><img src="${logoSamba}" class="logo" /></td>
                                <td class="contract-title">
                                    <h2 style="margin:0; font-size:16px;">Contrat Assurance Voyage : SAMBA VOYAGE</h2>
                                    <p style="margin:0; font-size:10px;">Régi par le Code des assurances CIMA</p>
                                    <div style="font-weight:bold; margin-top:10px;">CONDITIONS PARTICULIERES (ATTESTATION)</div>
                                </td>
                                <td width="20%" class="serial">SV-${contrat.numero_police ? contrat.numero_police.slice(-6) : '668503'}</td>
                            </tr>
                        </table>

                        <table class="main-table">
                            <tr>
                                <td class="section-title" rowspan="2">Couverture</td>
                                <td class="label">Pays Destination :</td>
                                <td>${contrat.destination || 'Monde Entier'}</td>
                            </tr>
                            <tr>
                                <td class="label">Période :</td>
                                <td>Du ${formatDate(contrat.date_effet)} au ${formatDate(contrat.date_echeance)}</td>
                            </tr>
                            <tr>
                                <td class="section-title" rowspan="2">Assuré</td>
                                <td class="label">Nom & Prénom :</td>
                                <td>${client.nom} ${client.prenom}</td>
                            </tr>
                            <tr>
                                <td class="label">N° Passeport :</td>
                                <td>${contrat.passeport_numero || 'Vérifié'}</td>
                            </tr>
                            <tr>
                                <td class="section-title">Prestataire</td>
                                <td class="label">Assistance :</td>
                                <td><strong>AFRICA FIRST ASSIST (AFA)</strong><br>Urgence 24h/24 : (+212) 522 97 47 47</td>
                            </tr>
                            <tr>
                                <td class="section-title">Cotisation</td>
                                <td class="label">Total TTC :</td>
                                <td><strong>${contrat.montant || '15 000'} FCFA</strong> (Acquitté)</td>
                            </tr>
                        </table>

                        <div style="margin-top:20px; padding:10px; background:#f1f5f9; border-radius:5px; font-size:11px;">
                            J'accepte le traitement de mes données par <strong>SAG</strong> conformément à la réglementation en vigueur.
                        </div>

                        <div class="signature-section">
                            <div><strong>Le Souscripteur</strong><div class="sig-box"></div></div>
                            <div style="align-self: flex-end;" class="footer-note">F1: SAMB'A | F2: AFA | F3: ASSURÉ</div>
                            <div><strong>L'Assureur (Samba)</strong><div class="sig-box" style="text-align:center; padding-top:10px; color:blue; font-weight:bold; opacity:0.5; border: 2px solid blue;">CACHET VALIDE</div></div>
                        </div>
                    </div>
                    <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; }</script>
                </body>
            </html>
        `);
        fenetreImpression.document.close();
    };

    useEffect(() => {
        const savedClient = localStorage.getItem('clientConnecte');
        if (savedClient) {
            const clientData = JSON.parse(savedClient);
            setClient(clientData);
            
            chargerSinistresClient(clientData);
            chargerContratsClient(clientData);

            const interval = setInterval(() => {
                chargerSinistresClient(clientData);
                chargerContratsClient(clientData);
            }, 60000); 

            return () => clearInterval(interval);
        } else {
            navigate('/espace-client');
        }
    }, [navigate]);

    const chargerContratsClient = (clientData) => {
        fetch('http://localhost:3000/api/contrats/dashboard-agence')
            .then(res => res.json())
            .then(data => {
                const filtrés = data.filter(c => 
                    c.numero_police === clientData.numero_police || 
                    (c.souscripteur_nom === clientData.nom)
                );
                setMesContrats(filtrés);
            })
            .catch(err => console.error("Erreur chargement contrats :", err));
    };

    const chargerSinistresClient = (clientData) => {
        fetch('http://localhost:3000/api/contrats/liste-sinistres')
            .then(res => res.json())
            .then(data => {
                const filtrés = data.filter(s => 
                    s.nom_client === `${clientData.prenom} ${clientData.nom}` || 
                    s.police_id === clientData.numero_police
                );
                setMesSinistres(filtrés);
            })
            .catch(err => console.error("Erreur chargement sinistres :", err));
    };

    const handleLogout = () => {
        localStorage.removeItem('clientConnecte');
        navigate('/espace-client');
    };

    const getMessageStatut = (s) => {
        const stat = (s.statut || "").toUpperCase();
        if (['VALIDE', 'APPROUVE', 'TERMINE', 'APPROUVÉ'].includes(stat)) 
            return "Bonne nouvelle ! Votre dossier a été validé. Le règlement est en cours de traitement par Africa First Assist.";
        if (['REJETE', 'REFUSE_AFA', 'REFUSÉ'].includes(stat)) 
            return `Dossier refusé. Motif : ${s.motif_rejet || "Les éléments fournis ne permettent pas une prise en charge dans le cadre de vos garanties."}`;
        if (stat === 'AFA_DEMANDE_INFOS_SAMBA') 
            return "Complément d'information : Nos experts ont contacté votre agence Samba Voyage pour obtenir des précisions sur votre dossier.";
        return "Analyse en cours : Votre déclaration est actuellement examinée par le service technique d'assistance.";
    };

    const getStatutStyle = (statut) => {
        const s = (statut || "").toUpperCase();
        if (['VALIDE', 'APPROUVE', 'TERMINE', 'APPROUVÉ'].includes(s)) return { color: '#15803d', label: 'Validé' };
        if (['REJETE', 'REFUSE_AFA', 'REFUSÉ'].includes(s)) return { color: '#e11d48', label: 'Rejeté' };
        return { color: '#f59e0b', label: 'En cours' };
    };

    if (!client) return null;

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.logoArea} onClick={() => navigate('/')}>
                    <img src={logoSamba} style={styles.logoImg} alt="Samba Logo" />
                </div>
                <nav style={styles.nav}>
                    <div style={{...styles.navItem, ...styles.activeItem}} onClick={() => navigate('/dashboard-client')}>
                        <User size={20} /> Mon Profil
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/mes-contrats')}>
                        <FileText size={20} /> Mes Contrats
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/declarer-sinistre')}>
                        <AlertCircle size={20} /> Déclarer un sinistre
                    </div>
                </nav>
                <button onClick={handleLogout} style={styles.btnLogout}>
                    <LogOut size={20} /> Déconnexion
                </button>
            </div>

            <div style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.welcomeTitle}>Bienvenue, {client.prenom} {client.nom}</h1>
                    <p style={styles.welcomeSub}>Votre espace client Samba Voyage est à jour.</p>
                </header>

                <div style={styles.grid}>
                    <div style={{ display: 'contents' }}>
                        {mesContrats.length > 0 ? mesContrats.map((contrat, index) => (
                            <div key={index} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Contrat Actif</h3>
                                    <span style={styles.statusBadge}>VALIDE</span>
                                </div>
                                <div style={styles.contractDetails}>
                                    <div style={styles.detailRow}>
                                        <Shield size={18} color="#39b54a" />
                                        <span>Police N° : <strong style={{color: '#e11d48'}}>{contrat.numero_police || contrat.police}</strong></span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <MapPin size={18} color="#64748b" />
                                        <span>Destination : <strong>{contrat.destination || "Monde Entier"}</strong></span>
                                    </div>
                                    <div style={styles.detailRow}>
                                        <Calendar size={18} color="#64748b" />
                                        <span>Date d'effet : <strong>{formatDate(contrat.date_effet)}</strong></span>
                                    </div>
                                </div>
                                <button style={styles.btnDownload} onClick={() => imprimerAttestation(contrat)}>
                                    <Download size={18} /> Télécharger mon attestation
                                </button>
                            </div>
                        )) : (
                            <div style={styles.card}>
                                <p style={{color: '#94a3b8'}}>Aucun contrat actif trouvé.</p>
                            </div>
                        )}
                    </div>

                    <div style={styles.card}>
                        <h3 style={{...styles.cardTitle, marginBottom: '20px'}}>Suivi de mes déclarations</h3>
                        <div style={styles.sinistreList}>
                            {mesSinistres.length > 0 ? mesSinistres.map((s, i) => (
                                <div 
                                    key={i} 
                                    style={styles.sinistreItem}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateX(8px)';
                                        e.currentTarget.style.borderColor = '#39b54a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateX(0)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onClick={() => setSinistreDetail(sinistreDetail?.id === s.id ? null : s)}
                                >
                                    <div>
                                        <div style={{fontWeight: 'bold', fontSize: '14px'}}>{s.type_incident}</div>
                                        <div style={{fontSize: '11px', color: '#94a3b8'}}>Réf: #{s.id}</div>
                                    </div>
                                    <div style={{...styles.miniBadge, color: getStatutStyle(s.statut).color}}>
                                        {getStatutStyle(s.statut).label}
                                    </div>
                                </div>
                            )) : (
                                <p style={{fontSize: '14px', color: '#94a3b8'}}>Aucun sinistre déclaré.</p>
                            )}
                        </div>

                        {sinistreDetail && (
                            <div style={styles.infoBox}>
                                <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                                    <Info size={20} color="#39b54a" style={{marginTop: '3px'}} />
                                    <div>
                                        <h4 style={{margin: '0 0 8px 0', fontSize: '14px'}}>Statut détaillé : {sinistreDetail.type_incident}</h4>
                                        <p style={styles.infoText}>{getMessageStatut(sinistreDetail)}</p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSinistreDetail(null); }}
                                            style={styles.btnCloseDetail}
                                        >
                                            Fermer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{...styles.card, background: '#1e293b', color: 'white'}}>
                        <h3 style={{...styles.cardTitle, color: 'white'}}>Besoin d'aide ?</h3>
                        <div style={styles.emergencyBox}>
                            <span style={{fontSize: '11px', color: '#94a3b8'}}>AFRICA FIRST ASSIST</span>
                            <div style={styles.phoneNum}>(+212) 522 97 47 47</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Les styles restent identiques à ton original
const styles = {
    container: { display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: 'Segoe UI, sans-serif' },
    sidebar: { width: '260px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '30px' },
    logoArea: { cursor: 'pointer', marginBottom: '40px', textAlign: 'center' },
    logoImg: { width: '120px', height: 'auto', borderRadius: '8px' },
    nav: { flex: 1 },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', cursor: 'pointer', color: '#64748b', marginBottom: '8px', transition: '0.2s' },
    activeItem: { background: '#f8fafc', color: '#39b54a', fontWeight: 'bold', borderLeft: '4px solid #39b54a' },
    btnLogout: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff1f2', color: '#e11d48', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    mainContent: { flex: 1, padding: '50px', overflowY: 'auto' },
    header: { marginBottom: '40px' },
    welcomeTitle: { fontSize: '32px', color: '#1e293b', margin: 0 },
    welcomeSub: { color: '#64748b', marginTop: '5px', fontSize: '18px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' },
    card: { background: 'white', borderRadius: '24px', padding: '35px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', position: 'relative' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    cardTitle: { fontSize: '20px', color: '#1e293b', margin: 0 },
    statusBadge: { background: '#dcfce7', color: '#15803d', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    contractDetails: { marginBottom: '30px' },
    detailRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', fontSize: '16px' },
    btnDownload: { width: '100%', padding: '15px', background: '#39b54a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    emergencyBox: { background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' },
    phoneNum: { fontSize: '22px', fontWeight: 'bold', marginTop: '5px', color: '#39b54a' },
    sinistreList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    sinistreItem: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '15px', 
        background: '#f8fafc', 
        borderRadius: '16px', 
        cursor: 'pointer', 
        transition: 'all 0.3s ease',
        border: '1px solid transparent'
    },
    miniBadge: { fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '6px', background: '#fff', border: '1px solid #eee' },
    infoBox: { 
        marginTop: '20px', 
        padding: '20px', 
        background: '#f0fdf4', 
        borderRadius: '16px', 
        border: '1px solid #bcf0da',
        animation: 'fadeIn 0.3s ease-out'
    },
    infoText: { fontSize: '13px', color: '#374151', lineHeight: '1.6', margin: 0 },
    btnCloseDetail: { 
        marginTop: '10px', 
        background: 'none', 
        border: 'none', 
        color: '#39b54a', 
        fontSize: '12px', 
        fontWeight: 'bold', 
        cursor: 'pointer', 
        padding: 0,
        textDecoration: 'underline'
    }
};

export default DashboardClient;