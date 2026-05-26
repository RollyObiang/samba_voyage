import React, { useEffect, useState } from 'react';
import logoSamba from '../assets/samb-assurances.png'; 

import { 
    RefreshCcw, Eye, Search, AlertCircle, CheckCircle, 
    Home, Shield, FileText, Activity, Users, LayoutDashboard, Folder,
    TrendingUp, ArrowRight, Clock, PlusCircle, BarChart3, PieChart, Info,
    History 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ListeContrats = () => {
    const [contrats, setContrats] = useState([]);
    const [demandesAfa, setDemandesAfa] = useState([]); 
    const [historiqueTraites, setHistoriqueTraites] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [recherche, setRecherche] = useState('');
    const [ongletActif, setOngletActif] = useState('dashboard');
    const [contratSelectionne, setContratSelectionne] = useState(null); 
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredStat, setHoveredStat] = useState(null);
    
    const [graphiqueAffiche, setGraphiqueAffiche] = useState(null);
    
    const navigate = useNavigate();

    // LOGIQUE D'IMPRESSION FORMAT OFFICIEL (MODIFIÉE POUR CORRESPONDRE À TA CAPTURE)
    const imprimerAttestation = (c) => {
        const printWindow = window.open('', '_blank');
        const dateFin = new Date(new Date(c.date_effet).getTime() + (c.duree * 24 * 60 * 60 * 1000)).toLocaleDateString();
        
        const htmlContent = `
            <html>
            <head>
                <title>Attestation_${c.police || c.numero_police}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; color: #222; margin: 0; padding: 0; background: #fff; }
                    .page { width: 210mm; min-height: 297mm; padding: 15mm; margin: auto; border: 1px solid #ddd; box-sizing: border-box; position: relative; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #ed1c24; padding-bottom: 15px; }
                    .logo-brand { font-size: 26px; font-weight: bold; color: #1e293b; }
                    .logo-brand span { color: #ed1c24; }
                    .policy-info { text-align: right; font-size: 14px; }
                    .main-title { text-align: center; text-transform: uppercase; text-decoration: underline; font-size: 20px; margin: 40px 0; font-weight: bold; }
                    .content-section { margin-bottom: 25px; }
                    .section-title { background: #f1f5f9; padding: 8px 12px; font-weight: bold; font-size: 13px; border-left: 4px solid #ed1c24; margin-bottom: 15px; }
                    .info-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 0 12px; }
                    .data-item { margin-bottom: 12px; }
                    .data-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: bold; display: block; }
                    .data-value { font-size: 15px; font-weight: 600; color: #111; border-bottom: 1px solid #eee; display: block; padding-top: 2px; }
                    .conditions { font-size: 12px; border: 1px solid #e2e8f0; padding: 15px; border-radius: 5px; background: #fafafa; line-height: 1.6; }
                    .footer-sig { margin-top: 60px; display: flex; justify-content: space-between; padding: 0 40px; }
                    .sig-block { text-align: center; width: 200px; }
                    .stamp-box { border: 3px double #1d4ed8; color: #1d4ed8; padding: 8px; display: inline-block; margin-top: 10px; transform: rotate(-10deg); font-weight: bold; border-radius: 4px; }
                    .legal-footer { position: absolute; bottom: 15mm; width: calc(100% - 30mm); text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #eee; padding-top: 10px; }
                </style>
            </head>
            <body>
                <div class="page">
                    <div class="header">
                        <div class="logo-brand">SAMBA <span>ASSURANCES</span></div>
                        <div class="policy-info">
                            <strong>POLICE N° : ${c.police || c.numero_police}</strong><br/>
                            Émis le : ${new Date().toLocaleDateString()}
                        </div>
                    </div>
                    
                    <h1 class="main-title">Attestation d'Assurance Voyage</h1>

                    <div class="content-section">
                        <div class="section-title">Informations de l'Assuré</div>
                        <div class="info-row">
                            <div class="data-item"><span class="data-label">Nom Complet</span><span class="data-value">${c.client || c.souscripteur_nom}</span></div>
                            <div class="data-item"><span class="data-label">Destination</span><span class="data-value">${c.destination}</span></div>
                        </div>
                    </div>

                    <div class="content-section">
                        <div class="section-title">Période de Validité & Prime</div>
                        <div class="info-row">
                            <div class="data-item"><span class="data-label">Du (Date d'effet)</span><span class="data-value">${new Date(c.date_effet).toLocaleDateString()}</span></div>
                            <div class="data-item"><span class="data-label">Au (Date d'échéance)</span><span class="data-value">${dateFin}</span></div>
                            <div class="data-item"><span class="data-label">Durée Totale</span><span class="data-value">${c.duree} Jours</span></div>
                            <div class="data-item"><span class="data-label">Prime Totale Payée</span><span class="data-value">${Number(c.montant).toLocaleString()} FCFA</span></div>
                        </div>
                    </div>

                    <div class="content-section">
                        <div class="section-title">Garanties Acquises</div>
                        <div class="conditions">
                            • Assistance Médicale et Rapatriement : Couverture jusqu'à 30 000 €<br/>
                            • Frais médicaux, chirurgicaux, pharmaceutiques et d'hospitalisation à l'étranger<br/>
                            • Assistance en cas de décès et transport de corps
                        </div>
                    </div>

                    <div class="footer-sig">
                        <div class="sig-block">L'Assuré<br/><br/><br/>________________</div>
                        <div class="sig-block">
                            La Compagnie<br/>
                            <div class="stamp-box">SAMBA ASSURANCES<br/>DIRECTION GÉNÉRALE</div>
                        </div>
                    </div>

                    <div class="legal-footer">
                        SAMBA ASSURANCES - Société Anonyme avec Conseil d'Administration au capital de XXX FCFA<br/>
                        Agrément n° XXX/MEP - Siège Social : Libreville, Gabon - Tél : +241 01 00 00 00
                    </div>
                </div>
                <script>window.onload = function() { window.print(); window.close(); };</script>
            </body>
            </html>
        `;
        printWindow.document.write(htmlContent);
        printWindow.document.close();
    };

    const chargerDonnees = async () => {
        try {
            const resC = await fetch('http://localhost:3000/api/contrats/dashboard-agence');
            const dataC = await resC.json();
            setContrats(Array.isArray(dataC) ? dataC : []);

            const resS = await fetch('http://localhost:3000/api/contrats/liste-sinistres');
            const dataS = await resS.json();
            
            if (Array.isArray(dataS)) {
                const aTraiter = dataS.filter(d => {
                    const s = (d.statut || "").trim().toUpperCase();
                    return s === 'AFA_DEMANDE_INFOS_SAMBA';
                });
                setDemandesAfa(aTraiter);

                const traites = dataS.filter(d => {
                    const s = (d.statut || "").trim().toUpperCase();
                    return [
                        'ATTENTE_AFA', 'EN_ATTENTE_SAMBA', 'TRANSMIS', 
                        'APPROUVE', 'REJETE', 'REFUSE_AFA', 'TRAITE', 
                        'VALIDE', 'TERMINE'
                    ].includes(s);
                });
                setHistoriqueTraites(traites);
            }
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerDonnees();
        const interval = setInterval(chargerDonnees, 15000);
        return () => clearInterval(interval);
    }, []);

    const contratsFiltres = contrats.filter(c => 
        (c.client || c.souscripteur_nom || "")?.toLowerCase().includes(recherche.toLowerCase()) || 
        (c.police || c.numero_police || "")?.toLowerCase().includes(recherche.toLowerCase())
    );

    const listeClientsUnique = Array.from(new Set(contrats.map(c => c.client || c.souscripteur_nom)))
        .map(nom => {
            const infosClient = contrats.find(c => (c.client || c.souscripteur_nom) === nom);
            return { nom, police: infosClient?.police || infosClient?.numero_police };
        });

    const totalChiffreAffaire = contrats.reduce((acc, c) => acc + Number(c.montant || 0), 0);

    return (
        <div style={styles.appLayout}>
            <aside style={styles.sidebar}>
                <div onClick={() => {setOngletActif('dashboard'); setContratSelectionne(null);}} style={{ ...styles.logoContainer, cursor: 'pointer' }}>
                    <img src={logoSamba} alt="Samba Logo" style={{ width: '40px', height: 'auto', borderRadius: '4px' }} />
                    <div style={styles.logoText}>
                        <span style={{ fontWeight: 800 }}>SAMBA</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>ASSURANCE</span>
                    </div>
                </div>
                <nav style={styles.nav}>
                    <div onClick={() => {setOngletActif('dashboard'); setContratSelectionne(null);}} style={ongletActif === 'dashboard' ? styles.navItemActive : styles.navItem}><LayoutDashboard size={18} /> Dashboard</div>
                    <div onClick={() => {setOngletActif('contrats'); setContratSelectionne(null);}} style={ongletActif === 'contrats' ? styles.navItemActive : styles.navItem}><FileText size={18} /> Contrats</div>
                    <div onClick={() => {setOngletActif('clients'); setContratSelectionne(null);}} style={ongletActif === 'clients' ? styles.navItemActive : styles.navItem}><Users size={18} /> Clients</div>
                    <div onClick={() => {setOngletActif('rapports'); setContratSelectionne(null);}} style={ongletActif === 'rapports' ? styles.navItemActive : styles.navItem}><Activity size={18} /> Rapport</div>
                </nav>
            </aside>

            <main style={styles.mainContent}>
                {ongletActif === 'dashboard' && (
                    <div>
                        <header style={{marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <h1 style={{fontSize: '24px', color: '#1e293b'}}>Tableau de Bord 👋</h1>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <button onClick={() => navigate('/souscription', { state: { provenance: 'agence', nomAgence: 'SAMBA LIBREVILLE' } })} style={styles.btnNouvelleSouscription}>
                                    <PlusCircle size={18} /> Nouvelle Souscription
                                </button>
                                {demandesAfa.length > 0 && (
                                    <div style={styles.badgeAlerte}><AlertCircle size={16} /> {demandesAfa.length} action(s) AFA en attente</div>
                                )}
                            </div>
                        </header>

                        <div style={styles.statsGrid}>
                            <div onMouseEnter={() => setHoveredStat('ca')} onMouseLeave={() => setHoveredStat(null)} onClick={() => setOngletActif('rapports')} style={{ ...styles.welcomeStatCard, ...(hoveredStat === 'ca' ? styles.statCardHover : {}), cursor: 'pointer' }}>
                                <div style={{...styles.iconCircle, background: '#dbeafe'}}><TrendingUp color="#3b82f6" /></div>
                                <div>
                                    <div style={styles.statLabel}>Chiffre d'Affaires</div>
                                    <div style={styles.statValue}>{totalChiffreAffaire.toLocaleString()} F</div>
                                    {hoveredStat === 'ca' && <div style={styles.viewDetailText}>Voir le rapport détaillé →</div>}
                                </div>
                            </div>
                            <div onMouseEnter={() => setHoveredStat('contrats')} onMouseLeave={() => setHoveredStat(null)} onClick={() => setOngletActif('contrats')} style={{ ...styles.welcomeStatCard, ...(hoveredStat === 'contrats' ? styles.statCardHover : {}), cursor: 'pointer' }}>
                                <div style={{...styles.iconCircle, background: '#dcfce7'}}><Shield color="#10b981" /></div>
                                <div>
                                    <div style={styles.statLabel}>Contrats</div>
                                    <div style={styles.statValue}>{contrats.length}</div>
                                    {hoveredStat === 'contrats' && <div style={styles.viewDetailText}>Consulter la liste →</div>}
                                </div>
                            </div>
                        </div>

                        <div style={styles.afaSection}>
                            <h3 style={{...styles.sectionTitle, color: '#ed1c24', display: 'flex', alignItems: 'center', gap: '8px'}}><Activity size={18} /> ALERTES PORTAIL AFA</h3>
                            {demandesAfa.length === 0 ? <p style={{fontSize: '13px', color: '#94a3b8'}}>Aucune demande en attente.</p> : (
                                <div style={styles.afaGrid}>
                                    {demandesAfa.map((d, i) => (
                                        <div key={i} style={styles.afaMiniCard}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}><span style={styles.miniBadge(d.statut)}>INFOS REQUISES</span><span style={{fontSize: '10px', color: '#94a3b8'}}>#{d.id}</span></div>
                                            <div style={{fontWeight: 'bold', fontSize: '14px', margin: '8px 0'}}>{d.nom_client}</div>
                                            <button onClick={() => navigate(`/valider-sinistre/${d.id}`)} style={styles.btnActionAfa}>Traiter le dossier <ArrowRight size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={styles.historySection}>
                            <h3 style={{...styles.sectionTitle, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px'}}><History size={18} /> SUIVI DES DOSSIERS TRANSMIS</h3>
                            {historiqueTraites.length === 0 ? <p style={{fontSize: '13px', color: '#94a3b8'}}>Aucun dossier traité.</p> : (
                                <div style={styles.historyTableContainer}>
                                    <table style={styles.table}>
                                        <thead><tr style={styles.tableHeadRow}><th style={styles.th}>ID</th><th style={styles.th}>CLIENT</th><th style={styles.th}>STATUT</th><th style={styles.th}>ACTION</th></tr></thead>
                                        <tbody>
                                            {historiqueTraites.map((h, i) => (
                                                <tr key={i} style={{ ...styles.tableRow, background: hoveredRow === i ? '#f8fafc' : 'transparent' }} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}>
                                                    <td style={styles.td}>#{h.id}</td><td style={styles.td}><strong>{h.nom_client}</strong></td>
                                                    <td style={styles.td}><span style={styles.statusBadge(h.statut)}>{h.statut}</span></td>
                                                    <td style={styles.td}><button onClick={() => navigate(`/valider-sinistre/${h.id}`)} style={styles.btnView}><Eye size={14} /> Voir détails</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {ongletActif === 'contrats' && (
                    <>
                        {!contratSelectionne ? (
                            <>
                                <div style={styles.topActionHeader}>
                                    <h2>Gestion des Contrats</h2>
                                    <div style={styles.searchWrapper}><Search size={16} color="#64748b" /><input style={styles.searchField} placeholder="Rechercher..." value={recherche} onChange={(e) => setRecherche(e.target.value)} /></div>
                                </div>
                                <div style={styles.folderGrid}>
                                    {contratsFiltres.map((c, i) => (
                                        <div key={i} style={{...styles.folderCard, cursor: 'pointer'}} onClick={() => setContratSelectionne(c)}>
                                            <Folder size={24} color="#3b82f6" fill="#dbeafe" />
                                            <div style={{marginTop: '10px', fontWeight: 'bold'}}>{c.police || c.numero_police}</div>
                                            <div style={{fontSize: '12px', color: '#64748b'}}>{c.client || c.souscripteur_nom}</div>
                                            <div style={{marginTop: '10px', color: '#10b981', fontWeight: 'bold'}}>{Number(c.montant).toLocaleString()} F</div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div style={styles.dashboardSection}>
                                <button onClick={() => setContratSelectionne(null)} style={{...styles.btnView, marginBottom: '20px'}}>← Retour à la liste</button>
                                <div style={{borderBottom: '1px solid #eee', paddingBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
                                    <div><h2 style={{margin: 0}}>Police : {contratSelectionne.police || contratSelectionne.numero_police}</h2><p style={{color: '#64748b', margin: '5px 0'}}>Client: <strong>{contratSelectionne.client || contratSelectionne.souscripteur_nom}</strong></p></div>
                                    <div style={{textAlign: 'right'}}><span style={styles.statusBadge('VALIDE')}>ACTIF</span><div style={{fontSize: '22px', fontWeight: '800', color: '#10b981', marginTop: '10px'}}>{Number(contratSelectionne.montant).toLocaleString()} F</div></div>
                                </div>
                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
                                    <div style={styles.afaMiniCard}>
                                        <h4 style={{margin: '0 0 15px 0', fontSize: '14px'}}><Info size={14}/> Détails du Voyage</h4>
                                        <div style={styles.infoRow}><span>Destination:</span> <strong>{contratSelectionne.destination}</strong></div>
                                        <div style={styles.infoRow}><span>Date Effet:</span> <strong>{new Date(contratSelectionne.date_effet).toLocaleDateString()}</strong></div>
                                        <div style={styles.infoRow}><span>Durée:</span> <strong>{contratSelectionne.duree} jours</strong></div>
                                    </div>
                                    <div style={styles.afaMiniCard}>
                                        <h4 style={{margin: '0 0 15px 0', fontSize: '14px'}}><Shield size={14}/> Couverture</h4>
                                        <div style={styles.infoRow}><span>Produit:</span> <strong>Samba Voyage</strong></div>
                                        <div style={styles.infoRow}><span>Zone:</span> <strong>{contratSelectionne.zone || 'Monde'}</strong></div>
                                        <button onClick={() => imprimerAttestation(contratSelectionne)} style={{...styles.btnActionAfa, marginTop: '15px'}}><FileText size={14}/> Imprimer l'Attestation</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {ongletActif === 'clients' && (
                    <div style={styles.dashboardSection}>
                        <h2>Répertoire Clients</h2>
                        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
                            <thead><tr style={{borderBottom: '2px solid #f1f5f9', textAlign: 'left', color: '#64748b', fontSize: '13px'}}><th style={{padding: '12px'}}>NOM DU CLIENT</th><th style={{padding: '12px'}}>DERNIÈRE POLICE</th><th style={{padding: '12px'}}>ACTION</th></tr></thead>
                            <tbody>
                                {listeClientsUnique.map((client, i) => (
                                    <tr key={i} style={{borderBottom: '1px solid #f8fafc'}}><td style={{padding: '12px', fontWeight: 'bold'}}>{client.nom}</td><td style={{padding: '12px', color: '#64748b'}}>{client.police}</td><td style={{padding: '12px'}}><button style={styles.linkButton}>Voir profil</button></td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {ongletActif === 'rapports' && (
                    <div>
                        <h2>Analyses & Rapports</h2>
                        <div style={styles.statsGrid}>
                            <div onClick={() => setGraphiqueAffiche(graphiqueAffiche === 'moyenne' ? null : 'moyenne')} style={{ ...styles.welcomeStatCard, flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', border: graphiqueAffiche === 'moyenne' ? '2px solid #8b5cf6' : '1px solid #e2e8f0' }}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px', width: '100%'}}>
                                    <div style={{...styles.iconCircle, background: '#f3e8ff'}}><BarChart3 color="#8b5cf6" /></div>
                                    <div><div style={styles.statLabel}>Moyenne / Contrat</div><div style={styles.statValue}>{(totalChiffreAffaire / (contrats.length || 1)).toLocaleString()} F</div></div>
                                </div>
                                {graphiqueAffiche === 'moyenne' && <div style={{width: '100%', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px'}}><svg viewBox="0 0 100 30" style={{width: '100%', height: '60px'}}><path d="M0,25 Q20,5 40,20 T80,10 T100,15" fill="none" stroke="#8b5cf6" strokeWidth="2" /></svg></div>}
                            </div>
                            <div onClick={() => setGraphiqueAffiche(graphiqueAffiche === 'sinistre' ? null : 'sinistre')} style={{ ...styles.welcomeStatCard, flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', border: graphiqueAffiche === 'sinistre' ? '2px solid #f59e0b' : '1px solid #e2e8f0' }}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px', width: '100%'}}>
                                    <div style={{...styles.iconCircle, background: '#fef3c7'}}><PieChart color="#f59e0b" /></div>
                                    <div><div style={styles.statLabel}>Taux de Sinistralité</div><div style={styles.statValue}>{((demandesAfa.length / (contrats.length || 1)) * 100).toFixed(1)} %</div></div>
                                </div>
                                {graphiqueAffiche === 'sinistre' && <div style={{width: '100%', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px'}}><svg viewBox="0 0 100 30" style={{width: '100%', height: '60px'}}><path d="M0,28 L20,10 L40,25 L60,5 L80,20 L100,15" fill="none" stroke="#f59e0b" strokeWidth="2" /></svg></div>}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    appLayout: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
    sidebar: { width: '260px', background: '#131519', color: 'white', padding: '20px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
    mainContent: { flex: 1, padding: '30px' },
    logoContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' },
    logoText: { color: 'white' },
    nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
    navItem: { padding: '12px', color: '#94a3b8', cursor: 'pointer', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
    navItemActive: { padding: '12px', color: '#fff', background: '#3b82f6', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' },
    welcomeStatCard: { background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' },
    statCardHover: { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderColor: '#3b82f6' },
    viewDetailText: { fontSize: '11px', color: '#3b82f6', marginTop: '5px', fontWeight: 'bold' },
    iconCircle: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' },
    statValue: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b' },
    afaSection: { background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #fee2e2', marginBottom: '30px' },
    afaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '15px', marginTop: '15px' },
    afaMiniCard: { background: '#f8fafc', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' },
    btnActionAfa: { width: '100%', background: '#fff', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' },
    badgeAlerte: { background: '#ef4444', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' },
    miniBadge: (statut) => ({ fontSize: '9px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#d97706' }),
    historySection: { background: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', marginTop: '30px' },
    historyTableContainer: { marginTop: '15px', overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    tableHeadRow: { borderBottom: '2px solid #f1f5f9', textAlign: 'left' },
    th: { padding: '12px', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' },
    tableRow: { borderBottom: '1px solid #f8fafc' },
    td: { padding: '12px', fontSize: '14px', color: '#1e293b' },
    btnView: { display: 'flex', alignItems: 'center', gap: '5px', background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#475569' },
    statusBadge: (statut) => {
        const s = (statut || "").trim().toUpperCase();
        let bg = '#dcfce7'; let co = '#15803d';
        if (s === 'EN_ATTENTE_SAMBA' || s === 'ATTENTE_AFA') { bg = '#e0f2fe'; co = '#0369a1'; }
        else if (s === 'REJETE' || s === 'REFUSE_AFA') { bg = '#fee2e2'; co = '#ef4444'; }
        return { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', background: bg, color: co };
    },
    sectionTitle: { fontSize: '15px', fontWeight: 'bold', marginBottom: '15px' },
    dashboardSection: { background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', marginTop: '20px' },
    topActionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    searchWrapper: { display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' },
    searchField: { border: 'none', outline: 'none' },
    folderGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
    folderCard: { background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' },
    linkButton: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' },
    infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' },
    btnNouvelleSouscription: { 
        background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px'
    }
};

export default ListeContrats;