class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(message: string = 'Error', statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${message}`.startsWith('4') ? 'fail' : 'error';
  }
}

module.exports = AppError;

export default AppError;
