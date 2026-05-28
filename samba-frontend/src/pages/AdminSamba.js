import React, { useEffect, useState } from 'react';
import logo from '../assets/samb-assurances.png';
import { 
  LayoutDashboard, FileCheck, AlertTriangle, 
  TrendingUp, Search, RefreshCw, ExternalLink, 
  BarChart3, PieChart, ArrowLeft, Users, Trash2, Edit2, Printer 
} from 'lucide-react';

const AdminSamba = () => {
  const [data, setData] = useState({
    contrats: [],
    sinistres: [],
    utilisateurs: [],
    stats: { totalCA: 0, totalContrats: 0, alertesAfa: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState('overview'); 
  const [selectedItem, setSelectedItem] = useState(null); 
  const [sourceView, setSourceView] = useState(''); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const paysCima = [
    "Bénin", "Burkina Faso", "Cameroun", "Centrafrique", "Comores", 
    "Congo", "Côte d'Ivoire", "Gabon", "Guinée Équatoriale", "Mali", 
    "Niger", "Sénégal", "Tchad", "Togo"
  ];

  // --- LOGIQUE DES ACTIONS ---
  const handleEdit = (item, type) => {
    setSourceView(type);
    setEditForm({ ...item });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...editForm, [name]: value };

    // Logique spécifique pour Zone / Destination
    if (name === 'zone') {
      if (value === "EUROPE (FRANCE UNIQUEMENT)") {
        newFormData.destination = "FRANCE";
      } else if (value === "ZONE CIMA (PAYS MEMBRES)") {
        newFormData.destination = paysCima[0]; // Par défaut le premier pays
      } else {
        newFormData.destination = ""; // Reset pour saisie libre
      }
    }
    
    setEditForm(newFormData);
  };

  const saveChanges = async (e) => {
    if(e) e.preventDefault();
    try {
      const url = sourceView === 'sinistres' 
        ? `https://sambavoyage.vercel.app/api/contrats/sinistres/${editForm.id}`
        : `https://sambavoyage.vercel.app/api/contrats/${editForm.id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        alert("Mise à jour réussie !");
        setIsEditModalOpen(false);
        fetchData();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Voulez-vous vraiment supprimer ce ${type === 'sinistres' ? 'sinistre' : 'contrat'} ?`)) {
      try {
        const url = type === 'sinistres' 
          ? `https://sambavoyage.vercel.app/api/contrats/sinistres/${id}`
          : `https://sambavoyage.vercel.app/api/contrats/${id}`;
          
        const res = await fetch(url, { method: 'DELETE' });
        if (res.ok) fetchData();
        else alert("Erreur lors de la suppression");
      } catch (err) { console.error(err); }
    }
  };

  const deletePartner = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) {
      try {
        const res = await fetch(`https://sambavoyage.vercel.app/api/auth/utilisateurs/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) fetchData();
      } catch (err) { console.error(err); }
    }
  };

  const getStatusStyle = (statut) => {
    const s = statut?.toUpperCase() || '';
    if (s.includes('APPROUVE')) return { bg: '#dcfce7', color: '#166534' };
    if (s.includes('REJETE')) return { bg: '#fee2e2', color: '#991b1b' };
    if (s.includes('ATTENTE') || s.includes('AFA')) return { bg: '#ffedd5', color: '#9a3412' };
    return { bg: '#dcfce7', color: '#166534' };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resC, resS, resU] = await Promise.all([
        fetch('https://sambavoyage.vercel.app/api/contrats/dashboard-agence'),
        fetch('https://sambavoyage.vercel.app/api/contrats/liste-sinistres'),
        fetch('https://sambavoyage.vercel.app/api/auth/utilisateurs')
      ]);
      const contrats = await resC.json();
      const sinistres = await resS.json();
      const utilisateurs = await resU.json();

      const cArr = Array.isArray(contrats) ? contrats : [];
      const sArr = Array.isArray(sinistres) ? sinistres : [];
      const uArr = Array.isArray(utilisateurs) ? utilisateurs : [];

      setData({
        contrats: cArr,
        sinistres: sArr,
        utilisateurs: uArr,
        stats: {
          totalCA: cArr.reduce((acc, c) => acc + Number(c.montant || c.prime || 0), 0),
          totalContrats: cArr.length,
          alertesAfa: sArr.filter(s => s.statut?.toUpperCase().includes('AFA')).length
        }
      });
    } catch (err) { console.error("Erreur API:", err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (val) => {
    setSelectedItem(null);
    setFilter(val);
    if(view === 'charts' || view === 'details') setView('contrats'); 
  };

  const handleAction = (item, type) => {
    setSelectedItem(item);
    setSourceView(type);
    setView('details');
  };

  // --- RENDU DE LA MODALE ---
  const renderEditModal = () => {
    if (!isEditModalOpen || !editForm) return null;
    const isSinistre = sourceView === 'sinistres';

    return (
      <div style={styles.modalOverlay}>
        <div style={{...styles.modalContent, width: isSinistre ? '400px' : '850px', maxHeight: '90vh', overflowY: 'auto'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <h3 style={{margin:0}}>{isSinistre ? 'Modifier le Sinistre' : 'Édition Rapide du Contrat'}</h3>
            <button onClick={() => setIsEditModalOpen(false)} style={{cursor:'pointer', border:'none', background:'none', fontSize:'24px'}}>&times;</button>
          </div>

          {!isSinistre ? (
            <div id="printable-contract">
              <div style={styles.contractPaper}>
                <input 
                    name="numero_police"
                    value={editForm.numero_police || ''}
                    onChange={handleInputChange}
                    style={{...styles.policeNumber, ...styles.inputInvisible, textAlign:'right'}}
                />
                
                <div style={{textAlign: 'center', marginBottom: '25px'}}>
                  <img src={logo} alt="Logo" style={{height: '50px'}} />
                  <h2 style={{margin: '5px 0', fontSize: '18px'}}>CONTRAT ASSURANCE VOYAGE : SAMBA VOYAGE</h2>
                  <p style={{fontSize: '10px', margin: 0}}>Régit par le Code des assurances CIMA</p>
                  <h3 style={{textDecoration: 'underline', marginTop: '10px', fontSize: '14px'}}>CONDITIONS PARTICULIERES</h3>
                </div>

                <table style={styles.contractTable}>
                  <tbody>
                    <tr>
                      <td rowSpan="3" style={{...styles.contractTd, ...styles.contractLabel, textAlign:'center'}}>Couverture</td>
                      <td style={styles.contractTd}>Zone :</td>
                      <td style={styles.contractTd}>
                        <select 
                          name="zone" 
                          value={editForm.zone || 'MONDE ENTIER (HORS USA/CANADA)'} 
                          onChange={handleInputChange}
                          style={{...styles.inputInvisible, fontWeight:'bold', color: '#1e293b', cursor: 'pointer', width: '100%'}}
                        >
                          <option value="MONDE ENTIER (HORS USA/CANADA)">AFRIQUE / EUROPE</option>
                          <option value="ZONE CIMA (PAYS MEMBRES)">CIMA</option>
                          <option value="EUROPE (FRANCE UNIQUEMENT)">EUROPE</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.contractTd}>Pays de destination :</td>
                      <td style={styles.contractTd}>
                        {editForm.zone === "ZONE CIMA (PAYS MEMBRES)" ? (
                          <select 
                            name="destination"
                            value={editForm.destination || ''}
                            onChange={handleInputChange}
                            style={{...styles.inputInvisible, fontWeight:'bold', width: '100%', cursor: 'pointer'}}
                          >
                            {paysCima.map(p => <option key={p} value={p.toUpperCase()}>{p.toUpperCase()}</option>)}
                          </select>
                        ) : (
                          <input 
                              name="destination"
                              value={editForm.destination || ''}
                              onChange={handleInputChange}
                              disabled={editForm.zone === "EUROPE (FRANCE UNIQUEMENT)"}
                              style={{...styles.inputInvisible, fontWeight:'bold', width: '100%'}}
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.contractTd}>Période :</td>
                      <td style={styles.contractTd}>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                          Du <input type="date" name="date_effet" value={editForm.date_effet?.split('T')[0] || ''} onChange={handleInputChange} style={styles.inputInvisible} /> 
                          au <input type="date" name="date_echeance" value={editForm.date_echeance?.split('T')[0] || ''} onChange={handleInputChange} style={styles.inputInvisible} />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td rowSpan="3" style={{...styles.contractTd, ...styles.contractLabel, textAlign:'center'}}>Souscripteur</td>
                      <td style={styles.contractTd}>Nom et Prénom :</td>
                      <td style={styles.contractTd}>
                        <input 
                            name="souscripteur_nom"
                            value={editForm.souscripteur_nom || editForm.nom_client || ''}
                            onChange={handleInputChange}
                            style={{...styles.inputInvisible, fontWeight:'bold'}}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.contractTd}>N° Passeport :</td>
                      <td style={styles.contractTd}>
                        <input 
                            name="passeport"
                            value={editForm.passeport || ''}
                            onChange={handleInputChange}
                            style={{...styles.inputInvisible, fontWeight:'bold'}}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.contractTd}>Statut Contrat :</td>
                      <td style={styles.contractTd}>
                        <select name="statut" value={editForm.statut || 'VALIDE'} onChange={handleInputChange} style={{...styles.inputInvisible, color: '#10b981', fontWeight: 'bold'}}>
                           <option value="VALIDE">VALIDÉ</option>
                           <option value="ANNULE">ANNULÉ</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                        <td style={{...styles.contractTd, ...styles.contractLabel, textAlign:'center'}}>Prestataire</td>
                        <td style={styles.contractTd}>Assistance :</td>
                        <td style={styles.contractTd}><strong>PREMIERE ASSISTANCE AFRICAINE (AFA)</strong></td>
                    </tr>
                    <tr>
                      <td style={{...styles.contractTd, ...styles.contractLabel, textAlign:'center'}}>Cotisations</td>
                      <td style={styles.contractTd}>Total TTC :</td>
                      <td style={styles.contractTd}>
                        <div style={{display:'flex', alignItems:'center', gap:'5px'}}>
                            <input 
                                type="number"
                                name="montant"
                                value={editForm.montant || editForm.prime || 0}
                                onChange={handleInputChange}
                                style={{...styles.inputInvisible, fontWeight:'bold', width:'100px'}}
                            /> 
                            <strong>FCFA</strong>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '12px', fontWeight: 'bold'}}>Le Souscripteur</p>
                    <div style={{width: '120px', height: '50px', border: '1px solid #eee'}}></div>
                  </div>
                  <div style={{textAlign: 'center'}}>
                    <p style={{fontSize: '12px', fontWeight: 'bold'}}>L'Assureur</p>
                    <div style={{width: '120px', height: '50px', border: '1px solid #eee'}}></div>
                  </div>
                </div>
              </div>
              
              <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
                <button onClick={saveChanges} style={{...styles.saveBtn, background: '#10b981'}}>Enregistrer les modifications</button>
                <button onClick={() => window.print()} style={{...styles.saveBtn, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
                  <Printer size={18}/> Imprimer
                </button>
                <button onClick={() => setIsEditModalOpen(false)} style={styles.cancelBtn}>Fermer</button>
              </div>
            </div>
          ) : (
            <form onSubmit={saveChanges} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              <div>
                <label style={styles.modalLabel}>Nom du Client</label>
                <input style={styles.modalInput} name="nom_client" value={editForm.nom_client || ''} onChange={handleInputChange} />
              </div>
              <div>
                <label style={styles.modalLabel}>Statut du dossier</label>
                <select style={styles.modalInput} name="statut" value={editForm.statut || ''} onChange={handleInputChange}>
                  <option value="APPROUVE">APPROUVE</option>
                  <option value="EN ATTENTE">EN ATTENTE</option>
                  <option value="AFA">AFA</option>
                  <option value="REJETE">REJETE</option>
                </select>
              </div>
              <div>
                <label style={styles.modalLabel}>Justification / Description</label>
                <textarea 
                  style={{...styles.modalInput, height: '80px', resize:'none'}} 
                  name="description" 
                  value={editForm.description || ''} 
                  onChange={handleInputChange}
                  placeholder="Expliquez la décision..."
                />
              </div>
              <div style={{display:'flex', gap:'10px'}}>
                <button type="submit" style={styles.saveBtn}>Sauvegarder</button>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={styles.cancelBtn}>Annuler</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    const isSinistre = sourceView === 'sinistres';
    const statusStyle = getStatusStyle(selectedItem?.statut);
    
    return (
      <div style={styles.tableSection}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', borderBottom:'1px solid #f1f5f9', paddingBottom:'15px'}}>
          <h3 style={{margin:0}}>Détails du {isSinistre ? 'Sinistre' : 'Dossier'}</h3>
          <button onClick={() => setView(sourceView || 'contrats')} style={styles.backBtn}><ArrowLeft size={16}/> Retour</button>
        </div>
        <div style={styles.detailsGridReal}>
          <div style={styles.detailBox}>
            <span style={styles.detailLabel}>Client / Assuré</span>
            <strong style={styles.detailValue}>{selectedItem?.souscripteur_nom || selectedItem?.nom_client || 'N/A'}</strong>
          </div>
          <div style={styles.detailBox}>
            <span style={styles.detailLabel}>Référence</span>
            <strong style={styles.detailValue}>#{selectedItem?.numero_police || selectedItem?.id}</strong>
          </div>
          {isSinistre ? (
            <>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Date de survenance</span>
                <strong style={styles.detailValue}>{selectedItem?.date_sinistre || 'Non renseignée'}</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Cause / Nature</span>
                <strong style={styles.detailValue}>{selectedItem?.cause || selectedItem?.nature || 'Inconnue'}</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Estimation Dommages</span>
                <strong style={{...styles.detailValue, color:'#ef4444'}}>{Number(selectedItem?.montant_estime || 0).toLocaleString()} F</strong>
              </div>
            </>
          ) : (
            <>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Destination</span>
                <strong style={styles.detailValue}>{selectedItem?.destination || 'Non spécifiée'}</strong>
              </div>
              <div style={styles.detailBox}>
                <span style={styles.detailLabel}>Montant de la Prime</span>
                <strong style={{...styles.detailValue, color:'#10b981'}}>{Number(selectedItem?.montant || selectedItem?.prime || 0).toLocaleString()} F</strong>
              </div>
            </>
          )}
          <div style={styles.detailBox}>
            <span style={styles.detailLabel}>Statut Dossier</span>
            <span style={{
              ...styles.typeTagC, 
              background: isSinistre ? statusStyle.bg : '#e0e7ff', 
              color: isSinistre ? statusStyle.color : '#0fa674'
            }}>
              {selectedItem?.statut || 'VALIDE'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderStatsChart = () => {
    const maxVal = Math.max(...data.contrats.map(c => Number(c.montant || 0)), 1);
    return (
      <div style={styles.chartContainer}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
          <h3>Analyse du Chiffre d'Affaires par Police</h3>
          <button onClick={() => setView('overview')} style={styles.backBtn}><ArrowLeft size={16}/> Retour</button>
        </div>
        <div style={styles.barGrid}>
          {data.contrats.slice(0, 10).map((c, i) => (
            <div key={`chart-${i}`} style={styles.barWrapper}>
              <div style={{...styles.bar, height: `${(Number(c.montant || 0) / maxVal) * 200}px`}}>
                <span style={styles.barTooltip}>{Number(c.montant || 0).toLocaleString()} F</span>
              </div>
              <span style={styles.barLabel}>#{c.id || i}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentItems = view === 'sinistres' ? data.sinistres : view === 'partenaires' ? data.utilisateurs : data.contrats;
  const filteredItems = currentItems.filter(item => {
    const searchStr = `${item.souscripteur_nom || item.nom_client || item.nom_complet || ''} ${item.numero_police || item.email || ''} ${item.statut || ''}`.toLowerCase();
    return searchStr.includes(filter.toLowerCase());
  });

  return (
    <div style={styles.container}>
      {renderEditModal()}
      <aside style={styles.sidebar}>
        <div onClick={() => { setView('overview'); setFilter(''); setSelectedItem(null); }} style={{ cursor: 'pointer', marginBottom: '40px' }}>
          <img src={logo} alt="Samba Assurances" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
        <nav style={styles.nav}>
          <button onClick={() => { setView('overview'); setFilter(''); setSelectedItem(null); }} style={view === 'overview' ? styles.navActive : styles.navBtn}>
            <LayoutDashboard size={20}/> Vue Globale
          </button>
          <button onClick={() => { setView('contrats'); setFilter(''); setSelectedItem(null); }} style={view === 'contrats' || (view === 'details' && sourceView === 'contrats') ? styles.navActive : styles.navBtn}>
            <FileCheck size={20}/> Contrats
          </button>
          <button onClick={() => { setView('sinistres'); setFilter(''); setSelectedItem(null); }} style={view === 'sinistres' || (view === 'details' && sourceView === 'sinistres') ? styles.navActive : styles.navBtn}>
            <AlertTriangle size={20}/> Sinistres
          </button>
          <button onClick={() => { setView('partenaires'); setFilter(''); setSelectedItem(null); }} style={view === 'partenaires' ? styles.navActive : styles.navBtn}>
            <Users size={20}/> Partenaires
          </button>
        </nav>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.searchGroup}>
            <Search size={18} color="#94a3b8"/>
            <input placeholder="Rechercher..." style={styles.input} value={filter} onChange={(e) => handleSearch(e.target.value)} />
          </div>
          <button onClick={fetchData} style={styles.refreshBtn}><RefreshCw size={16}/> Actualiser</button>
        </header>

        <div style={styles.gridStats}>
          <div onClick={() => setView('charts')} style={{...styles.statCard, borderLeft: '5px solid #10b981', cursor:'pointer'}}>
            <div style={{...styles.iconWrapper, background: '#ecfdf5'}}><TrendingUp color="#10b981"/></div>
            <div>
              <div style={styles.statTitle}>Chiffre d'Affaires</div>
              <div style={styles.statValue}>{data.stats.totalCA.toLocaleString()} F</div>
            </div>
          </div>
          <div onClick={() => setView('contrats')} style={{...styles.statCard, borderLeft: '5px solid #3b82f6', cursor:'pointer'}}>
            <div style={{...styles.iconWrapper, background: '#eff6ff'}}><FileCheck color="#3b82f6"/></div>
            <div><div style={styles.statTitle}>Polices Actives</div><div style={styles.statValue}>{data.stats.totalContrats}</div></div>
          </div>
          <div onClick={() => { setView('sinistres'); setFilter('AFA'); }} style={{...styles.statCard, borderLeft: '5px solid #ef4444', cursor:'pointer'}}>
            <div style={{...styles.iconWrapper, background: '#fff1f2'}}><AlertTriangle color="#ef4444"/></div>
            <div><div style={styles.statTitle}>Alertes Sinistres</div><div style={styles.statValue}>{data.stats.alertesAfa}</div></div>
          </div>
        </div>

        <div key={view}>
          {view === 'overview' ? (
            <div style={styles.dashboardHome}>
              <div style={styles.statsGrid}>
                <div onClick={() => setView('charts')} style={{...styles.card, cursor:'pointer', border:'1px solid #6366f1'}}>
                  <div style={styles.cardHeader}><BarChart3 size={18} color="#6366f1"/> <h4>Performance</h4></div>
                  <div style={styles.statLine}><span>Sinistralité:</span> <strong>{data.stats.totalContrats > 0 ? ((data.sinistres.length / data.stats.totalContrats) * 100).toFixed(1) : 0}%</strong></div>
                </div>
                <div onClick={() => { setView('sinistres'); setFilter('AFA'); }} style={{...styles.card, cursor:'pointer', border:'1px solid #f59e0b'}}>
                  <div style={styles.cardHeader}><PieChart size={18} color="#ec4899"/> <h4>Alertes</h4></div>
                  <div style={styles.statLine}><span>Dossiers AFA:</span> <strong style={{color:'#f59e0b'}}>{data.stats.alertesAfa}</strong></div>
                </div>
              </div>
              <section style={{...styles.tableSection, marginTop: '20px'}}>
                <h4 style={{marginBottom:'15px'}}>Derniers Mouvements</h4>
                <table style={styles.table}>
                  <tbody>
                    {data.contrats.slice(0, 5).map((c, i) => (
                      <tr key={`h-${i}`} style={styles.tr}>
                        <td style={styles.td}><span style={styles.typeTagC}>CONTRAT</span></td>
                        <td style={styles.td}>{c.numero_police || c.id}</td>
                        <td style={{...styles.td, fontWeight:'bold'}}>{Number(c.montant || 0).toLocaleString()} F</td>
                        <td style={styles.td}><button onClick={() => handleAction(c, 'contrats')} style={styles.actionIcon}><ExternalLink size={14}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            </div>
          ) : view === 'charts' ? (
            <section style={styles.tableSection}>{renderStatsChart()}</section>
          ) : view === 'details' ? (
            renderDetails()
          ) : view === 'partenaires' ? (
            <section style={styles.tableSection}>
              <h3 style={{marginBottom:'15px'}}>Liste des Partenaires</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nom</th><th style={styles.th}>Email</th><th style={styles.th}>Rôle</th><th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((u, i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}><strong>{u.nom_complet}</strong></td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}><span style={{...styles.typeTagC, background: '#e0e7ff', color: '#3730a3'}}>{u.role?.toUpperCase()}</span></td>
                      <td style={styles.td}>
                        <button onClick={() => deletePartner(u.id)} style={{...styles.actionIcon, color: '#ef4444'}}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            <section style={styles.tableSection}>
              <h3 style={{marginBottom:'15px', textTransform:'capitalize'}}>{view}</h3>
              <table style={styles.table}>
                <thead>
                  <tr><th style={styles.th}>Réf</th><th style={styles.th}>Client</th><th style={styles.th}>Montant/Statut</th><th style={styles.th}>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => {
                    const statusStyle = view === 'sinistres' ? getStatusStyle(item.statut) : null;
                    return (
                      <tr key={idx} style={styles.tr}>
                        <td style={styles.td}><strong>#{item.id || item.numero_police}</strong></td>
                        <td style={styles.td}>{item.souscripteur_nom || item.nom_client}</td>
                        <td style={styles.td}>
                          {view === 'sinistres' ? (
                            <span style={{...styles.typeTagC, background: statusStyle.bg, color: statusStyle.color}}>{item.statut}</span>
                          ) : (
                            `${Number(item.montant || 0).toLocaleString()} F`
                          )}
                        </td>
                        <td style={{...styles.td, display:'flex', gap:'8px'}}>
                          <button onClick={() => handleAction(item, view)} style={styles.actionIcon} title="Détails"><ExternalLink size={16}/></button>
                          <button onClick={() => handleEdit(item, view)} style={{...styles.actionIcon, color: '#f59e0b'}} title="Modifier"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(item.id, view)} style={{...styles.actionIcon, color: '#ef4444'}} title="Supprimer"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' },
  sidebar: { width: '260px', background: '#0b0b0b', color: 'white', padding: '30px 20px', minHeight: '100vh' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navBtn: { display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', color: '#94a3b8', padding: '12px', cursor: 'pointer', borderRadius: '8px', width: '100%', textAlign: 'left' },
  navActive: { display: 'flex', alignItems: 'center', gap: '12px', background: '#3b82f6', border: 'none', color: 'white', padding: '12px', cursor: 'pointer', borderRadius: '8px', width: '100%', fontWeight: '600' },
  main: { flex: 1, padding: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
  searchGroup: { display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '400px' },
  input: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
  refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer' },
  gridStats: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  iconWrapper: { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statTitle: { fontSize: '12px', color: '#64748b', fontWeight: 'bold' },
  statValue: { fontSize: '18px', fontWeight: 'bold', color: '#1e293b' },
  tableSection: { background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px', borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f8fafc' },
  td: { padding: '12px', fontSize: '13px', color: '#334155' },
  actionIcon: { background: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '6px', cursor: 'pointer', color: '#3b82f6' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' },
  card: { background: 'white', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' },
  statLine: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#475569' },
  typeTagC: { padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' },
  chartContainer: { padding: '10px' },
  barGrid: { display: 'flex', alignItems: 'flex-end', gap: '15px', height: '250px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' },
  barWrapper: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  bar: { width: '100%', background: 'linear-gradient(to top, #10b981, #34d399)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease', cursor: 'pointer' },
  barLabel: { fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' },
  barTooltip: { position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', background: '#1e293b', color: 'white', padding: '2px 5px', borderRadius: '4px', whiteSpace: 'nowrap' },
  backBtn: { display:'flex', alignItems:'center', gap:'5px', background:'#f1f5f9', border:'none', padding:'8px 15px', borderRadius:'8px', cursor:'pointer', fontSize:'12px'},
  detailsGridReal: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '10px' },
  detailBox: { display: 'flex', flexDirection: 'column', gap: '5px', padding: '15px', background: '#f8fafc', borderRadius: '10px' },
  detailLabel: { fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' },
  detailValue: { fontSize: '14px', color: '#1e293b' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalLabel: { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', color: '#475569' },
  modalInput: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' },
  saveBtn: { padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  contractPaper: { background: 'white', padding: '40px', border: '1px solid #e2e8f0', color: '#1e293b', position: 'relative' },
  policeNumber: { position: 'absolute', top: '20px', right: '40px', fontSize: '14px', fontWeight: 'bold', color: '#ef4444' },
  contractTable: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  contractTd: { border: '1px solid #000', padding: '8px', fontSize: '12px', verticalAlign: 'middle' },
  contractLabel: { background: '#f8fafc', fontWeight: 'bold', width: '100px' },
  inputInvisible: { border: 'none', outline: 'none', background: 'transparent', padding: '2px', fontFamily: 'inherit', fontSize: 'inherit' }
  
};

export default AdminSamba;