import http from '@/http';
import { ISignedIn } from '@/models/ISignedIn';
import { IError } from '@/models/IError';


class AuthService {
  signInLocal(username: string, password: string) {
    return http.post<ISignedIn>('/auth/signin', { username, password });
  }
  signUpLocal(email: string, username: string, password: string) {
    return http.post<ISignedIn>('/auth/signup', { email, username, password });
  }
  /** signin and signup with google. */
  signWithGoogle() {
    return http.get('/auth/google');
  }
  /** signin and signup with 42 */
  signWithFortyTwo() {
    return http.get('/auth/42');
  }
  /** Get a new access_token. Must provide the refresh token */
  refresh() {
    return http.post('/auth/refresh');
  }
  /** Will delete refresh token from db */
  logout() {
    return http.post('/auth/logout');
  }
  deleteAccount() {
    return http.delete('/users');
  }
}
export default new AuthService();
