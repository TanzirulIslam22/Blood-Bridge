export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const canDonateTo = (donorGroup, recipientGroup) => {
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

  return donorRh === '-' || recipientRh === '+';
};

export const compatibleDonorGroups = (recipientGroup) => {
  return BLOOD_GROUPS.filter(g => canDonateTo(g, recipientGroup));
};

export const canReceiveFrom = (recipientGroup, donorGroup) => canDonateTo(donorGroup, recipientGroup);

export const isUniversalDonor = (group) => group === 'O-';
export const isUniversalRecipient = (group) => group === 'AB+';
