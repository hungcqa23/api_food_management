import bcrypt from 'bcrypt';
export const correctPassword = async (candidatePassword: string, userPassword: string) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};
