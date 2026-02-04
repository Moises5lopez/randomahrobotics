
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Fair, 
  ActivityType, 
  Activity, 
  Material, 
  Contact, 
  ContactCategory,
  GovernmentRequirement,
  SocialPost
} from './types';
import { 
  INITIAL_FEASIBILITY_STEPS,
  TRANSLATIONS,
  ACTIVITY_LIBRARY,
  MATERIAL_LIBRARY
} from './constants';
import { 
  Database, Plus, Trash2, ChevronRight, MapPin, ArrowLeft, X, Globe, DollarSign, 
  Briefcase, CheckSquare, Square, MessageCircle, Smartphone, Zap, Package, 
  Search, FileText, PieChart as PieChartIcon, Maximize, Users, 
  TrendingUp, Upload, Info, ShieldAlert, Library, Truck, UserCircle, Landmark, Scale, BrainCircuit, Share2, Instagram, Facebook, Twitter, Copy, Check, Sparkles, Menu
} from 'lucide-react';

type Language = 'en' | 'es';

// --- Utility Components ---

const ActivityCard: React.FC<{ activity: Activity; fair: Fair; updateFair: (f: Fair) => void; contacts: Contact[] }> = ({ activity, fair, updateFair, contacts }) => (
  <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-lg shadow-slate-200/50 group hover:shadow-violet-200/40 transition-all relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4">
      <button onClick={() => updateFair({...fair, activities: fair.activities.filter(a => a.id !== activity.id)})} className="text-slate-200 hover:text-red-500 transition-colors">
        <Trash2 size={20}/>
      </button>
    </div>
    <div className="mb-4">
      <span className="text-[9px] font-black uppercase px-3 py-1 bg-violet-50 rounded-full text-violet-600 tracking-widest">{activity.category}</span>
    </div>
    <input 
      className="w-full text-2xl font-bold outline-none bg-transparent mb-2 font-lora tracking-tight text-slate-800" 
      value={activity.name}
      onChange={(e) => {
        const acts = fair.activities.map(a => a.id === activity.id ? {...a, name: e.target.value} : a);
        updateFair({...fair, activities: acts});
      }}
    />
    <textarea 
      className="w-full text-sm text-slate-400 bg-transparent outline-none resize-none mb-6 font-medium leading-relaxed"
      rows={2}
      placeholder="Descripción..."
      value={activity.description}
      onChange={(e) => {
        const acts = fair.activities.map(a => a.id === activity.id ? {...a, description: e.target.value} : a);
        updateFair({...fair, activities: acts});
      }}
    />
    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
      <div>
        <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Inversión</label>
        <div className="flex items-center gap-1 font-mono font-bold text-violet-600 text-xl">
          <DollarSign size={16}/>
          <input 
            type="number"
            className="w-full bg-transparent border-none outline-none"
            value={activity.cost}
            onChange={(e) => {
              const acts = fair.activities.map(a => a.id === activity.id ? {...a, cost: Number(e.target.value)} : a);
              updateFair({...fair, activities: acts});
            }}
          />
        </div>
      </div>
      <div>
        <label className="text-[9px] font-black uppercase text-slate-400 mb-1 block">Personal Req.</label>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-violet-300"/>
          <input 
            type="number"
            className="w-full bg-slate-50 p-2 rounded-xl text-center font-bold text-slate-700"
            value={activity.staffRequired}
            onChange={(e) => {
              const acts = fair.activities.map(a => a.id === activity.id ? {...a, staffRequired: Number(e.target.value)} : a);
              updateFair({...fair, activities: acts});
            }}
          />
        </div>
      </div>
    </div>
    <div className="mt-6">
      <select 
        className="w-full p-3 bg-slate-50 border-none outline-none rounded-2xl text-[11px] font-bold text-slate-600 shadow-inner"
        value={activity.contactId || ''}
        onChange={(e) => {
          const acts = fair.activities.map(a => a.id === activity.id ? {...a, contactId: e.target.value} : a);
          updateFair({...fair, activities: acts});
        }}
      >
        <option value="">Asignar Responsable...</option>
        {contacts.map(c => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
      </select>
    </div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [fairs, setFairs] = useState<Fair[]>([]);
  const [selectedFairId, setSelectedFairId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('feasibility');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSearchingPop, setIsSearchingPop] = useState(false);
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);
  const [isAnalyzingFeasibility, setIsAnalyzingFeasibility] = useState(false);
  const [aiFeasibilityReport, setAiFeasibilityReport] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [townVerifyStatus, setTownVerifyStatus] = useState<'idle' | 'verifying'>('idle');
  
  const t = TRANSLATIONS[lang];
  const currentFair = useMemo(() => fairs.find(f => f.id === selectedFairId), [fairs, selectedFairId]);
  const today = new Date().toISOString().split('T')[0];

  const updateFair = (updated: Fair) => {
    setFairs(fairs.map(f => f.id === updated.id ? updated : f));
  };

  const searchTownPopulation = async () => {
    if (!currentFair) return;
    setIsSearchingPop(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `What is the approximate current population of the town of "${currentFair.town}" in ${currentFair.country}? Respond with ONLY the numeric value.`,
      });
      const pop = response.text.trim().replace(/[^0-9]/g, '');
      updateFair({ ...currentFair, population: pop });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingPop(false);
    }
  };

  const analyzeFeasibility = async () => {
    if (!currentFair) return;
    setIsAnalyzingFeasibility(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analiza la factibilidad para "${currentFair.title}" en ${currentFair.town}, ${currentFair.country}.`,
      });
      setAiFeasibilityReport(response.text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingFeasibility(false);
    }
  };

  const generateSocialPosts = async () => {
    if (!currentFair) return;
    setIsGeneratingSocial(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Genera 3 posts para Instagram/X sobre la feria "${currentFair.title}" en ${currentFair.town}.`,
      });
      
      const newPost: SocialPost = {
        id: Date.now().toString(),
        platform: 'Instagram',
        content: response.text,
        suggestedHashtags: ['archaeology', 'heritage', 'fair'],
        status: 'Draft'
      };
      updateFair({ ...currentFair, socialPosts: [...currentFair.socialPosts, newPost] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  const handleCreateFair = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const town = formData.get('town') as string;
    const country = formData.get('country') as string;
    const date = formData.get('date') as string;
    
    if (date < today) {
      alert(lang === 'es' ? 'La fecha debe ser hoy o futura.' : 'Date must be today or future.');
      return;
    }

    setTownVerifyStatus('verifying');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const verifyRes = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Does the city "${town}" in ${country} exist? Answer ONLY YES or NO.`
      });
      if (!verifyRes.text.includes('YES')) {
        alert(`${town} in ${country} seems invalid.`);
        setTownVerifyStatus('idle');
        return;
      }
    } catch (err) { console.warn("AI Skip"); }

    const newFair: Fair = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      town: town,
      country: country,
      date: date,
      feasibilitySteps: INITIAL_FEASIBILITY_STEPS.map((step, i) => ({ id: `step-${i}`, description: step, completed: false })),
      activities: [],
      materials: [],
      contacts: [],
      govRequirements: [],
      socialPosts: [],
      budget: { totalEstimated: 0, totalActual: 0 }
    };
    
    setFairs([...fairs, newFair]);
    setShowCreateModal(false);
    setSelectedFairId(newFair.id);
    setTownVerifyStatus('idle');
  };

  const totals = useMemo(() => {
    if (!currentFair) return { cost: 0, staff: 0 };
    const cost = currentFair.activities.reduce((s, a) => s + a.cost, 0) + 
                 currentFair.materials.reduce((s, m) => s + m.actualCost, 0);
    const staff = currentFair.activities.reduce((s, a) => s + a.staffRequired, 0) + 
                  currentFair.materials.reduce((s, m) => s + m.staffRequired, 0);
    return { cost, staff };
  }, [currentFair]);

  const rawProjection = useMemo(() => {
    if (!currentFair || !currentFair.population) return 0;
    const pop = parseInt(currentFair.population.replace(/\D/g, '')) || 5000;
    return Math.floor(pop * 0.05);
  }, [currentFair]);

  const addActivity = (template?: Partial<Activity>) => {
    if (!currentFair) return;
    const newItem: Activity = {
      id: Date.now().toString(),
      name: template?.name || 'Nueva Actividad',
      category: template?.category || ActivityType.CUSTOM,
      description: template?.description || '',
      materialIds: [],
      notes: '',
      cost: template?.cost || 0,
      staffRequired: template?.staffRequired || 1
    };
    updateFair({ ...currentFair, activities: [...currentFair.activities, newItem] });
  };

  const addMaterial = (template?: Partial<Material>) => {
    if (!currentFair) return;
    const newItem: Material = {
      id: Date.now().toString(),
      name: template?.name || 'Nuevo Material',
      description: '',
      isReusable: template?.isReusable || true,
      type: template?.type || 'Rent',
      estimatedCost: template?.estimatedCost || 0,
      actualCost: 0,
      notes: '',
      staffRequired: template?.staffRequired || 0
    };
    updateFair({ ...currentFair, materials: [...currentFair.materials, newItem] });
  };

  if (!selectedFairId || !currentFair) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Echoes Archive</h1>
            <p className="text-slate-400 text-xs mt-1 font-medium">
              Founded by <span className="text-violet-600 font-bold">Mateo, Yamil, Marco, Ricardo, Eduardo & Ana</span>
            </p>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all">
            {lang.toUpperCase()}
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <button onClick={() => setShowCreateModal(true)} className="h-64 border-2 border-dashed border-slate-200 rounded-[40px] hover:bg-white hover:border-violet-300 flex flex-col items-center justify-center gap-4 text-slate-300 transition-all group">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors shadow-sm">
              <Plus size={32} />
            </div>
            <span className="font-bold text-slate-400 group-hover:text-violet-500">{t.createFair}</span>
          </button>
          {fairs.map(fair => (
            <div key={fair.id} onClick={() => setSelectedFairId(fair.id)} className="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100 cursor-pointer hover:shadow-violet-200/50 transition-all group relative overflow-hidden">
              <div className="flex justify-between mb-6 text-slate-400 text-[10px] font-black uppercase tracking-widest relative z-10">
                <span className="flex items-center gap-1"><MapPin size={12} className="text-violet-400"/> {fair.town}, {fair.country}</span>
                <span>{fair.date}</span>
              </div>
              <h3 className="text-2xl font-bold mb-8 group-hover:text-violet-600 transition-colors relative z-10">{fair.title}</h3>
              <div className="flex items-center gap-2 text-violet-600 font-black text-[10px] uppercase tracking-tighter relative z-10">
                {t.viewFair} <ChevronRight size={14}/>
              </div>
            </div>
          ))}
        </section>

        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6">
            <div className="bg-white rounded-t-[40px] md:rounded-[40px] p-10 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-bold font-lora">{t.createFair}</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>
              <form onSubmit={handleCreateFair} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">{t.title}</label>
                  <input name="title" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-violet-500 font-medium" placeholder="Ej: Rescate Arqueológico Copán" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">{t.town}</label>
                    <input name="town" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-violet-500 font-medium" placeholder="San Pedro" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">{t.country}</label>
                    <input name="country" required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-violet-500 font-medium" placeholder="Honduras" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">{t.date}</label>
                  <input name="date" type="date" min={today} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 ring-violet-500" />
                </div>
                <button 
                  type="submit" 
                  disabled={townVerifyStatus === 'verifying'}
                  className="w-full py-5 bg-violet-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-violet-200 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 hover:bg-violet-700 transition-all"
                >
                  {townVerifyStatus === 'verifying' ? <Zap className="animate-spin" size={20}/> : <Sparkles size={20}/>}
                  {t.save}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* PC Sidebar */}
      <aside className="hidden md:flex w-80 bg-white border-r border-slate-100 h-screen sticky top-0 flex-col p-8">
        <div className="mb-12 flex items-center gap-4">
          <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-100"><Database size={24}/></div>
          <div><h4 className="font-bold text-lg truncate w-44 font-lora">{currentFair.title}</h4><p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{currentFair.town}, {currentFair.country}</p></div>
        </div>
        <nav className="flex-1 space-y-2">
          <PcNavItem active={activeTab === 'feasibility'} onClick={() => setActiveTab('feasibility')} icon={<BrainCircuit size={20}/>} label={t.feasibility} />
          <PcNavItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<DollarSign size={20}/>} label={t.finance} />
          <PcNavItem active={activeTab === 'activities'} onClick={() => setActiveTab('activities')} icon={<Zap size={20}/>} label={t.activities} />
          <PcNavItem active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon={<Package size={20}/>} label={t.materials} />
          <PcNavItem active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} icon={<Users size={20}/>} label={t.contacts} />
          <PcNavItem active={activeTab === 'socialMedia'} onClick={() => setActiveTab('socialMedia')} icon={<Share2 size={20}/>} label={t.socialMedia} />
        </nav>
        <button onClick={() => setSelectedFairId(null)} className="flex items-center gap-3 text-slate-300 font-black text-xs uppercase tracking-widest mt-8 hover:text-violet-600 transition-all"><ArrowLeft size={16}/> {t.back}</button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-100 z-50 flex shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex-1 flex gap-2 p-3 items-center min-w-max">
          <MobileNavItem active={activeTab === 'feasibility'} onClick={() => setActiveTab('feasibility')} icon={<BrainCircuit size={20}/>} />
          <MobileNavItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<DollarSign size={20}/>} />
          <MobileNavItem active={activeTab === 'activities'} onClick={() => setActiveTab('activities')} icon={<Zap size={20}/>} />
          <MobileNavItem active={activeTab === 'materials'} onClick={() => setActiveTab('materials')} icon={<Package size={20}/>} />
          <MobileNavItem active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} icon={<Users size={20}/>} />
          <MobileNavItem active={activeTab === 'socialMedia'} onClick={() => setActiveTab('socialMedia')} icon={<Share2 size={20}/>} />
          <button onClick={() => setSelectedFairId(null)} className="p-4 text-slate-300"><ArrowLeft size={20}/></button>
        </div>
      </nav>

      <main className="flex-1 p-6 md:p-16 max-w-7xl mx-auto pb-32 md:pb-16 w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="text-[10px] font-black uppercase text-violet-500 tracking-[0.2em] mb-2 block">Echoes Planner</span>
            <h2 className="text-4xl md:text-5xl font-bold font-lora tracking-tight text-slate-900">{t[activeTab as keyof typeof t] || activeTab}</h2>
          </div>
          <button onClick={() => setShowLibrary(!showLibrary)} className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"><Library size={20}/> <span className="hidden md:inline">{t.library}</span></button>
        </header>

        {activeTab === 'feasibility' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-2xl font-bold mb-6 font-lora">Pasos de Factibilidad</h3>
                <div className="space-y-4">
                  {currentFair.feasibilitySteps.map(step => (
                    <div key={step.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer" onClick={() => {
                      const steps = currentFair.feasibilitySteps.map(s => s.id === step.id ? {...s, completed: !s.completed} : s);
                      updateFair({...currentFair, feasibilitySteps: steps});
                    }}>
                      <div className={step.completed ? 'text-violet-600' : 'text-slate-300'}>
                        {step.completed ? <CheckSquare size={24}/> : <Square size={24}/>}
                      </div>
                      <span className={`font-medium ${step.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{step.description}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold font-lora">Análisis IA</h3>
                  <button onClick={analyzeFeasibility} disabled={isAnalyzingFeasibility} className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-600 rounded-xl font-bold hover:bg-violet-200 transition-all">
                    {isAnalyzingFeasibility ? <Zap className="animate-spin" size={16}/> : <BrainCircuit size={16}/>}
                    {t.analyzing}
                  </button>
                </div>
                <div className="flex-1 bg-slate-50 rounded-3xl p-6 overflow-y-auto max-h-[400px]">
                  {aiFeasibilityReport ? <div className="prose prose-slate text-sm leading-relaxed whitespace-pre-wrap">{aiFeasibilityReport}</div> : <p className="text-slate-400 text-center py-10">Inicia análisis IA para ver resultados.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-violet-900 to-violet-950 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                <div>
                  <p className="text-violet-300 text-[10px] font-black uppercase mb-4 tracking-widest">Población & Meta</p>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 font-lora">{currentFair.town}</h3>
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-2xl font-black font-mono text-teal-400">{currentFair.population || '---'}</p>
                    </div>
                    <button onClick={() => searchTownPopulation()} disabled={isSearchingPop} className="p-4 bg-violet-800 rounded-2xl hover:bg-violet-700 transition-all border border-white/10">
                      {isSearchingPop ? <Zap className="animate-spin" size={24}/> : <Search size={24}/>}
                    </button>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-[10px] text-violet-200 font-bold uppercase mb-2">Impacto Proyectado</p>
                  <p className="text-6xl md:text-7xl font-black font-mono text-teal-400">{rawProjection}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Inversión Estimada</p>
                  <p className="text-5xl md:text-6xl font-black font-mono text-slate-900">${totals.cost.toLocaleString()}</p>
                  <div className="mt-10 pt-10 border-t border-slate-50 flex items-center justify-between">
                     <p className="text-xs text-slate-500 font-medium">ROI cultural basado en asistencia proyectada.</p>
                     <TrendingUp className="text-teal-400" size={32}/>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <button onClick={() => addActivity()} className="flex items-center gap-3 px-8 py-5 bg-violet-600 text-white rounded-3xl font-bold shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all">
              <Plus size={24}/> {t.addActivity}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {currentFair.activities.map(act => <ActivityCard key={act.id} activity={act} fair={currentFair} updateFair={updateFair} contacts={currentFair.contacts} />)}
            </div>
          </div>
        )}

        {activeTab === 'materials' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <button onClick={() => addMaterial()} className="flex items-center gap-3 px-8 py-5 bg-violet-600 text-white rounded-3xl font-bold shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all">
              <Plus size={24}/> {t.addMaterial}
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFair.materials.map(mat => (
                <div key={mat.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg relative group">
                  <button onClick={() => updateFair({...currentFair, materials: currentFair.materials.filter(m => m.id !== mat.id)})} className="absolute top-4 right-4 text-slate-200 hover:text-red-400"><Trash2 size={16}/></button>
                  <input className="font-bold text-xl text-slate-800 bg-transparent outline-none w-full mb-2" value={mat.name} onChange={(e) => {
                     const ms = currentFair.materials.map(m => m.id === mat.id ? {...m, name: e.target.value} : m);
                     updateFair({...currentFair, materials: ms});
                  }} />
                  <div className="flex gap-2 mb-6">
                    <span className="text-[10px] font-black uppercase text-violet-500 bg-violet-50 px-2 py-1 rounded">{mat.type}</span>
                    {mat.isReusable && <span className="text-[10px] font-black uppercase text-teal-500 bg-teal-50 px-2 py-1 rounded">Reusable</span>}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Estimado</p>
                      <input type="number" className="font-mono font-bold text-slate-900 bg-transparent outline-none w-24" value={mat.estimatedCost} onChange={(e) => {
                        const ms = currentFair.materials.map(m => m.id === mat.id ? {...m, estimatedCost: Number(e.target.value)} : m);
                        updateFair({...currentFair, materials: ms});
                      }} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">Real</p>
                      <input type="number" className="font-mono font-bold text-teal-600 bg-transparent outline-none w-24" value={mat.actualCost} onChange={(e) => {
                        const ms = currentFair.materials.map(m => m.id === mat.id ? {...m, actualCost: Number(e.target.value)} : m);
                        updateFair({...currentFair, materials: ms});
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold font-lora">Directorio de Proveedores y Staff</h3>
                  <button onClick={() => {
                    const newContact: Contact = { id: Date.now().toString(), name: 'Nuevo Contacto', role: 'Staff', category: 'Staff', phone: '', email: '' };
                    updateFair({...currentFair, contacts: [...currentFair.contacts, newContact]});
                  }} className="p-4 bg-teal-50 text-teal-600 rounded-2xl hover:bg-teal-100"><Plus size={24}/></button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentFair.contacts.map(contact => (
                    <div key={contact.id} className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 relative group">
                      <button onClick={() => updateFair({...currentFair, contacts: currentFair.contacts.filter(c => c.id !== contact.id)})} className="absolute top-4 right-4 text-slate-200 hover:text-red-400"><Trash2 size={16}/></button>
                      <input className="font-bold text-slate-800 bg-transparent outline-none w-full mb-1" value={contact.name} onChange={(e) => {
                         const cs = currentFair.contacts.map(c => c.id === contact.id ? {...c, name: e.target.value} : c);
                         updateFair({...currentFair, contacts: cs});
                      }} />
                      <input className="w-full text-xs text-violet-600 mb-4 bg-transparent outline-none" value={contact.role} onChange={(e) => {
                         const cs = currentFair.contacts.map(c => c.id === contact.id ? {...c, role: e.target.value} : c);
                         updateFair({...currentFair, contacts: cs});
                      }} />
                      <div className="flex items-center gap-2">
                        <input className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-xs font-mono outline-none" value={contact.phone} placeholder="WhatsApp" onChange={(e) => {
                           const cs = currentFair.contacts.map(c => c.id === contact.id ? {...c, phone: e.target.value} : c);
                           updateFair({...currentFair, contacts: cs});
                        }} />
                        {contact.phone && <a href={`https://wa.me/${contact.phone}`} target="_blank" className="p-3 bg-green-500 text-white rounded-xl"><MessageCircle size={16}/></a>}
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'socialMedia' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
                <button onClick={generateSocialPosts} disabled={isGeneratingSocial} className="flex items-center gap-3 px-8 py-5 bg-violet-600 text-white rounded-3xl font-bold shadow-xl shadow-violet-200 hover:bg-violet-700 transition-all disabled:opacity-50">
                  {isGeneratingSocial ? <Zap className="animate-spin" size={24}/> : <Sparkles size={24}/>}
                  {t.generateSocial}
                </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentFair.socialPosts.map(post => (
                  <div key={post.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-lg relative group">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        {post.platform === 'Instagram' && <Instagram size={20} className="text-pink-500"/>}
                        <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">{post.platform}</span>
                      </div>
                      <button onClick={() => {
                        navigator.clipboard.writeText(post.content);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }} className="p-3 bg-slate-50 rounded-xl relative">
                        {copied ? <Check size={16}/> : <Copy size={16}/>}
                      </button>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium mb-6">{post.content}</p>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Library Drawer */}
        {showLibrary && (
          <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[100] p-10 overflow-y-auto animate-in slide-in-from-right duration-300">
             <div className="flex justify-between items-center mb-12">
               <h3 className="text-2xl font-bold font-lora">Recursos</h3>
               <button onClick={() => setShowLibrary(false)} className="p-3 bg-slate-50 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"><X size={24}/></button>
             </div>
             <section className="space-y-12">
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Actividades</p>
                   <div className="grid gap-4">
                     {ACTIVITY_LIBRARY.map((item, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-[32px] cursor-pointer hover:bg-violet-50 border border-transparent hover:border-violet-100 transition-all group" onClick={() => { addActivity(item); setShowLibrary(false); }}>
                          <h5 className="font-bold text-slate-800">{item.name}</h5>
                          <div className="mt-3 flex justify-between items-center text-[10px] font-black text-violet-500 uppercase">
                            <span>${item.cost} Est.</span>
                            <Plus size={16}/>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest">Materiales</p>
                   <div className="grid gap-4">
                     {MATERIAL_LIBRARY.map((item, i) => (
                       <div key={i} className="p-6 bg-slate-50 rounded-[32px] cursor-pointer hover:bg-teal-50 border border-transparent hover:border-teal-100 transition-all group" onClick={() => { addMaterial(item); setShowLibrary(false); }}>
                          <h5 className="font-bold text-slate-800">{item.name}</h5>
                          <div className="mt-3 flex justify-between items-center text-[10px] font-black text-teal-500 uppercase">
                            <span>${item.estimatedCost} Est.</span>
                            <Plus size={16}/>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
             </section>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Helper Components ---

function PcNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${active ? 'bg-violet-600 text-white shadow-xl shadow-violet-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}>
      <span className={active ? 'text-white' : ''}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`p-4 rounded-2xl transition-all flex-shrink-0 ${active ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-300'}`}>
      {icon}
    </button>
  );
}
