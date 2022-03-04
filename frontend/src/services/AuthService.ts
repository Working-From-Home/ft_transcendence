import http from '@/http';
import { ISignedIn } from '@/models/ISignedIn';
import { IUser } from '@/models/IUser';

class AuthService {
  signInLocal(email: string, password: string) {
    return http.post<ISignedIn>('/auth/signin', { email, password });
  }
  signUpLocal(email: string, password: string) {
    return http.post<ISignedIn>('/auth/signup', { email, password });
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
