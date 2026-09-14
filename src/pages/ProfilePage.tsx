import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { updateUserProfile } from '../services/dbService';
import { 
  Settings, 
  LogOut, 
  User, 
  Check, 
  CheckCircle2,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { authUser, userProgress, activeCourse, availableCourses, setOnboardingData, updateAvatar, signOutUser } = useUser();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProgress.studentName);
  const [avatarInput, setAvatarInput] = useState(userProgress.avatarUrl);
  const [selectedCourse, setSelectedCourse] = useState(userProgress.selectedCourseId);
  const [selectedYear, setSelectedYear] = useState<number>(userProgress.selectedYear);
  const [selectedSemester, setSelectedSemester] = useState<number>(userProgress.selectedSemester);

  const [savingMsg, setSavingMsg] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const newImg = reader.result;
          setAvatarInput(newImg);
          updateAvatar(newImg);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMsg(null);

    // Save changes
    setOnboardingData(
      selectedCourse,
      selectedYear as 1 | 2 | 3 | 4,
      selectedSemester as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
    );

    if (avatarInput) {
      updateAvatar(avatarInput);
    }

    if (authUser && authUser.id !== 'demo-user-id') {
      await updateUserProfile(authUser.id, {
        full_name: nameInput,
        avatar_url: avatarInput,
        course_id: selectedCourse,
        year: selectedYear,
        semester: selectedSemester
      });
    }

    setSavingMsg('Profile settings updated successfully!');
    setIsEditing(false);
    setTimeout(() => setSavingMsg(null), 3000);
  };

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/auth');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={avatarInput || userProgress.avatarUrl}
              alt={userProgress.studentName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-4 ring-indigo-500/40 shadow-xl"
            />
            <label className="absolute inset-0 bg-slate-950/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="w-5 h-5 text-white" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{userProgress.studentName}</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                Level {userProgress.level} Scholar
              </span>
            </div>
            <p className="text-xs text-slate-400">{userProgress.email}</p>
            <p className="text-xs font-bold text-indigo-400 mt-1">{activeCourse.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(prev => !prev)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {savingMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savingMsg}</span>
        </div>
      )}

      {/* Edit Form or Profile Overview */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 animate-fade-in">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Edit Profile & Learning Path</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Profile Picture</label>
              <div className="flex items-center gap-3">
                <img
                  src={avatarInput || userProgress.avatarUrl}
                  alt="Avatar Preview"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                />
                <label className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center gap-2 transition-all text-xs">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>Choose Photo from Gallery</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-300">Degree Course</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {availableCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Degree Year</label>
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4].map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Semester</label>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl gradient-bg-primary text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Academic Overview Details */
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Academic Profile Overview</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Degree Specialization</span>
              <span className="font-bold text-white text-sm">{activeCourse.name}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Academic Year & Semester</span>
              <span className="font-bold text-indigo-400 text-sm">
                Year {userProgress.selectedYear} • Semester {userProgress.selectedSemester}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Strongest Subject</span>
              <span className="font-bold text-emerald-400 text-sm">{userProgress.strongestSubject}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-slate-500 block text-[11px]">Focus Revision Required</span>
              <span className="font-bold text-amber-400 text-sm">{userProgress.needsFocusSubject}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
