import axios from "axios";

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32610893-863f6f38df2fba6558192cffb';

// const options = {
//   headers: {
//     Authorization: '32610893-863f6f38df2fba6558192cffb',
//   },
// };

// const url = `${BASE_URL}/?q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`;


// * async axios
async function fetchImages(name, page = 1, perPage = 200) {
  const resp = await axios.get(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);

  return resp.data;
}

export { fetchImages };

// * fetch
// function fetchImages(name, page = 1, perPage = 40) {
//   return fetch(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
//     .then(resp => {
//       if (!resp.ok) {
//         throw new Error(resp.statusText);
//       }
//       return resp.json();
//     });
// }

// * axios
// function fetchImages(name, page = 1, perPage = 40) {
//   return axios.get(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`)
//     .then(resp => {
//       if (!resp.ok) {
//         throw new Error(resp.statusText);
//       }
//       return resp.data;
//     })
// }

// * async + try catch
// async function fetchImages(name, page = 1, perPage = 40) {
//   try {
//     const resp = await fetch(`${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);

//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }

//     const data = await resp.json();

//     return data;
//   } catch (error) {
//     console.log(error);
//   }
// }
