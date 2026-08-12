const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const canDonateTo = (donorGroup, recipientGroup) => {
  if (donorGroup === recipientGroup) return true;

  const donorRh = donorGroup.endsWith('-') ? '-' : '+';
  const recipientRh = recipientGroup.endsWith('-') ? '-' : '+';
  const donorAb = donorGroup.slice(0, -1);
  const recipientAb = recipientGroup.slice(0, -1);

  const aboOk =
    donorAb === 'O' ||
    donorAb === recipientAb ||
    (donorAb === 'A' && recipientAb === 'AB') ||
    (donorAb === 'B' && recipientAb === 'AB');

  if (!aboOk) return false;

  const rhOk = donorRh === '-' || recipientRh === '+';

  return rhOk;
};

const compatibleDonorGroups = (recipientGroup) => {
  return BLOOD_GROUPS.filter(g => canDonateTo(g, recipientGroup));
};

const isUniversalDonor = (group) => group === 'O-';
const isUniversalRecipient = (group) => group === 'AB+';

module.exports = {
  BLOOD_GROUPS,
  canDonateTo,
  compatibleDonorGroups,
  isUniversalDonor,
  isUniversalRecipient
};
