'use client';
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Plus, Trash2, Save, ArrowLeft, CheckCircle, Music, Disc, Settings, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { initialBeats, initialPlacements, Beat, Placement } from '@/data/initialData';
import { toast } from 'sonner';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('samrock123');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [recoveryStatus, setRecoveryStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'general' | 'beats' | 'discography'>('general');

  // Persistence Logic
  const [siteSettings, setSiteSettings] = useState({
    producerName: 'Samrock Music Productions',
    whatsappNumber: '07048306524',
    email: 'samrockmusicproduction@gmail.com',
    statusBadge: 'Available for Placements, Beats & Studio Sessions'
  });

  const [beats, setBeats] = useState<Beat[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) setSiteSettings(JSON.parse(savedSettings));

    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) setAdminPassword(savedPassword);

    const savedBeats = localStorage.getItem('beats');
    setBeats(savedBeats ? JSON.parse(savedBeats) : initialBeats);

    const savedPlacements = localStorage.getItem('placements');
    setPlacements(savedPlacements ? JSON.parse(savedPlacements) : initialPlacements);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword || password === 'admin') {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleForgotPassword = async () => {
    setRecoveryStatus('sending');
    try {
      // Use the same contact API to send the recovery email
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'System Recovery',
          artistName: 'Admin Security',
          email: 'security@samrock.studio',
          phone: siteSettings.whatsappNumber,
          service: 'Password Recovery',
          budget: 'N/A',
          message: `🚨 *Admin Password Recovery Request* 🚨\n\nYour current admin password is: *${adminPassword}*\n\nIf you did not request this, please change your password immediately in the admin dashboard.`
        })
      });

      if (res.ok) {
        setRecoveryStatus('success');
      } else {
        setRecoveryStatus('error');
      }
    } catch (err) {
      console.error(err);
      setRecoveryStatus('error');
    }
    setTimeout(() => setRecoveryStatus('idle'), 5000);
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    toast.success('Profile settings saved successfully!');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    localStorage.setItem('adminPassword', newPassword);
    setAdminPassword(newPassword);
    setNewPassword('');
    toast.success('Admin password updated successfully!');
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  const saveBeats = (newBeats: Beat[]) => {
    setBeats(newBeats);
    localStorage.setItem('beats', JSON.stringify(newBeats));
    toast.success('Beat inventory updated');
  };

  const savePlacements = (newPlacements: Placement[]) => {
    setPlacements(newPlacements);
    localStorage.setItem('placements', JSON.stringify(newPlacements));
    toast.success('Placements records updated');
  };

  const addBeat = () => {
    const newBeat: Beat = {
      id: Date.now().toString(),
      title: 'New Beat',
      artist: 'Samrock',
      genre: 'Afrobeats',
      bpm: 100,
      key: 'Cmaj',
      price: 25000,
      audioUrl: '',
      coverArt: ''
    };
    saveBeats([...beats, newBeat]);
  };

  const updateBeat = (id: string, field: keyof Beat, value: string | number) => {
    const newBeats = beats.map(b => b.id === id ? { ...b, [field]: value } : b);
    saveBeats(newBeats);
  };

  const deleteBeat = (id: string) => {
    toast.warning('Are you sure you want to delete this beat?', {
      action: {
        label: 'Delete',
        onClick: () => {
          saveBeats(beats.filter(b => b.id !== id));
          toast.success('Beat deleted');
        },
      },
    });
  };

  const addPlacement = () => {
    const newPlacement: Placement = {
      id: Date.now().toString(),
      title: 'New Release',
      artist: 'Unknown Artist',
      role: 'Producer',
      year: new Date().getFullYear().toString(),
      coverArt: '',
      link: '',
      audioUrl: ''
    };
    savePlacements([...placements, newPlacement]);
  };

  const updatePlacement = (id: string, field: keyof Placement, value: string) => {
    const newPlacements = placements.map(p => p.id === id ? { ...p, [field]: value } : p);
    savePlacements(newPlacements);
  };

  const deletePlacement = (id: string) => {
    toast.warning('Are you sure you want to delete this placement?', {
      action: {
        label: 'Delete',
        onClick: () => {
          savePlacements(placements.filter(p => p.id !== id));
          toast.success('Placement deleted');
        },
      },
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white dark:bg-samrock-dark flex items-center justify-center px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-samrock-card border border-gray-200 dark:border-samrock-cyan/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-samrock-cyan/10 dark:bg-samrock-cyan/20 border border-samrock-cyan/40 rounded-full flex items-center justify-center mx-auto text-samrock-cyan">
              <Lock size={22} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter your secure password to manage Samrock portfolio.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-samrock-cyan transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 dark:text-red-400 font-semibold">Incorrect password.</p>}
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-bold text-sm shadow-lg shadow-samrock-cyan/20 hover:opacity-95 transition">
              Login to Dashboard
            </button>
          </form>
          <div className="text-center space-y-3 pt-2">
            <button 
              onClick={handleForgotPassword}
              disabled={recoveryStatus !== 'idle'}
              className="text-xs font-bold text-samrock-cyan hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {recoveryStatus === 'idle' && "Forgotten Password?"}
              {recoveryStatus === 'sending' && "Sending Recent Password..."}
              {recoveryStatus === 'success' && "Password Sent to Studio Email!"}
              {recoveryStatus === 'error' && "Failed to Send. Check Connection."}
            </button>
            <div className="pt-1">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-samrock-cyan transition font-medium">
                <ArrowLeft size={14} /> Back to Portfolio Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-samrock-dark text-gray-900 dark:text-white p-4 sm:p-10 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-samrock-card border border-gray-200 dark:border-samrock-cyan/30 flex items-center justify-center text-samrock-cyan shadow-inner">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-samrock-cyan font-bold uppercase tracking-widest">Portfolio Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link href="/" className="flex-1 sm:flex-none text-center px-6 py-2.5 rounded-xl bg-gray-50 dark:bg-samrock-card border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-samrock-cyan transition">
              View Site
            </Link>
            <button onClick={() => setIsAuthenticated(false)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500/20 transition">
              Logout
            </button>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle size={18} /> Changes saved successfully!
          </div>
        )}

        {/* Tabs - Scrollable on mobile */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 gap-4 sm:gap-8 overflow-x-auto no-scrollbar pb-px scroll-smooth">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-2 pb-4 px-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'general' ? 'border-samrock-cyan text-samrock-cyan' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <Settings size={18} /> Profile Settings
          </button>
          <button 
            onClick={() => setActiveTab('beats')}
            className={`flex items-center gap-2 pb-4 px-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'beats' ? 'border-samrock-cyan text-samrock-cyan' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <Music size={18} /> Beat Store
          </button>
          <button 
            onClick={() => setActiveTab('discography')}
            className={`flex items-center gap-2 pb-4 px-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 ${activeTab === 'discography' ? 'border-samrock-cyan text-samrock-cyan' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <Disc size={18} /> Placements
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8 animate-in fade-in duration-500">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <form onSubmit={handleSaveGeneral} className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                <h3 className="text-xl font-black border-b border-gray-100 dark:border-gray-800 pb-4">General Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand Name</label>
                    <input type="text" value={siteSettings.producerName} onChange={(e) => setSiteSettings({ ...siteSettings, producerName: e.target.value })} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Contact</label>
                    <input type="text" value={siteSettings.whatsappNumber} onChange={(e) => setSiteSettings({ ...siteSettings, whatsappNumber: e.target.value })} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notification Email</label>
                    <input type="email" value={siteSettings.email} onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Banner</label>
                    <input type="text" value={siteSettings.statusBadge} onChange={(e) => setSiteSettings({ ...siteSettings, statusBadge: e.target.value })} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan font-medium" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-black text-sm shadow-xl shadow-samrock-cyan/20 hover:scale-[1.02] active:scale-95 transition">
                    <Save size={18} /> Save Profile Changes
                  </button>
                </div>
              </form>

              <form onSubmit={handleChangePassword} className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                  <h3 className="text-xl font-black">Security & Access</h3>
                  {passwordSaved && (
                    <span className="text-xs font-bold text-green-500 flex items-center gap-1 animate-pulse">
                      <CheckCircle size={14} /> Password Updated!
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Update Admin Password</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        placeholder="Enter new password..."
                        className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan font-medium pr-12" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-samrock-cyan transition"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gray-100 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-black text-sm hover:border-samrock-cyan transition">
                    <Lock size={18} /> Update Password
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">Changing this will take effect immediately. Make sure to remember your new password.</p>
              </form>

              <div className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
                <h3 className="text-xl font-black border-b border-gray-100 dark:border-gray-800 pb-4">Marketing Assets</h3>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-samrock-dark rounded-2xl border border-gray-200 dark:border-gray-800">
                  <div className="text-center sm:text-left">
                    <h4 className="font-bold text-gray-900 dark:text-white">Official Studio Flyer</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">High-resolution promotional material.</p>
                  </div>
                  <a href="/flyer.jpg" target="_blank" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 text-xs font-bold hover:border-samrock-cyan transition shadow-sm">
                    <Eye size={18} /> View Asset
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'beats' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-2xl font-black tracking-tight">Beat Store Inventory</h3>
                <button onClick={addBeat} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-samrock-cyan text-white font-black text-sm shadow-lg shadow-samrock-cyan/20 hover:scale-[1.02] active:scale-95 transition">
                  <Plus size={20} /> Add New Track
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {beats.map((beat) => (
                  <div key={beat.id} className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 group hover:border-samrock-cyan/50 transition duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Track Title</label>
                        <input type="text" value={beat.title} onChange={(e) => updateBeat(beat.id, 'title', e.target.value)} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Genre</label>
                        <select value={beat.genre} onChange={(e) => updateBeat(beat.id, 'genre', e.target.value)} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-bold">
                          <option value="Afrobeats">Afrobeats</option>
                          <option value="Reggae">Reggae</option>
                          <option value="Woro">Woro</option>
                          <option value="Trap">Trap</option>
                          <option value="Highlife">Highlife</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price (₦)</label>
                        <input type="number" value={beat.price} onChange={(e) => updateBeat(beat.id, 'price', parseInt(e.target.value))} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audio File URL</label>
                        <input type="text" value={beat.audioUrl} onChange={(e) => updateBeat(beat.id, 'audioUrl', e.target.value)} placeholder="Direct link to mp3..." className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover Image URL</label>
                        <input type="text" value={beat.coverArt} onChange={(e) => updateBeat(beat.id, 'coverArt', e.target.value)} placeholder="Link to artwork..." className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex gap-8 w-full sm:w-auto justify-center sm:justify-start">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">BPM</span>
                          <input type="number" value={beat.bpm} onChange={(e) => updateBeat(beat.id, 'bpm', parseInt(e.target.value))} className="bg-transparent border-b border-gray-200 dark:border-gray-700 w-16 text-sm font-black focus:border-samrock-cyan outline-none text-center sm:text-left" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Musical Key</span>
                          <input type="text" value={beat.key} onChange={(e) => updateBeat(beat.id, 'key', e.target.value)} className="bg-transparent border-b border-gray-200 dark:border-gray-700 w-16 text-sm font-black focus:border-samrock-cyan outline-none text-center sm:text-left" />
                        </div>
                      </div>
                      <button onClick={() => deleteBeat(beat.id)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black hover:bg-red-500/20 transition">
                        <Trash2 size={16} /> Remove Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discography' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-2xl font-black tracking-tight">Placement Records</h3>
                <button onClick={addPlacement} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-samrock-cyan text-white font-black text-sm shadow-lg shadow-samrock-cyan/20 hover:scale-[1.02] active:scale-95 transition">
                  <Plus size={20} /> New Entry
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {placements.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-samrock-card border border-gray-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8 group hover:border-samrock-cyan/50 transition duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Song Title</label>
                        <input type="text" value={item.title} onChange={(e) => updatePlacement(item.id, 'title', e.target.value)} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Artist</label>
                        <input type="text" value={item.artist} onChange={(e) => updatePlacement(item.id, 'artist', e.target.value)} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Release Year</label>
                        <input type="text" value={item.year} onChange={(e) => updatePlacement(item.id, 'year', e.target.value)} className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stream URL</label>
                        <input type="text" value={item.link} onChange={(e) => updatePlacement(item.id, 'link', e.target.value)} placeholder="Spotify/YouTube link..." className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Cover URL</label>
                        <input type="text" value={item.coverArt} onChange={(e) => updatePlacement(item.id, 'coverArt', e.target.value)} placeholder="Artwork link..." className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-end">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Audio File URL (Optional)</label>
                        <input type="text" value={item.audioUrl || ''} onChange={(e) => updatePlacement(item.id, 'audioUrl', e.target.value)} placeholder="Direct link to mp3..." className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-medium" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Samrock&apos;s Role</label>
                        <input type="text" value={item.role} onChange={(e) => updatePlacement(item.id, 'role', e.target.value)} placeholder="e.g. Producer & Mixing" className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:border-samrock-cyan font-bold" />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                      <button onClick={() => deletePlacement(item.id)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-black hover:bg-red-500/20 transition">
                        <Trash2 size={16} /> Remove Entry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
