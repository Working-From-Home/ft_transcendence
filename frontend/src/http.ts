import axios, { AxiosInstance } from "axios";
import store from "./store";

// The backend api
const myApi: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_SERVER_URI,
	headers: {
    'Authorization': '',
    'Content-type': 'application/json'
	},
	withCredentials: undefined
});

myApi.interceptors.request.use( config => {
	const token = store.getters['token'];
	if (token)
		config.headers!['Authorization'] = 'Bearer ' + token
	return config;
});



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