import argv from 'minimist';
const options = argv(process.argv.slice(2));
export const isProduction = Boolean(options.env === 'production');
export const isDevelopment = Boolean(options.env === 'development');

export const envConfig = {
  port: (process.env.PORT as string) || 8000,
  dbConnectionString: process.env.DB_CONNECTION_STRING as string,
  dbUserName: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  jwtSecretAccess: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretAccessExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretEmailVerifyTokenExpiresIn: process.env.JWT_EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  dbName: process.env.DB_NAME as string
};
