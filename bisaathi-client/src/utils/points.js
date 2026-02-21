export const POINTS = {
  SCAN_ANY: 5,
  CATCH_EXPIRED: 25,
  CATCH_SUSPENDED: 35,
  CATCH_INVALID: 20,
  SUBMIT_COMPLAINT: 50,
  COMPLAINT_RESOLVED: 100,
  FIRST_SCAN_BONUS: 10,
  FIRST_COMPLAINT_BONUS: 25,
  MILESTONE_5_SCANS: 15,
  MILESTONE_10_SCANS: 25,
};

export const POINT_REASONS = {
  SCAN_ANY: "Scan recorded",
  CATCH_EXPIRED: "You caught an expired product! 🎯",
  CATCH_SUSPENDED: "You caught a suspended product! 🚨",
  CATCH_INVALID: "You flagged an unregistered product! ⚠️",
  SUBMIT_COMPLAINT: "Complaint submitted — great work! 📋",
  COMPLAINT_RESOLVED: "Your complaint was verified by BIS! 🌟",
  FIRST_SCAN_BONUS: "Welcome bonus — first scan! 🔰",
  FIRST_COMPLAINT_BONUS: "First complaint filed! 📣",
  MILESTONE_5_SCANS: "5 scans milestone reached! ⚡",
  MILESTONE_10_SCANS: "10 scans milestone reached! 🔟",
};

export function calculateAwardedPoints({ result, isFirstScan, isFirstComplaint, scanCount }) {
  const awards = [];
  
  // Base point for any scan
  awards.push({ points: POINTS.SCAN_ANY, reason: POINT_REASONS.SCAN_ANY });
  
  if (isFirstScan) {
    awards.push({ points: POINTS.FIRST_SCAN_BONUS, reason: POINT_REASONS.FIRST_SCAN_BONUS });
  }
  
  if (scanCount === 5) {
    awards.push({ points: POINTS.MILESTONE_5_SCANS, reason: POINT_REASONS.MILESTONE_5_SCANS });
  }
  
  if (scanCount === 10) {
    awards.push({ points: POINTS.MILESTONE_10_SCANS, reason: POINT_REASONS.MILESTONE_10_SCANS });
  }
  
  if (result === "expired") {
    awards.push({ points: POINTS.CATCH_EXPIRED, reason: POINT_REASONS.CATCH_EXPIRED });
  } else if (result === "suspended") {
    awards.push({ points: POINTS.CATCH_SUSPENDED, reason: POINT_REASONS.CATCH_SUSPENDED });
  } else if (result === "not_found") {
    awards.push({ points: POINTS.CATCH_INVALID, reason: POINT_REASONS.CATCH_INVALID });
  }
  
  return awards;
}

export const getRoleFromPoints = (points) => {
  if (points >= 1000) return { name: "Quality Ambassador", badge: "🌟", threshold: 1000, next: null };
  if (points >= 500) return { name: "Senior Inspector", badge: "🕵️", threshold: 500, next: 1000 };
  if (points >= 150) return { name: "Inspector", badge: "🔍", threshold: 150, next: 500 };
  return { name: "Validator", badge: "🏅", threshold: 0, next: 150 };
};
