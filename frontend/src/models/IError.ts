/** Error returned by the server */
export interface IError {
  statusCode: number;
  message: string;
  error?: string;
}
