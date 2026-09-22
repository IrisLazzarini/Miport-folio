// Add only verified professional information. Empty fields stay unpublished.
export const profile = {
  cvUrl: null, // Relative PDF path or full HTTPS link to the actual CV.
  experiences: [],
  projectContributions: { agromapa: null }, // Use { es: '', en: '' } when confirmed.
  // Each experience uses these fields:
  // { role: { es: '', en: '' }, organization: '', period: { es: '', en: '' },
  //   responsibilities: { es: '', en: '' }, outcome: { es: '', en: '' } }
  // The default page shows documented project experience, without invented dates.
};
