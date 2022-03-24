import http from '@/http';
import { ISignedIn } from '@/models/ISignedIn';
import { IUser } from '@/models/IUser';

class AuthService {
  // local
  signInLocal(email: string, password: string) {
    return http.post<ISignedIn>('/auth/local/signin', { email, password });
  }
  signUpLocal(email: string, password: string) {
    return http.post<ISignedIn>('/auth/local/signup', { email, password });
  }

  // Google
  signInGoogle(params: string) {
    return http.get<ISignedIn>(`/auth/google/signin${params}`, {
      headers: {},
      withCredentials: false,
    });
  }
  signUpGoogle(params: string) {
    return http.get<ISignedIn>(`/auth/google/signup${params}`, {
      headers: {},
      withCredentials: false,
    });
  }
  
  // 42
  signInFortyTwo(params: string) {
    return http.get<ISignedIn>(`/auth/42/signin${params}`, {
      headers: {},
      withCredentials: false,
    });
  }
  signUpFortyTwo(params: string) {
    return http.get<ISignedIn>(`/auth/42/signup${params}`, {
      headers: {},
      withCredentials: false,
    });
  }

	/* Two Factor Auth:  */

	async generateQrCode() {
		const response = await http.post('/2fa/generate', {}, { responseType : 'blob'});
		const fileUrl = window.URL.createObjectURL(response.data);
		return fileUrl;
	}

	turnOnTwoFA(twoFaCode : string) {
		return http.post('/2fa/turn-on', { twoFaCode : twoFaCode });
	}

	authenticateTwoFA(twoFaCode : string) {
		return http.post('/2fa/authenticate', { twoFaCode : twoFaCode });
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
