import axios from 'axios';

// name export
// export { axiosSearch };

// default export
export default axiosSearch;

async function axiosSearch(word, currentPage, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const API_KEY = '40988113-0969bce247b2af623dbb12295';

  const config = {
    params: {
      key: API_KEY,
      q: word,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: currentPage,
      per_page: perPage,
    },
  };

  const axiosResp = await axios.get(`${BASE_URL}`, config);

  console.log(axiosResp);

  return axiosResp;
}
