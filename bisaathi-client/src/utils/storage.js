const STORAGE_KEYS = {
  SCORE: "bis_score",
  SCANS: "bis_scans",
  VIOLATIONS: "bis_violations",
  COMPLAINTS: "bis_complaints",
  BADGES: "bis_badges",
  MISSIONS: "bis_missions_done",
  TOKEN: "bis_user_token",
  ADMIN_TOKEN: "bis_admin_token"
};

export const getLocalData = () => {
  return {
    score: parseInt(localStorage.getItem(STORAGE_KEYS.SCORE)) || 0,
    scans: parseInt(localStorage.getItem(STORAGE_KEYS.SCANS)) || 0,
    violations: parseInt(localStorage.getItem(STORAGE_KEYS.VIOLATIONS)) || 0,
    complaints: parseInt(localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) || 0,
    badges: JSON.parse(localStorage.getItem(STORAGE_KEYS.BADGES)) || [],
    missions: JSON.parse(localStorage.getItem(STORAGE_KEYS.MISSIONS)) || []
  };
};

export const saveLocalData = (data) => {
  if (data.score !== undefined) localStorage.setItem(STORAGE_KEYS.SCORE, data.score);
  if (data.scans !== undefined) localStorage.setItem(STORAGE_KEYS.SCANS, data.scans);
  if (data.violations !== undefined) localStorage.setItem(STORAGE_KEYS.VIOLATIONS, data.violations);
  if (data.complaints !== undefined) localStorage.setItem(STORAGE_KEYS.COMPLAINTS, data.complaints);
  if (data.badges) localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(data.badges));
  if (data.missions) localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(data.missions));
};

export const clearLocalData = () => {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};
