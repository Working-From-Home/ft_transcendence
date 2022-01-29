import axios, { AxiosInstance } from "axios";

// The backend api
const myApi = axios.create({
  baseURL: "http://localhost:3000",
	headers: {},
	withCredentials: undefined
});


// api 42 ?
// var ftApi = axios.create({
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