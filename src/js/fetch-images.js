import axios from "axios";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32610893-863f6f38df2fba6558192cffb';

// const options = {
//   headers: {
//     Authorization: '32610893-863f6f38df2fba6558192cffb',
//   },
// };

// const url = `${BASE_URL}/?q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`;


function fetchImages(name, page = 1, perPage = 40) {
	return fetch(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
		.then(resp => {
			if (!resp.ok) {
				throw new Error(resp.statusText);
			}
			return resp.json();
		});
}



// async function fetchImages(name, page = 1, perPage = 40) {
//   try {
//     const response = await fetch(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);

//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }

//     const data = await response.json();
//     return data;
//     // return response.data;
//   } catch (error) {
//     console.log(error);
//   }
// }

export { fetchImages };

//   .then(resp => {
//   if (!resp.ok) {
//     throw new Error(resp.statusText);
//   }
//   // console.log(resp);
//   return resp.json();
// });



// function fetchImages(name) {
//   const url = `${BASE_URL}/?q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`;

//   axios.get(url, options)
//     .then(resp => console.log(resp));
// }

// axios.get('/user?ID=12345')
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .finally(function () {
//     // always executed
//   });


// async function getUser() {
//   try {
//     const response = await axios.get('/user?ID=12345');
//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// }

// export async function fetchData(value, page) {
//   const KEY = '32337632-b40042b7961cd0f381dab24cb';
//   const BASE_URL = `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

//   const response = await axios.get(BASE_URL);
//   return response.data;
// }
