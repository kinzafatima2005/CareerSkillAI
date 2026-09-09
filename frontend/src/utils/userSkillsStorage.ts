import { useState, useEffect } from 'react';

const STORAGE_KEY = 'careerskill_user_skills';
export const DEFAULT_USER_SKILLS = ['Python', 'SQL', 'Pandas', 'Docker'];

export const getUserSkills = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored user skills', e);
  }
  return DEFAULT_USER_SKILLS;
};

export const saveUserSkills = (skills: string[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    window.dispatchEvent(new Event('careerskill_skills_updated'));
  } catch (e) {
    console.error('Failed to save user skills', e);
  }
};

export const useUserSkills = (): [string[], (newSkills: string[]) => void] => {
  const [skills, setSkillsState] = useState<string[]>(getUserSkills());

  useEffect(() => {
    const handleUpdate = () => {
      setSkillsState(getUserSkills());
    };
    window.addEventListener('careerskill_skills_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('careerskill_skills_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateSkills = (newSkills: string[]) => {
    setSkillsState(newSkills);
    saveUserSkills(newSkills);
  };

  return [skills, updateSkills];
};
