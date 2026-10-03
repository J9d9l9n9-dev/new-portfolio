import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/SocialIcons';
import { submitContact } from '../../api/client';
import { useToast } from '../ui/Toast';
import type { Profile, ContactSubmission } from '../../types';

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ContactSubmission>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  // Honeypot field (hidden from users, bots fill it)
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof ContactSubmission, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactSubmission, string>> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Honeypot bot protection
    if (honeypot) {
      // Silently pretend success to deceive bot
      setIsSuccess(true);
      return;
    }

    if (!validate()) {
      showToast('Please correct the validation errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContact(formData);
      setIsSuccess(true);
      showToast('Message sent successfully! Thank you for reaching out.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err: any) {
      const msg = err.message || 'Failed to send message. Please try again.';
      setServerError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" aria-label="Contact Inquiries Section" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-content mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Inquiries</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary tracking-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Touch</span>
          </h2>
          <p className="mt-2 text-text-secondary text-sm sm:text-base max-w-lg">
            Have a project, role, or technical question? Send a message directly to my inbox.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-bg-card border border-border shadow-sm">
              <h3 className="font-display font-bold text-xl text-text-primary mb-5">
                Contact Information
              </h3>

              <div className="space-y-5 text-sm">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-medium text-primary hover:text-primary-light hover:underline text-base mt-0.5 inline-block"
                  >
                    {profile.email}
                  </a>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                    Location
                  </span>
                  <p className="text-text-secondary flex items-center gap-1.5 mt-0.5 font-medium">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{profile.location}</span>
                  </p>
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-text-muted block">
                    Availability
                  </span>
                  <p className="text-emerald-400 font-medium mt-0.5 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{profile.availability}</span>
                  </p>
                </div>
              </div>

              {/* Online Socials */}
              <div className="mt-8 pt-6 border-t border-border">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted block mb-3">
                  Online Profiles
                </span>
                <div className="flex items-center gap-2">
                  {profile.socials?.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Profile"
                      className="p-2.5 rounded-xl bg-bg-surface hover:bg-white/10 border border-border text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socials?.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                      className="p-2.5 rounded-xl bg-bg-surface hover:bg-white/10 border border-border text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <LinkedinIcon className="w-4 h-4" />
                    </a>
                  )}
                  {profile.socials?.twitter && (
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter Profile"
                      className="p-2.5 rounded-xl bg-bg-surface hover:bg-white/10 border border-border text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <TwitterIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form with Floating Labels */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-bg-card border border-border shadow-sm">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-text-primary">
                    Message Sent Successfully!
                  </h3>
                  <p className="mt-2 text-text-secondary text-sm max-w-sm leading-relaxed">
                    Thank you for reaching out. Your inquiry has been logged in the backend and I will review it promptly.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-light transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {serverError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Honeypot anti-spam field (hidden) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="hp_field"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Floating Field */}
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder=" "
                        className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-bg-surface border text-text-primary text-sm focus:outline-none transition-all ${
                          errors.name ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                        }`}
                      />
                      <label
                        htmlFor="name"
                        className="absolute text-xs font-mono uppercase tracking-wider text-text-muted duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-primary pointer-events-none"
                      >
                        Full Name *
                      </label>
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Floating Field */}
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder=" "
                        className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-bg-surface border text-text-primary text-sm focus:outline-none transition-all ${
                          errors.email ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                        }`}
                      />
                      <label
                        htmlFor="email"
                        className="absolute text-xs font-mono uppercase tracking-wider text-text-muted duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-primary pointer-events-none"
                      >
                        Email Address *
                      </label>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Floating Field */}
                  <div className="relative">
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder=" "
                      className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-bg-surface border text-text-primary text-sm focus:outline-none transition-all ${
                        errors.subject ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    <label
                      htmlFor="subject"
                      className="absolute text-xs font-mono uppercase tracking-wider text-text-muted duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-primary pointer-events-none"
                    >
                      Subject *
                    </label>
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Floating Field */}
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder=" "
                      className={`peer w-full px-4 pt-6 pb-2 rounded-2xl bg-bg-surface border text-text-primary text-sm focus:outline-none transition-all resize-none ${
                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
                      }`}
                    />
                    <label
                      htmlFor="message"
                      className="absolute text-xs font-mono uppercase tracking-wider text-text-muted duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 peer-focus:text-primary pointer-events-none"
                    >
                      Message (min 10 chars) *
                    </label>
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button with Loading Spinner */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-glow w-full py-3.5 px-6 rounded-2xl font-semibold text-sm text-white bg-primary hover:bg-primary-light shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
