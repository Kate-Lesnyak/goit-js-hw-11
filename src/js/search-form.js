console.log('fffaaa');
import { Notify } from "notiflix";

import { fetchImages } from './fetch-images';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// input: document.querySelector('.input-wrapper'),
const refs = {
  form: document.querySelector('#search-form'),
  galleryImages: document.querySelector('.js-gallery'),
  buttonLoadMore: document.querySelector('.js-load-more-btn')
}

let nameImage = '';
let page = 1;
const perPage = 40;
let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// *buttonLoadMore
// refs.buttonLoadMore.style.visibility = "hidden";
// refs.buttonLoadMore.hidden = true;

console.dir(refs.form);
console.dir(refs.buttonLoadMore);

refs.form.addEventListener('submit', onFormSubmit);
// refs.form.addEventListener('input', onFormInput);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

// function onFormInput(e) {
//   // const nameImage = e.target.value;
//   clearGalleryImages();
// }


// * 1 вар
function onFormSubmit(e) {
  e.preventDefault();

  nameImage = e.currentTarget.elements.searchQuery.value.trim();
  console.log(nameImage);

  if (!nameImage) {
    return Notify.info('Please, fill in the search field!');
  }

  // refs.buttonLoadMore.classList.add('visually-hidden');
  // refs.buttonLoadMore.hidden = true;

  clearGalleryImages();
  page = 1;

  if (nameImage) {
    fetchImages(nameImage)
      .then(data => {
        console.log(data);

        if (!data.hits.length) {
          // refs.buttonLoadMore.hidden = true;
          // refs.buttonLoadMore.classList.add('visually-hidden');
          return Notify.failure('Sorry, there are no images matching your search query. Please try again');
        }

        if (page === 1) {
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }

        if (data.totalHits < perPage) {
          // refs.buttonLoadMore.hidden = true;
          refs.buttonLoadMore.classList.add('visually-hidden');
        } else {
          // refs.buttonLoadMore.hidden = false;
          refs.buttonLoadMore.classList.remove('visually-hidden');
        }

        renderImages(data);

        // *buttonLoadMore
        // refs.buttonLoadMore.hidden = false;
        // refs.buttonLoadMore.style.visibility = "visible";
        // refs.buttonLoadMore.classList.remove('visually-hidden');
        console.dir(refs.buttonLoadMore);

        // searchAllImages(data);
      })
      .catch(error => console.log(error))
      .finally(() => refs.form.reset());
  }
}

// * 2 вар
// function onFormSubmit(e) {
//   e.preventDefault();

//   nameImage = e.currentTarget.elements.searchQuery.value.trim();
//   console.log(nameImage);

//   if (!nameImage) {
//     return Notify.info('Please, fill in the search field!');
//   }

//   clearGalleryImages();
//   page = 1;

//   if (nameImage) {
//     fetchImagesData();
//   }

//   refs.form.reset();
// }

// async function fetchImagesData() {
//   try {
//     const response = await fetchImages(nameImage);

//     if (!data.hits.length) {
//       refs.buttonLoadMore.hidden = true;
//       return Notify.failure('Sorry, there are no images matching your search query. Please try again');
//     }

//     if (page === 1) {
//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//     }

//     if (data.totalHits < perPage) {
//       refs.buttonLoadMore.classList.add('visually-hidden');
//     } else {
//       refs.buttonLoadMore.classList.remove('visually-hidden');
//     }
//     renderImages(data);

//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// }


function onButtonLoadMoreClick() {
  page += 1;
  console.log(page);

  // *buttonLoadMore
  // refs.buttonLoadMore.disabled = true;

  fetchImages(nameImage, page)
    .then(data => {
      console.log(data);

      if (!data.hits.length) {
        // refs.buttonLoadMore.hidden = true;
        refs.buttonLoadMore.classList.add('visually-hidden');
        Notify.failure("We're sorry, but you've reached the end of search results");
      }

      renderImages(data);



      // *buttonLoadMore
      // refs.buttonLoadMore.style.visibility = "visible";
      // refs.buttonLoadMore.disabled = false;

      console.dir(refs.galleryImages);
    })
    .catch(onFetchError);
  // .catch(error => console.log(error));
}


// if (data.totalHits === refs.galleryImages.children.length) {
//   refs.buttonLoadMore.hidden = true;
//   return Notify.info("We're sorry, but you've reached the end of search results");
// }

function onFetchError() {
  // refs.buttonLoadMore.hidden = true;
  // refs.buttonLoadMore.disabled = true;

  // if (refs.galleryImages.children.length === data.totalHits) {
  //   refs.buttonLoadMore.classList.add('visually-hidden');
  //   Notify.failure("We're sorry, but you've reached the end of search results");
  // }

  refs.buttonLoadMore.hidden = true;
  // refs.buttonLoadMore.classList.add('visually-hidden');
  return Notify.failure("We're sorry, but you've reached the end of search results");
}

// console.log(refs.galleryImages.children.length);

function renderImages({ hits }) {
  // if (!hits.length) {
  //   refs.buttonLoadMore.classList.add('visually-hidden');
  //   return Notify.failure('Sorry, there are no images matching your search query. Please try again');
  // }

  // if (page === 1) {
  //   Notify.success(`Hooray! We found ${totalHits} images.`);
  // }

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

  console.log(refs.galleryImages.children.length);

  refs.galleryImages.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();

  if (page !== 1) {
    smoothScrolling();
  }
}

function smoothScrolling() {
  // const { height: cardHeight } = refs.galleryImages
  //   .firstElementChild.getBoundingClientRect();

  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}

function clearGalleryImages() {
  refs.galleryImages.innerHTML = '';
}
