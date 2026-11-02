'use client';
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    artistName: '',
    email: '',
    phone: '',
    service: 'Beat Making & Production',
    budget: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const contactInfo = {
    email: 'samrockmusicproduction@gmail.com',
    phones: ['08139972822', '07048306524'],
    whatsapp: '2347048306524'
  };

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      // We'll keep the email and main whatsapp from settings
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({
          name: '',
          artistName: '',
          email: '',
          phone: '',
          service: 'Beat Making & Production',
          budget: '',
          message: ''
        });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-white dark:bg-samrock-dark relative border-t border-samrock-cyan/10">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-samrock-card border border-samrock-cyan/30 text-xs font-semibold text-samrock-cyan uppercase tracking-widest">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Book a <span className="text-transparent bg-clip-text bg-gradient-to-r from-samrock-cyan to-orange-500">Session</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400 text-sm sm:text-base">
            Ready to record your next hit or secure a beat? Send an inquiry and it will reach Sam&apos;s Gmail and WhatsApp instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-samrock-cyan/10 flex items-center justify-center text-samrock-cyan">
              <Phone size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Call / WhatsApp</p>
              <p className="text-gray-900 dark:text-white font-bold">{contactInfo.phones[0]}</p>
              <p className="text-gray-900 dark:text-white font-bold">{contactInfo.phones[1]}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-lg bg-samrock-cyan/10 flex items-center justify-center text-samrock-cyan">
              <Mail size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Us</p>
              <p className="text-gray-900 dark:text-white font-bold text-sm sm:text-base">{contactInfo.email}</p>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="bg-white dark:bg-samrock-card rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-2xl relative">
          
          {status === 'success' ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center mx-auto text-green-400">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Inquiry Sent Successfully!</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm max-w-md mx-auto">
                Thank you! Your message has been dispatched to Sam&apos;s Gmail and WhatsApp simultaneously. He will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-gray-50 dark:bg-samrock-dark border border-samrock-cyan/30 text-samrock-cyan font-semibold text-xs hover:bg-samrock-cyan/10 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maleek Adewale"
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Artist / Stage Name</label>
                  <input
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleChange}
                    placeholder="e.g. Samrock"
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">WhatsApp Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="07048306524"
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Service Required *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  >
                    <option value="Beat Making & Production">Beat Making & Production</option>
                    <option value="Mixing & Mastering">Mixing & Mastering</option>
                    <option value="Music Recording">Music Recording</option>
                    <option value="Jingles & Back Tracks">Jingles & Back Tracks</option>
                    <option value="Artiste Management">Artiste Management</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Estimated Budget (Optional)</label>
                  <input
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g. ₦50,000"
                    className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Project Details / Message</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your track, BPM, reference songs, or session date..."
                  className="w-full bg-gray-50 dark:bg-samrock-dark border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-samrock-cyan transition resize-none"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-xs text-center">Failed to send message. Please try again or message via WhatsApp directly.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-samrock-cyan to-orange-600 text-white font-bold text-base shadow-xl shadow-samrock-cyan/20 hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <span>Sending to Gmail & WhatsApp...</span>
                ) : (
                  <>
                    <Send size={18} /> Send Inquiry Now
                  </>
                )}
              </button>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
