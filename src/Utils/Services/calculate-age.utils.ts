export function getAge(dob?: Date): number | undefined {
  if (!dob) return undefined; // or return 0 if you prefer

  const today = new Date();
  const dobDate = new Date(dob);

  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  const dayDiff = today.getDate() - dobDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}