import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  loginAdmin,
  logoutAdmin,
  fetchContactMessages,
  deleteContactMessage,
  toggleMessageHandled,
  fetchProfile,
  updateProfile,
  fetchSiteSettings,
  updateSiteSettings,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  fetchSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  fetchLearningItems,
  createLearningItem,
  updateLearningItem,
  deleteLearningItem,
  fetchJourneyMilestones,
  createJourneyMilestone,
  updateJourneyMilestone,
  deleteJourneyMilestone,
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  fetchExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  fetchEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  uploadImage,
  exportBackupJson,
  getAdminToken,
} from '../api/client';
import { useToast } from '../components/ui/Toast';
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Mail,
  AlertCircle,
  Loader2,
  Trash2,
  Edit2,
  Plus,
  Upload,
  FolderGit2,
  Cpu,
  Briefcase,
  Copy,
  X,
  Milestone,
  Award,
  Trophy,
  Sliders,
  Download,
  Check,
} from 'lucide-react';
import type {
  ContactMessage, Profile, Project, SkillCategory, Experience,
  Education, JourneyMilestone, Certification, Achievement, LearningItem, SiteSettings
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [token, setToken] = useState<string | null>(() => getAdminToken());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<
    'messages' | 'profile' | 'settings' | 'projects' | 'skills' | 'journey' | 'certifications' | 'achievements' | 'timeline' | 'upload'
  >('messages');

  // Contact messages state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Queries
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile, enabled: !!token });
  const { data: siteSettings } = useQuery({ queryKey: ['site-settings'], queryFn: fetchSiteSettings, enabled: !!token });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: () => fetchProjects(), enabled: !!token });
  const { data: skills = [] } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills, enabled: !!token });
  const { data: learningItems = [] } = useQuery({ queryKey: ['learning-items'], queryFn: fetchLearningItems, enabled: !!token });
  const { data: journey = [] } = useQuery({ queryKey: ['journey'], queryFn: fetchJourneyMilestones, enabled: !!token });
  const { data: certifications = [] } = useQuery({ queryKey: ['certifications'], queryFn: fetchCertifications, enabled: !!token });
  const { data: achievements = [] } = useQuery({ queryKey: ['achievements'], queryFn: fetchAchievements, enabled: !!token });
  const { data: experience = [] } = useQuery({ queryKey: ['experience'], queryFn: fetchExperience, enabled: !!token });
  const { data: education = [] } = useQuery({ queryKey: ['education'], queryFn: fetchEducation, enabled: !!token });

  // Form states
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});
  const [settingsForm, setSettingsForm] = useState<Partial<SiteSettings>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Project Modal
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: '', slug: '', summary: '', problem: '', solution: '',
    category: 'Full-Stack', image: '/images/project-planner.jpg',
    live: '', repo: '', tech: [], features: [], featured: false, is_published: true
  });

  // Skill Modal
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillCategory | null>(null);
  const [skillForm, setSkillForm] = useState<{ category: string; itemsStr: string }>({ category: '', itemsStr: '' });

  // Learning Modal
  const [learningModalOpen, setLearningModalOpen] = useState(false);
  const [editingLearning, setEditingLearning] = useState<LearningItem | null>(null);
  const [learningForm, setLearningForm] = useState<Partial<LearningItem>>({ name: '', category: 'Distributed Systems', status: 'In Progress' });

  // Journey Modal
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<JourneyMilestone | null>(null);
  const [journeyForm, setJourneyForm] = useState<Partial<JourneyMilestone>>({ year: '', title: '', description: '', tag: 'Milestone' });

  // Certification Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certForm, setCertForm] = useState<Partial<Certification>>({ title: '', issuer: '', date: '', credential_url: '' });

  // Achievement Modal
  const [achieveModalOpen, setAchieveModalOpen] = useState(false);
  const [editingAchieve, setEditingAchieve] = useState<Achievement | null>(null);
  const [achieveForm, setAchieveForm] = useState<Partial<Achievement>>({ title: '', organization: '', description: '', date: '', badge: 'Award' });

  // Experience Modal
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState<{ company: string; title: string; period: string; pointsStr: string }>({
    company: '', title: '', period: '', pointsStr: ''
  });

  // Education Modal
  const [eduModalOpen, setEduModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [eduForm, setEduForm] = useState<Partial<Education>>({ school: '', degree: '', period: '' });

  // Upload state
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sync profile & settings
  useEffect(() => {
    if (profile) setProfileForm(profile);
  }, [profile]);

  useEffect(() => {
    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  // Load contact messages
  useEffect(() => {
    if (token) loadMessages();
  }, [token]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await fetchContactMessages();
      setMessages(data);
    } catch {
      showToast('Could not fetch inquiries.', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await loginAdmin(email, password);
      setToken(res.access_token);
      showToast('Signed in successfully with JWT token.', 'success');
    } catch (err: any) {
      setLoginError(err.message || 'Invalid credentials.');
      showToast(err.message || 'Authentication failed.', 'error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setToken(null);
    setMessages([]);
    showToast('Logged out of Admin Portal.', 'info');
  };

  // Handlers for Contact Inquiries
  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast('Contact message deleted.', 'success');
    } catch {
      showToast('Failed to delete message.', 'error');
    }
  };

  const handleToggleHandled = async (id: number) => {
    try {
      const updated = await toggleMessageHandled(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      showToast('Inquiry status updated.', 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  // Profile and Settings Saves
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(profileForm);
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      showToast('Profile updated successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSiteSettings(settingsForm);
      await queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      showToast('Site settings updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Export Backup
  const handleExportBackup = async () => {
    try {
      await exportBackupJson();
      showToast('Backup JSON downloaded successfully.', 'success');
    } catch {
      showToast('Failed to export backup.', 'error');
    }
  };

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setUploadedUrl(res.url);
      showToast('Image uploaded successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Image upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Project CRUD
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject && editingProject.id) {
        await updateProject(editingProject.id, projectForm);
        showToast('Project updated.', 'success');
      } else {
        await createProject(projectForm);
        showToast('Project created.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      setProjectModalOpen(false);
      setEditingProject(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save project.', 'error');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project permanently?')) return;
    try {
      await deleteProject(id);
      await queryClient.invalidateQueries({ queryKey: ['projects'] });
      showToast('Project deleted.', 'success');
    } catch {
      showToast('Failed to delete project.', 'error');
    }
  };

  // Skill CRUD
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const items = skillForm.itemsStr.split(',').map((s) => s.trim()).filter(Boolean);
      if (editingSkill && editingSkill.id) {
        await updateSkill(editingSkill.id, { category: skillForm.category, items });
        showToast('Skill group updated.', 'success');
      } else {
        await createSkill({ category: skillForm.category, items });
        showToast('Skill group created.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      setSkillModalOpen(false);
      setEditingSkill(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save skill group.', 'error');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete this skill group?')) return;
    try {
      await deleteSkill(id);
      await queryClient.invalidateQueries({ queryKey: ['skills'] });
      showToast('Skill group deleted.', 'success');
    } catch {
      showToast('Failed to delete skill group.', 'error');
    }
  };

  // Learning Item CRUD
  const handleSaveLearning = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLearning && editingLearning.id) {
        await updateLearningItem(editingLearning.id, learningForm);
        showToast('Learning goal updated.', 'success');
      } else {
        await createLearningItem(learningForm);
        showToast('Learning goal created.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['learning-items'] });
      setLearningModalOpen(false);
      setEditingLearning(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save learning goal.', 'error');
    }
  };

  const handleDeleteLearning = async (id: number) => {
    if (!confirm('Delete this learning goal?')) return;
    try {
      await deleteLearningItem(id);
      await queryClient.invalidateQueries({ queryKey: ['learning-items'] });
      showToast('Learning goal deleted.', 'success');
    } catch {
      showToast('Failed to delete learning goal.', 'error');
    }
  };

  // Journey CRUD
  const handleSaveJourney = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJourney && editingJourney.id) {
        await updateJourneyMilestone(editingJourney.id, journeyForm);
        showToast('Milestone updated.', 'success');
      } else {
        await createJourneyMilestone(journeyForm);
        showToast('Milestone created.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['journey'] });
      setJourneyModalOpen(false);
      setEditingJourney(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save milestone.', 'error');
    }
  };

  const handleDeleteJourney = async (id: number) => {
    if (!confirm('Delete this milestone?')) return;
    try {
      await deleteJourneyMilestone(id);
      await queryClient.invalidateQueries({ queryKey: ['journey'] });
      showToast('Milestone deleted.', 'success');
    } catch {
      showToast('Failed to delete milestone.', 'error');
    }
  };

  // Certifications CRUD
  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCert && editingCert.id) {
        await updateCertification(editingCert.id, certForm);
        showToast('Certification updated.', 'success');
      } else {
        await createCertification(certForm);
        showToast('Certification added.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setCertModalOpen(false);
      setEditingCert(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save certification.', 'error');
    }
  };

  const handleDeleteCert = async (id: number) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await deleteCertification(id);
      await queryClient.invalidateQueries({ queryKey: ['certifications'] });
      showToast('Certification deleted.', 'success');
    } catch {
      showToast('Failed to delete certification.', 'error');
    }
  };

  // Achievements CRUD
  const handleSaveAchieve = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAchieve && editingAchieve.id) {
        await updateAchievement(editingAchieve.id, achieveForm);
        showToast('Achievement updated.', 'success');
      } else {
        await createAchievement(achieveForm);
        showToast('Achievement added.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['achievements'] });
      setAchieveModalOpen(false);
      setEditingAchieve(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save achievement.', 'error');
    }
  };

  const handleDeleteAchieve = async (id: number) => {
    if (!confirm('Delete this achievement?')) return;
    try {
      await deleteAchievement(id);
      await queryClient.invalidateQueries({ queryKey: ['achievements'] });
      showToast('Achievement deleted.', 'success');
    } catch {
      showToast('Failed to delete achievement.', 'error');
    }
  };

  // Experience CRUD
  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const points = expForm.pointsStr.split('\n').map((p) => p.trim()).filter(Boolean);
      if (editingExp && editingExp.id) {
        await updateExperience(editingExp.id, { ...expForm, points });
        showToast('Experience updated.', 'success');
      } else {
        await createExperience({ ...expForm, points });
        showToast('Experience created.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['experience'] });
      setExpModalOpen(false);
      setEditingExp(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save experience.', 'error');
    }
  };

  const handleDeleteExp = async (id: number) => {
    if (!confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      await queryClient.invalidateQueries({ queryKey: ['experience'] });
      showToast('Experience deleted.', 'success');
    } catch {
      showToast('Failed to delete experience.', 'error');
    }
  };

  // Education CRUD
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu && editingEdu.id) {
        await updateEducation(editingEdu.id, eduForm);
        showToast('Education updated.', 'success');
      } else {
        await createEducation(eduForm);
        showToast('Education added.', 'success');
      }
      await queryClient.invalidateQueries({ queryKey: ['education'] });
      setEduModalOpen(false);
      setEditingEdu(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save education.', 'error');
    }
  };

  const handleDeleteEdu = async (id: number) => {
    if (!confirm('Delete this education record?')) return;
    try {
      await deleteEducation(id);
      await queryClient.invalidateQueries({ queryKey: ['education'] });
      showToast('Education record deleted.', 'success');
    } catch {
      showToast('Failed to delete education record.', 'error');
    }
  };

  // Login View if Unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-bg relative">
        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-border shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center mx-auto text-white shadow-lg mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-text-primary">Owner Admin Console</h1>
            <p className="text-xs text-text-muted mt-2">
              Protected Endpoint (/admin). Enter your administrative credentials to manage portfolio content.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jampadurgalakshminarayana@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover shadow-md transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Sign In to Console</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text-primary pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-text-primary">Admin Control Center</h1>
              <p className="text-xs text-text-muted font-mono">Single-Owner Management Portal (FastAPI + PostgreSQL)</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-border hover:border-primary/50 text-text-primary transition-colors"
            title="Download full database content as JSON"
          >
            <Download className="w-3.5 h-3.5 text-secondary" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 pb-4 overflow-x-auto border-b border-border/60 mb-8 scrollbar-none">
        {[
          { id: 'messages', label: 'Inquiries', icon: Mail, count: messages.length },
          { id: 'settings', label: 'Site Settings', icon: Sliders },
          { id: 'profile', label: 'Profile & Bio', icon: User },
          { id: 'projects', label: 'Projects', icon: FolderGit2, count: projects.length },
          { id: 'journey', label: 'Journey Milestones', icon: Milestone, count: journey.length },
          { id: 'skills', label: 'Skills & Learning', icon: Cpu, count: skills.length + learningItems.length },
          { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
          { id: 'achievements', label: 'Achievements', icon: Trophy, count: achievements.length },
          { id: 'timeline', label: 'Experience & Edu', icon: Briefcase, count: experience.length + education.length },
          { id: 'upload', label: 'Asset Storage', icon: Upload },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${active ? 'bg-white/20' : 'bg-white/5'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Messages */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-text-primary">Contact Inquiries Inbox</h2>
            <button
              onClick={loadMessages}
              disabled={loadingMessages}
              className="text-xs font-mono text-primary hover:underline"
            >
              Refresh Inbox
            </button>
          </div>

          {loadingMessages ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : messages.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl text-text-muted text-sm">
              Inbox empty. No inquiries received yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {messages.map((m) => (
                <div key={m.id} className="glass-card p-5 rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-text-primary">{m.name}</span>
                      <span className="text-xs text-text-muted">&lt;{m.email}&gt;</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${m.is_handled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                        {m.is_handled ? 'Handled' : 'Pending Action'}
                      </span>
                    </div>
                    <div className="font-semibold text-xs text-primary">{m.subject}</div>
                    <p className="text-xs text-text-secondary mt-1">{m.message}</p>
                    <div className="text-[11px] font-mono text-text-muted">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleHandled(m.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-border hover:border-primary/50 text-text-secondary"
                    >
                      {m.is_handled ? 'Mark Pending' : 'Mark Handled'}
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Site Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="glass-card p-6 sm:p-8 rounded-3xl border border-border max-w-2xl space-y-6">
          <h2 className="font-display font-bold text-lg text-text-primary">Site Global Settings</h2>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="open_to_work"
              checked={settingsForm.open_to_work ?? true}
              onChange={(e) => setSettingsForm({ ...settingsForm, open_to_work: e.target.checked })}
              className="w-4 h-4 rounded text-primary"
            />
            <label htmlFor="open_to_work" className="text-sm font-semibold text-text-primary">
              Open to Work Badge Active (Controls live availability chip on Hero)
            </label>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">
              Work Status Text
            </label>
            <input
              type="text"
              value={settingsForm.work_status_text || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, work_status_text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">
              Public Resume File URL
            </label>
            <input
              type="text"
              value={settingsForm.resume_url || ''}
              onChange={(e) => setSettingsForm({ ...settingsForm, resume_url: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-bg-surface border border-border text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            {savingSettings ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="glass-card p-6 sm:p-8 rounded-3xl border border-border max-w-3xl space-y-5">
          <h2 className="font-display font-bold text-lg text-text-primary">Personal Profile & Bio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">Name</label>
              <input
                type="text"
                value={profileForm.name || ''}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-bg-surface border border-border text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">Location</label>
              <input
                type="text"
                value={profileForm.location || ''}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-bg-surface border border-border text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">Headline Tagline</label>
            <input
              type="text"
              value={profileForm.tagline || ''}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-bg-surface border border-border text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-mono font-semibold text-text-secondary uppercase mb-1">Bio</label>
            <textarea
              rows={4}
              value={profileForm.bio || ''}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-bg-surface border border-border text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-primary hover:bg-primary-hover transition-colors"
          >
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Tab: Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-text-primary">Featured Projects ({projects.length})</h2>
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectForm({
                  title: '', slug: '', summary: '', problem: '', solution: '',
                  category: 'Full-Stack', image: '/images/project-planner.jpg',
                  live: '', repo: '', tech: ['React', 'FastAPI'], features: ['Feature 1'], is_published: true
                });
                setProjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.slug} className="glass-card p-5 rounded-2xl border border-border flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-base text-text-primary">{p.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">{p.category}</span>
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2">{p.summary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingProject(p);
                      setProjectForm(p);
                      setProjectModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => p.id && handleDeleteProject(p.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Skills & Learning */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Skill Groups */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-text-primary">Domain Skill Categories ({skills.length})</h2>
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setSkillForm({ category: '', itemsStr: '' });
                  setSkillModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill Group</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((s) => (
                <div key={s.category} className="glass-card p-5 rounded-2xl border border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{s.category}</h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(s.items || (s.chips ? s.chips.map((c) => ({ name: c })) : [])).map((it, i) => (
                        <span key={i} className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 border border-border text-text-secondary">
                          {typeof it === 'string' ? it : it.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingSkill(s);
                        setSkillForm({
                          category: s.category,
                          itemsStr: (s.items ? s.items.map((it) => (typeof it === 'string' ? it : it.name)) : (s.chips || [])).join(', ')
                        });
                        setSkillModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => s.id && handleDeleteSkill(s.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currently Learning Goals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-text-primary">Currently Learning Goals ({learningItems.length})</h2>
              <button
                onClick={() => {
                  setEditingLearning(null);
                  setLearningForm({ name: '', category: 'Distributed Systems', status: 'In Progress' });
                  setLearningModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-secondary hover:bg-secondary/80 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Learning Goal</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningItems.map((item) => (
                <div key={item.id || item.name} className="glass-card p-4 rounded-xl border border-border flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-xs text-text-primary">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-text-muted">{item.category}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-secondary/10 text-secondary">{item.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingLearning(item);
                        setLearningForm(item);
                        setLearningModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => item.id && handleDeleteLearning(item.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Journey Milestones */}
      {activeTab === 'journey' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-text-primary">Journey Milestones ({journey.length})</h2>
            <button
              onClick={() => {
                setEditingJourney(null);
                setJourneyForm({ year: '2025', title: '', description: '', tag: 'Milestone' });
                setJourneyModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {journey.map((m) => (
              <div key={m.id || m.year} className="glass-card p-5 rounded-2xl border border-border flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">{m.year}</span>
                    <span className="font-bold text-sm text-text-primary">{m.title}</span>
                    {m.tag && <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/10 text-secondary">{m.tag}</span>}
                  </div>
                  <p className="text-xs text-text-secondary">{m.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingJourney(m);
                      setJourneyForm(m);
                      setJourneyModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => m.id && handleDeleteJourney(m.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-text-primary">Certifications ({certifications.length})</h2>
            <button
              onClick={() => {
                setEditingCert(null);
                setCertForm({ title: '', issuer: '', date: '2025', credential_url: '' });
                setCertModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((c) => (
              <div key={c.id || c.title} className="glass-card p-5 rounded-2xl border border-border flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-text-primary">{c.title}</h3>
                  <p className="text-xs text-text-secondary">{c.issuer} • {c.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCert(c);
                      setCertForm(c);
                      setCertModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => c.id && handleDeleteCert(c.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-text-primary">Achievements & Honors ({achievements.length})</h2>
            <button
              onClick={() => {
                setEditingAchieve(null);
                setAchieveForm({ title: '', organization: '', description: '', date: '2025', badge: 'Award' });
                setAchieveModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Achievement</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((a) => (
              <div key={a.id || a.title} className="glass-card p-5 rounded-2xl border border-border flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-text-primary">{a.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/10 text-accent">{a.badge}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{a.organization} • {a.date}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingAchieve(a);
                      setAchieveForm(a);
                      setAchieveModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => a.id && handleDeleteAchieve(a.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Experience & Education Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-text-primary">Engineering Experience ({experience.length})</h2>
              <button
                onClick={() => {
                  setEditingExp(null);
                  setExpForm({ company: '', title: '', period: '', pointsStr: '' });
                  setExpModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experience.map((exp) => (
                <div key={exp.company} className="glass-card p-5 rounded-2xl border border-border flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{exp.title}</h3>
                    <p className="text-xs font-semibold text-secondary">{exp.company} • {exp.period}</p>
                    <ul className="list-disc list-inside mt-2 text-xs text-text-muted space-y-1">
                      {exp.points.map((pt, i) => (
                        <li key={i} className="line-clamp-1">{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingExp(exp);
                        setExpForm({
                          company: exp.company,
                          title: exp.title,
                          period: exp.period,
                          pointsStr: exp.points.join('\n')
                        });
                        setExpModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exp.id && handleDeleteExp(exp.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-text-primary">Academic Education ({education.length})</h2>
              <button
                onClick={() => {
                  setEditingEdu(null);
                  setEduForm({ school: '', degree: '', period: '' });
                  setEduModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Education</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div key={edu.school} className="glass-card p-5 rounded-2xl border border-border flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-sm text-text-primary">{edu.school}</h3>
                    <p className="text-xs text-text-secondary">{edu.degree} • {edu.period}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        setEditingEdu(edu);
                        setEduForm(edu);
                        setEduModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => edu.id && handleDeleteEdu(edu.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Asset Storage */}
      {activeTab === 'upload' && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-border max-w-xl space-y-6">
          <h2 className="font-display font-bold text-lg text-text-primary">Storage Adapter & File Uploads</h2>
          <p className="text-xs text-text-muted">
            Upload images or PDF documents. Enforces 5MB size limit and safe MIME types. Automatically uses Cloudinary/S3 in cloud or local disk fallback.
          </p>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center">
            <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,application/pdf"
              className="text-xs text-text-secondary"
            />
            {uploading && <p className="text-xs text-primary mt-2">Uploading file to storage adapter...</p>}
          </div>

          {uploadedUrl && (
            <div className="p-4 rounded-xl bg-white/5 border border-border space-y-2">
              <span className="text-xs font-mono text-emerald-400 block">Uploaded URL:</span>
              <div className="flex items-center justify-between gap-2 bg-bg px-3 py-1.5 rounded-lg text-xs font-mono text-text-secondary">
                <span className="truncate">{uploadedUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(uploadedUrl);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 2000);
                  }}
                  className="p-1 text-primary hover:text-white"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals for Projects, Skills, Learning, Journey, Certifications, Achievements, Experience, Education */}
      {projectModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setProjectModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Slug</label>
                <input
                  type="text"
                  required
                  value={projectForm.slug || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Summary</label>
                <textarea
                  rows={2}
                  required
                  value={projectForm.summary || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Problem Statement</label>
                <textarea
                  rows={2}
                  value={projectForm.problem || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Solution Architecture</label>
                <textarea
                  rows={2}
                  value={projectForm.solution || ''}
                  onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Project
              </button>
            </form>
          </div>
        </div>
      )}

      {skillModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingSkill ? 'Edit Skill Group' : 'New Skill Group'}</h3>
              <button onClick={() => setSkillModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Category Name</label>
                <input
                  type="text"
                  required
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Skills (Comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="React, TypeScript, FastAPI"
                  value={skillForm.itemsStr}
                  onChange={(e) => setSkillForm({ ...skillForm, itemsStr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Skill Group
              </button>
            </form>
          </div>
        </div>
      )}

      {learningModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingLearning ? 'Edit Learning Goal' : 'New Learning Goal'}</h3>
              <button onClick={() => setLearningModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveLearning} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Goal / Topic Name</label>
                <input
                  type="text"
                  required
                  value={learningForm.name || ''}
                  onChange={(e) => setLearningForm({ ...learningForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Category</label>
                <input
                  type="text"
                  value={learningForm.category || ''}
                  onChange={(e) => setLearningForm({ ...learningForm, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Status</label>
                <input
                  type="text"
                  value={learningForm.status || ''}
                  onChange={(e) => setLearningForm({ ...learningForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Learning Goal
              </button>
            </form>
          </div>
        </div>
      )}

      {journeyModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingJourney ? 'Edit Milestone' : 'New Milestone'}</h3>
              <button onClick={() => setJourneyModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveJourney} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Year</label>
                <input
                  type="text"
                  required
                  value={journeyForm.year || ''}
                  onChange={(e) => setJourneyForm({ ...journeyForm, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Title</label>
                <input
                  type="text"
                  required
                  value={journeyForm.title || ''}
                  onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Tag</label>
                <input
                  type="text"
                  value={journeyForm.tag || ''}
                  onChange={(e) => setJourneyForm({ ...journeyForm, tag: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Description</label>
                <textarea
                  rows={3}
                  required
                  value={journeyForm.description || ''}
                  onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Milestone
              </button>
            </form>
          </div>
        </div>
      )}

      {certModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingCert ? 'Edit Certification' : 'New Certification'}</h3>
              <button onClick={() => setCertModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveCert} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Title</label>
                <input
                  type="text"
                  required
                  value={certForm.title || ''}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Issuer</label>
                <input
                  type="text"
                  required
                  value={certForm.issuer || ''}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Date</label>
                <input
                  type="text"
                  required
                  value={certForm.date || ''}
                  onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Credential URL</label>
                <input
                  type="url"
                  value={certForm.credential_url || ''}
                  onChange={(e) => setCertForm({ ...certForm, credential_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Certification
              </button>
            </form>
          </div>
        </div>
      )}

      {achieveModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingAchieve ? 'Edit Achievement' : 'New Achievement'}</h3>
              <button onClick={() => setAchieveModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveAchieve} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Title</label>
                <input
                  type="text"
                  required
                  value={achieveForm.title || ''}
                  onChange={(e) => setAchieveForm({ ...achieveForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Organization</label>
                <input
                  type="text"
                  required
                  value={achieveForm.organization || ''}
                  onChange={(e) => setAchieveForm({ ...achieveForm, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Date</label>
                <input
                  type="text"
                  required
                  value={achieveForm.date || ''}
                  onChange={(e) => setAchieveForm({ ...achieveForm, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Badge / Placement</label>
                <input
                  type="text"
                  value={achieveForm.badge || ''}
                  onChange={(e) => setAchieveForm({ ...achieveForm, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Description</label>
                <textarea
                  rows={2}
                  required
                  value={achieveForm.description || ''}
                  onChange={(e) => setAchieveForm({ ...achieveForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Achievement
              </button>
            </form>
          </div>
        </div>
      )}

      {expModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingExp ? 'Edit Experience' : 'New Experience'}</h3>
              <button onClick={() => setExpModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveExp} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Role Title</label>
                <input
                  type="text"
                  required
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Period (e.g. Jan 2026 - Present)</label>
                <input
                  type="text"
                  required
                  value={expForm.period}
                  onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Bullet Points (One per line)</label>
                <textarea
                  rows={3}
                  required
                  value={expForm.pointsStr}
                  onChange={(e) => setExpForm({ ...expForm, pointsStr: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Experience
              </button>
            </form>
          </div>
        </div>
      )}

      {eduModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 rounded-3xl border border-border max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-text-primary">{editingEdu ? 'Edit Education' : 'New Education'}</h3>
              <button onClick={() => setEduModalOpen(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <form onSubmit={handleSaveEdu} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Institution / School</label>
                <input
                  type="text"
                  required
                  value={eduForm.school || ''}
                  onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Degree & CGPA</label>
                <input
                  type="text"
                  required
                  value={eduForm.degree || ''}
                  onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-text-muted">Period (e.g. 2023 - 2027)</label>
                <input
                  type="text"
                  required
                  value={eduForm.period || ''}
                  onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-bg-surface border border-border text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary-hover"
              >
                Save Education
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
