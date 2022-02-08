import axios, { AxiosInstance } from "axios";
import store from "./store";

// The backend api
const myApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
	headers: {
    'Authorization': '',
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

// interceptor to manage expired token ?
// myApi.interceptors.request.use(function (config) {
// 	const token = store.getState().session.token;
// 	config.headers.Authorization =  token;
// 	return config;
// });

// api 42 ?
// const ftApi = axios.create({
// 	baseURL: "http://some-other/api/v2",
// 	timeout: 1000,
// 	headers: {}
// });

// const apiClient: AxiosInstance = axios.create({
	//   baseURL: 'https://api.openbrewerydb.org',
	//   headers: {
		//     'Content-type': 'application/json',
		//   },
		// })
		// export default apiClient
		
export default myApi