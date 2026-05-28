import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, FileText, Shield, LogOut, 
    Download, AlertCircle, Calendar, MapPin, ShieldAlert, CheckCircle2, Clock, Info
} from 'lucide-react';
import logoSamba from '../assets/Logo Samba.jpeg';

const DashboardClient = () => {
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [mesSinistres, setMesSinistres] = useState([]);
    const [mesContrats, setMesContrats] = useState([]);
    const [sinistreDetail, setSinistreDetail] = useState(null);

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
                        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #1e293b; background: #fff; }
                        .a4-container { width: 750px; margin: auto; border: 1px solid #e2e8f0; padding: 40px; box-sizing: border-box; border-radius: 8px; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                        .logo { width: 120px; height: auto; border-radius: 6px; }
                        .contract-title { text-align: center; padding-right: 20px; }
                        .serial { color: #e11d48; font-weight: bold; text-align: right; font-size: 15px; font-family: monospace; }
                        .main-table td { border: 1px solid #cbd5e1; padding: 12px; font-size: 13px; }
                        .section-title { background: #f8fafc; font-weight: bold; text-transform: uppercase; width: 110px; text-align: center; color: #475569; }
                        .label { font-weight: bold; width: 140px; color: #64748b; }
                        .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
                        .sig-box { border: 1px solid #94a3b8; width: 200px; height: 80px; margin-top: 5px; border-radius: 6px; background: #f8fafc; }
                        .footer-note { text-align: center; font-size: 9px; color: #94a3b8; margin-top: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
                    </style>
                </head>
                <body>
                    <div class="a4-container">
                        <table>
                            <tr>
                                <td width="25%"><img src="${logoSamba}" class="logo" /></td>
                                <td class="contract-title">
                                    <h2 style="margin:0; font-size:18px; color:#0f172a;">Contrat Assurance Voyage : SAMBA VOYAGE</h2>
                                    <p style="margin:4px 0 0 0; font-size:11px; color:#64748b;">Régi par le Code des assurances CIMA</p>
                                    <div style="font-weight:800; margin-top:12px; color:#39b54a; letter-spacing:0.5px; font-size:13px;">CONDITIONS PARTICULIERES (ATTESTATION)</div>
                                </td>
                                <td width="20%" class="serial">SV-${contrat.numero_police ? contrat.numero_police.slice(-6) : '668503'}</td>
                            </tr>
                        </table>

                        <table class="main-table">
                            <tr>
                                <td class="section-title" rowspan="2">Couverture</td>
                                <td class="label">Pays Destination :</td>
                                <td style="font-weight: 600;">${contrat.destination || 'Monde Entier'}</td>
                            </tr>
                            <tr>
                                <td class="label">Période :</td>
                                <td style="font-weight: 600; color: #0f172a;">Du ${formatDate(contrat.date_effet)} au ${formatDate(contrat.date_echeance)}</td>
                            </tr>
                            <tr>
                                <td class="section-title" rowspan="2">Assuré</td>
                                <td class="label">Nom & Prénom :</td>
                                <td style="font-weight: 600; text-transform: uppercase;">${client.nom} ${client.prenom}</td>
                            </tr>
                            <tr>
                                <td class="label">N° Passeport :</td>
                                <td style="font-family: monospace; font-weight: 600;">${contrat.passeport_numero || 'Vérifié'}</td>
                            </tr>
                            <tr>
                                <td class="section-title">Prestataire</td>
                                <td class="label">Assistance :</td>
                                <td><strong style="color:#0f172a;">AFRICA FIRST ASSIST (AFA)</strong><br><span style="color:#e11d48; font-weight:700;">Urgence 24h/24 : (+212) 522 97 47 47</span></td>
                            </tr>
                            <tr>
                                <td class="section-title">Cotisation</td>
                                <td class="label">Total TTC :</td>
                                <td><strong style="color:#39b54a; font-size:14px;">${contrat.montant || '15 000'} FCFA</strong> (Acquitté)</td>
                            </tr>
                        </table>

                        <div style="margin-top:25px; padding:12px; background:#f1f5f9; border-radius:6px; font-size:11px; color:#475569; text-align:justify; line-height:1.4;">
                            J'accepte le traitement de mes données par <strong>SAG</strong> conformément à la réglementation en vigueur sur la protection des données à caractère personnel.
                        </div>

                        <div class="signature-section">
                            <div><strong>Le Souscripteur</strong><div class="sig-box"></div></div>
                            <div style="align-self: flex-end;" class="footer-note">F1: SAMB'A | F2: AFA | F3: ASSURÉ</div>
                            <div><strong>L'Assureur (Samba)</strong><div class="sig-box" style="text-align:center; padding-top:25px; box-sizing:border-box; color:#2563eb; font-weight:bold; opacity:0.8; border: 2px dashed #2563eb; font-size:12px; letter-spacing:1px;">CACHET VALIDE</div></div>
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
        fetch('https://sambavoyage.vercel.app/api/contrats/dashboard-agence')
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
        fetch('https://sambavoyage.vercel.app/api/contrats/liste-sinistres')
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
        if (['VALIDE', 'APPROUVE', 'TERMINE', 'APPROUVÉ'].includes(s)) return { color: '#16a34a', bg: '#dcfce7', label: 'Validé' };
        if (['REJETE', 'REFUSE_AFA', 'REFUSÉ'].includes(s)) return { color: '#dc2626', bg: '#ffe4e6', label: 'Rejeté' };
        return { color: '#d97706', bg: '#fef3c7', label: 'En cours' };
    };

    if (!client) return null;

    return (
        <div style={styles.container} className="dashboard-layout">
            {/* --- SIDEBAR --- */}
            <div style={styles.sidebar} className="dashboard-sidebar">
                <div style={styles.logoArea} onClick={() => navigate('/')}>
                    <img src={logoSamba} style={styles.logoImg} alt="Samba Logo" />
                </div>
                <nav style={styles.nav}>
                    <div style={{...styles.navItem, ...styles.activeItem}} onClick={() => navigate('/dashboard-client')}>
                        <User size={18} /> Mon Profil
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/mes-contrats')}>
                        <FileText size={18} /> Mes Contrats
                    </div>
                    <div style={styles.navItem} onClick={() => navigate('/declarer-sinistre')}>
                        <AlertCircle size={18} /> Déclarer un sinistre
                    </div>
                </nav>
                <button onClick={handleLogout} style={styles.btnLogout}>
                    <LogOut size={18} /> Déconnexion
                </button>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div style={styles.mainContent}>
                <header style={styles.header}>
                    <h1 style={styles.welcomeTitle}>Bienvenue, {client.prenom} {client.nom}</h1>
                    <p style={styles.welcomeSub}>Votre espace client Samba Voyage est à jour.</p>
                </header>

                <div style={styles.grid} className="dashboard-grid">
                    {/* --- CONTRATS ACTIFS --- */}
                    {mesContrats.length > 0 ? mesContrats.map((contrat, index) => (
                        <div key={`contrat-${index}`} style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h3 style={styles.cardTitle}>Contrat Actif</h3>
                                <span style={styles.statusBadge}>VALIDE</span>
                            </div>
                            <div style={styles.contractDetails}>
                                <div style={styles.detailRow}>
                                    <Shield size={18} color="#39b54a" />
                                    <span>Police N° : <strong style={{color: '#e11d48', fontFamily: 'monospace'}}>{contrat.numero_police || contrat.police}</strong></span>
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
                            <h3 style={styles.cardTitle}>Contrat Actif</h3>
                            <p style={{color: '#94a3b8', marginTop: '20px', fontSize: '15px'}}>Aucun contrat actif trouvé.</p>
                        </div>
                    )}

                    {/* --- SUIVI DES DÉCLARATIONS --- */}
                    <div style={styles.card}>
                        <h3 style={{...styles.cardTitle, marginBottom: '20px'}}>Suivi de mes déclarations</h3>
                        <div style={styles.sinistreList}>
                            {mesSinistres.length > 0 ? mesSinistres.map((s, i) => {
                                const statusInfo = getStatutStyle(s.statut);
                                return (
                                    <div 
                                        key={`sinistre-${s.id || i}`} 
                                        style={{
                                            ...styles.sinistreItem,
                                            borderColor: sinistreDetail?.id === s.id ? '#39b54a' : 'transparent',
                                            background: sinistreDetail?.id === s.id ? '#f0fdf4' : '#f8fafc'
                                        }}
                                        onClick={() => setSinistreDetail(sinistreDetail?.id === s.id ? null : s)}
                                        className="sinistre-item-row"
                                    >
                                        <div>
                                            <div style={{fontWeight: '700', fontSize: '14px', color: '#1e293b'}}>{s.type_incident}</div>
                                            <div style={{fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px'}}>Réf: #{s.id}</div>
                                        </div>
                                        <div style={{...styles.miniBadge, color: statusInfo.color, backgroundColor: statusInfo.bg}}>
                                            {statusInfo.label}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <p style={{fontSize: '14px', color: '#94a3b8'}}>Aucun sinistre déclaré pour le moment.</p>
                            )}
                        </div>

                        {sinistreDetail && (
                            <div style={styles.infoBox}>
                                <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                                    <Info size={18} color="#39b54a" style={{marginTop: '2px', flexShrink: 0}} />
                                    <div style={{flex: 1}}>
                                        <h4 style={{margin: '0 0 6px 0', fontSize: '14px', fontWeight: '700', color: '#1e293b'}}>Détails : {sinistreDetail.type_incident}</h4>
                                        <p style={styles.infoText}>{getMessageStatut(sinistreDetail)}</p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSinistreDetail(null); }}
                                            style={styles.btnCloseDetail}
                                        >
                                            Fermer les détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- BLOC D'URGENCE --- */}
                    <div style={{...styles.card, background: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <h3 style={{...styles.cardTitle, color: 'white', marginBottom: '8px'}}>Besoin d'aide immédiate ?</h3>
                        <p style={{color: '#94a3b8', fontSize: '14px', margin: '0 0 20px 0'}}>Notre plateau médical d'urgence est disponible 24h/24 et 7j/7 pour vous assister.</p>
                        <div style={styles.emergencyBox}>
                            <span style={{fontSize: '11px', color: '#94a3b8', fontWeight: '700', letterSpacing: '0.5px'}}>AFRICA FIRST ASSIST</span>
                            <div style={styles.phoneNum}>(+212) 522 97 47 47</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- DESIGN SYSTEM CENTRALISÉ ---
const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Segoe UI, system-ui, sans-serif' },
    sidebar: { width: '280px', background: 'white', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '35px 25px', boxSizing: 'border-box' },
    logoArea: { cursor: 'pointer', marginBottom: '40px', textAlign: 'center' },
    logoImg: { width: '130px', height: 'auto', borderRadius: '10px' },
    nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', color: '#64748b', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' },
    activeItem: { background: '#f0fdf4', color: '#39b54a', fontWeight: '700', borderLeft: '4px solid #39b54a', borderRadius: '0 12px 12px 0' },
    btnLogout: { display: 'flex', alignItems: 'center', gap: '10px', background: '#fff1f2', color: '#e11d48', border: 'none', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', transition: 'background-color 0.2s' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto', boxSizing: 'border-box' },
    header: { marginBottom: '35px' },
    welcomeTitle: { fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: '800' },
    welcomeSub: { color: '#64748b', marginTop: '6px', fontSize: '15px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '25px' },
    card: { background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 18px -4px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', boxSizing: 'border-box' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    cardTitle: { fontSize: '18px', color: '#0f172a', margin: 0, fontWeight: '700' },
    statusBadge: { background: '#dcfce7', color: '#16a34a', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.3px' },
    contractDetails: { marginBottom: '25px' },
    detailRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', fontSize: '15px', color: '#334155' },
    btnDownload: { width: '100%', padding: '14px', background: '#39b54a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(57, 181, 74, 0.15)' },
    emergencyBox: { background: 'rgba(255,255,255,0.04)', padding: '18px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' },
    phoneNum: { fontSize: '22px', fontWeight: '800', marginTop: '6px', color: '#39b54a', letterSpacing: '0.5px' },
    sinistreList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    sinistreItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid' },
    miniBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' },
    infoBox: { marginTop: '15px', padding: '16px', borderRadius: '14px', border: '1px solid #bcf0da', animation: 'fadeIn 0.25s ease-out' },
    infoText: { fontSize: '13px', color: '#475569', lineHeight: '1.5', margin: 0 },
    btnCloseDetail: { marginTop: '8px', background: 'none', border: 'none', color: '#39b54a', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0, textDecoration: 'underline' }
};

// --- ADAPTATION RESPONSIVE MOBILE ET HOVERS ---
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}
.sinistre-item-row:hover {
    transform: translateX(4px);
    border-color: #39b54a !important;
}
@media (max-width: 991px) {
    .dashboard-layout { flex-direction: column !important; }
    .dashboard-sidebar { width: 100% !important; height: auto !important; padding: 20px !important; border-right: none !important; border-bottom: 1px solid #e2e8f0 !important; }
    .dashboard-sidebar nav { flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; margin: 15px 0 !important; }
    .dashboard-sidebar button { align-self: flex-start !important; }
}
@media (max-width: 576px) {
    .dashboard-grid { grid-template-columns: 1fr !important; }
}
`;
document.head.appendChild(styleSheet);

export default DashboardClient;   

