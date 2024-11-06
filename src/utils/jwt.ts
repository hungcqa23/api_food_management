import jwt from 'jsonwebtoken';

export const signToken = (id: string, secretToken: string, expiresIn: string) => {
  return jwt.sign({ id }, secretToken, {
    expiresIn
  });
};
