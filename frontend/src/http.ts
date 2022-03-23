import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "./store/auth";

// The backend api
const myApi: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_SERVER_URI,
	headers: {
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

myApi.interceptors.request.use( config => {
	config.headers!['Authorization'] = useAuthStore().tokenBearer;
	return config;
});

//https://thedutchlab.com/blog/using-axios-interceptors-for-refreshing-your-api-token
// interceptor to manage expired token ?
// myApi.interceptors.response.use(
//   response => {
//     if (response.status === 200 || response.status === 201) {
//       return Promise.resolve(response);
//     } else {
//       return Promise.reject(response);
//     }
//   },
// 	error => {
//     if (error.response.status) {
//       switch (error.response.status) {
//         case 400:

//          //do something
//           break;

//         case 401:
//           alert("session expired");
//           break;        case 403:
//           router.replace({
//             path: "/login",
//             query: { redirect: router.currentRoute.fullPath }
//           });           break;        case 404:
//           alert('page not exist');
//           break;        case 502:
//          setTimeout(() => {
//             router.replace({
//               path: "/login",
//               query: {
//                 redirect: router.currentRoute.fullPath
//               }
//             });
//           }, 1000);
//       }
//       return Promise.reject(error.response);
//     }
//   }
// );
		
export default myApi