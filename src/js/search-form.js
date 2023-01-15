import { Notify } from "notiflix";
import { fetchImages } from './fetch-images';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryImages: document.querySelector('.js-gallery'),
  buttonLoadMore: document.querySelector('.js-load-more-btn')
}

let nameImage = '';
let page = 1;
const perPage = 40;
let gallery = new SimpleLightbox('.js-gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

// * 1 вар
// function onFormSubmit(e) {
//   e.preventDefault();

//   nameImage = e.currentTarget.elements.searchQuery.value.trim();
//   refs.buttonLoadMore.classList.remove('is-hidden');
//   clearGalleryImages();
//   page = 1;

//   if (!nameImage) {
//     return Notify.info('Please, fill in the search field!');
//   }

//   if (nameImage) {
//     fetchImages(nameImage)
//       .then(data => {
//         console.log(data);

//         if (!data.hits.length) {
//           return Notify.failure('Sorry, there are no images matching your search query. Please try again');
//         }

//         if (page === 1) {
//           Notify.success(`Hooray! We found ${data.totalHits} images.`);
//         }

//         if (data.totalHits < perPage) {
//           refs.buttonLoadMore.classList.remove('is-hidden');
//         } else {
//           refs.buttonLoadMore.classList.add('is-hidden');
//         }

//         renderImages(data);
//       })
//       .catch(error => console.log(error))
//       .finally(() => refs.form.reset());
//   }
// }

// ! 2 вар async
async function onFormSubmit(e) {
  try {
    e.preventDefault();
    nameImage = e.currentTarget.elements.searchQuery.value.trim();
    refs.buttonLoadMore.classList.remove('is-hidden');
    clearGalleryImages();
    page = 1;

    if (!nameImage) {
      return Notify.info('Please, fill in the search field!');
    }

    if (nameImage) {
      const data = await fetchImages(nameImage);

      if (!data.hits.length) {
        return Notify.failure('Sorry, there are no images matching your search query. Please try again');
      }

      if (page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      if (data.totalHits < perPage) {
        refs.buttonLoadMore.classList.remove('is-hidden');
      }
      else {
        refs.buttonLoadMore.classList.add('is-hidden');
      }

      renderImages(data);
      refs.form.reset();
    }
  } catch (eroor) {
    console.log(eroor);
  }
}

// * 1 вар
// function onButtonLoadMoreClick() {
//   page += 1;

//   fetchImages(nameImage, page, perPage)
//     .then(data => {
//       console.log(data);

//       if (data.hits.length < perPage) {
//         onFetchError();
//       }

// if (page * perPage >= data.totalHits) {
//   onFetchError();
// }// тогда  в cath без onFetchError()

//       renderImages(data);
//     })
//     .catch(error => {
//       onFetchError();
//       console.log(error);
//     })
// }

// ! 2 вар async
async function onButtonLoadMoreClick() {
  try {
    page += 1;

    const data = await fetchImages(nameImage, page, perPage);

    if (data.hits.length < perPage) {
      onFetchError();
    }

    renderImages(data);
  } catch (error) {
    onFetchError();
    console.log(error);
  }
}

function onFetchError() {
  refs.buttonLoadMore.classList.remove('is-hidden');
  return Notify.failure("We're sorry, but you've reached the end of search results");
}

function renderImages({ hits }) {
  const markup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">

    <a href="${largeImageURL}">
    <div class="card-thumb">
    <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
      </div>
      </a>

  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`).join('');

  refs.galleryImages.insertAdjacentHTML('beforeend', markup);

  gallery.refresh();

  if (page !== 1) {
    smoothScrolling();
  }
}

function clearGalleryImages() {
  refs.galleryImages.innerHTML = '';
}

function smoothScrolling() {
  // const { height: cardHeight } = document
  //   .querySelector('.gallery')
  //   .firstElementChild.getBoundingClientRect();

  const { height: cardHeight } = refs.galleryImages
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}