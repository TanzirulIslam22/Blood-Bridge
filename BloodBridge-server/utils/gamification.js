const DONATION_COOLDOWN_DAYS = 90;

const BADGE_DEFINITIONS = [
  { id: 'first-blood', name: 'First Blood', icon: '🩸', threshold: 1, description: 'Made your first donation' },
  { id: 'bronze', name: 'Bronze Donor', icon: '🥉', threshold: 1, description: 'Completed 1 donation' },
  { id: 'silver', name: 'Silver Donor', icon: '🥈', threshold: 3, description: 'Completed 3 donations' },
  { id: 'gold', name: 'Gold Donor', icon: '🥇', threshold: 5, description: 'Completed 5 donations' },
  { id: 'platinum', name: 'Platinum Donor', icon: '💎', threshold: 10, description: 'Completed 10 donations' }
];

const computeBadges = (donationCount) => {
  const earned = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (donationCount >= badge.threshold) {
      earned.push(badge.id);
    }
  }
  return earned;
};

const nextBadge = (donationCount) => {
  for (const badge of BADGE_DEFINITIONS) {
    if (donationCount < badge.threshold) {
      return { ...badge, progress: donationCount, needed: badge.threshold };
    }
  }
  return null;
};

const nextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) return null;
  const date = new Date(lastDonationDate);
  date.setDate(date.getDate() + DONATION_COOLDOWN_DAYS);
  return date;
};

const isEligible = (user) => {
  const next = nextEligibleDate(user.lastDonationDate);
  if (!next) return true;
  return next.getTime() <= Date.now();
};

module.exports = {
  DONATION_COOLDOWN_DAYS,
  BADGE_DEFINITIONS,
  computeBadges,
  nextBadge,
  nextEligibleDate,
  isEligible
};
