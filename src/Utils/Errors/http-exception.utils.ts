export class HttpException extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public error?: object
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
