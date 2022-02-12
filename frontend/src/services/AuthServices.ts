import http from "@/http"

class AuthService {
	/** signin and signup with google. */
	signWithGoogle(){
		return http.get('/auth/google')
	}
	/** signin and signup with 42 */
	signWithFortyTwo(){
		return http.get('/auth/42')
	}
	signInLocal(username: string, password: string){
		return http.post('/auth/signin', {username, password})
	}
	signUpLocal(email: string, username: string, password: string){
		return http.post('/auth/signup', {email, username, password})
	}
	/** Get a new access_token. Must provide the refresh token */
	refresh(){
		return http.post('/auth/refresh')
	}
	/** Will delete refresh token from db */
	logout(){
		return http.post('/auth/logout')
	}
}
export default new AuthService();
