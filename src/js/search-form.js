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
const perPage = 200;
let gallery = new SimpleLightbox('.js-gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.buttonLoadMore.hidden = true;

console.dir(refs.buttonLoadMore);

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoadMore.addEventListener('click', onButtonLoadMoreClick);

// * 1 вар
// function onFormSubmit(e) {
//   e.preventDefault();

//   nameImage = e.currentTarget.elements.searchQuery.value.trim();
//   console.log(nameImage);

//   if (!nameImage) {
//     return Notify.info('Please, fill in the search field!');
//   }

//   // refs.buttonLoadMore.classList.add('visually-hidden');
//   // refs.buttonLoadMore.hidden = true;

//   clearGalleryImages();
//   page = 1;

//   if (nameImage) {
//     fetchImages(nameImage)
//       .then(data => {
//         console.log(data);

//         if (!data.hits.length) {
//           // refs.buttonLoadMore.hidden = true;
//           // refs.buttonLoadMore.classList.add('visually-hidden');
//           return Notify.failure('Sorry, there are no images matching your search query. Please try again');
//         }

//         if (page === 1) {
//           Notify.success(`Hooray! We found ${data.totalHits} images.`);
//         }

//         if (data.totalHits < perPage) {
//           // refs.buttonLoadMore.hidden = true;
//           refs.buttonLoadMore.classList.add('visually-hidden');
//         } else {
//           // refs.buttonLoadMore.hidden = false;
//           refs.buttonLoadMore.classList.remove('visually-hidden');
//         }

//         renderImages(data);

//         // *buttonLoadMore
//         // refs.buttonLoadMore.hidden = false;
//         // refs.buttonLoadMore.style.visibility = "visible";
//         // refs.buttonLoadMore.classList.remove('visually-hidden');
//         console.dir(refs.buttonLoadMore);

//         // searchAllImages(data);
//       })
//       .catch(error => console.log(error))
//       .finally(() => refs.form.reset());
//   }
// }

// ! 2 вар
async function onFormSubmit(e) {
  try {
    e.preventDefault();

    nameImage = e.currentTarget.elements.searchQuery.value.trim();
    console.log(nameImage);

    if (!nameImage) {
      return Notify.info('Please, fill in the search field!');
    }

    clearGalleryImages();
    page = 1;

    if (nameImage) {
      const data = await fetchImages(nameImage);

      if (!data.hits.length) {
        return Notify.failure('Sorry, there are no images matching your search query. Please try again');
      }

      if (page === 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }

      if (data.totalHits < perPage) {
        refs.buttonLoadMore.hidden = true;
      } else {
        refs.buttonLoadMore.hidden = false;
      }

      // if (data.totalHits < perPage) {
      //   refs.buttonLoadMore.classList.remove('is-hidden');
      // }
      // else {
      //   refs.buttonLoadMore.classList.add('is-hidden');
      // }

      renderImages(data);

      // })
      // .catch (error => console.log(error))
      // .finally(() => refs.form.reset());
      refs.form.reset();
    }
  } catch (eroor) {
    console.log(eroor);
  }
}


// * 1 вар
// function onButtonLoadMoreClick() {
//   page += 1;
//   console.log(page);

//   // *buttonLoadMore
//   // refs.buttonLoadMore.disabled = true;

//   fetchImages(nameImage, page, perPage)
//     .then(data => {
//       console.log(data);

//       if (data.hits.length < perPage) {
//         // refs.buttonLoadMore.hidden = true;
//         refs.buttonLoadMore.classList.add('visually-hidden');
//         Notify.failure("We're sorry, but you've reached the end of search results");
//       }

//       renderImages(data);



//       // *buttonLoadMore
//       // refs.buttonLoadMore.style.visibility = "visible";
//       // refs.buttonLoadMore.disabled = false;

//       console.dir(refs.galleryImages);
//     })
//     .catch(onFetchError);
//   // .catch(error => console.log(error));
// }

// ! 2 вар
async function onButtonLoadMoreClick() {
  try {
    page += 1;
    console.log(page);


    // refs.buttonLoadMore.hidden = true;

    const data = await fetchImages(nameImage, page, perPage);

    if (data.hits.length < perPage) {
      onFetchError();
    }

    // if (page * perPage >= data.totalHits) {
    // onFetchError();

    //   refs.buttonLoadMore.classList.remove('is-hidden');
    //   Notify.failure("We're sorry, but you've reached the end of search results");
    // }

    renderImages(data);
  } catch (error) {
    onFetchError();
    console.log(error);
  }
}

function onFetchError() {
  // refs.buttonLoadMore.hidden = true;

  // refs.buttonLoadMore.classList.remove('is-hidden');
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

  console.log(refs.galleryImages.children.length);

  refs.galleryImages.insertAdjacentHTML('beforeend', markup);

  gallery.refresh();

  if (page !== 1) {
    smoothScrolling();
  }
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

function clearGalleryImages() {
  refs.galleryImages.innerHTML = '';
}
