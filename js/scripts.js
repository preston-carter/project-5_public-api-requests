/******************************************
Treehouse Techdegree:
FSJS Project 5 - Public API Requests
Developer: Preston Carter
https://github.com/preston-carter
scripts.js
******************************************/

/***
  Global Variables
***/

const $search = $('.search-container');
const $profileGallery = $('.gallery');
const $body = $('body');
let profileData = [];

/*
* Fetch API Function
*/

fetch('https://randomuser.me/api/?results=12&nat=us&inc=picture,name,email,location,cell,dob')
  .then(checkStatus)
  .then(response => response.json())
  .then(data => {
    profileData = data.results;
    console.log(profileData);
    appendProfileData(profileData);
  })
  .catch(error => console.log('Looks like there was a problem!', error));

/*
* Helper Functions
*/

function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  }
  else {
    return Promise.reject(new Error(response.statusText));
  }
}

function appendProfileData(profile) {

  profileData.forEach(profile => {

    const $profileCard = $('<div class="card"></div>');

    $profileCard.html(`
      <div class="card-img-container">
          <img class="card-img" src="${profile.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
          <p class="card-text">${profile.email}</p>
          <p class="card-text cap">${profile.location.city}</p>
      </div>
    `);

    $profileGallery.append($profileCard);

    $profileCard.click( () => {
      addModalWindow(profile);
    });
  });
}

function addModalWindow(profile) {

  const $modalContainer = $('<div class="modal-container"></div>');

  const cell = profile.cell;
  const cellConstructor = `${cell.substr(0,5)} ${cell.substr(6,)}`;
  const bday = profile.dob.date;
  const bdayConstructor = `${bday.substr(5,2)}/${bday.substr(8,2)}/${bday.substr(0,4)}`;

  $modalContainer.html(`
    <div class="modal">
      <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
      <div class="modal-info-container">
          <img class="card-img" src="${profile.picture.large}" alt="profile picture">
          <h3 id="name" class="modal-name cap">${profile.name.first} ${profile.name.last}</h3>
          <p class="modal-text">${profile.email}</p>
          <p class="modal-text cap">${profile.location.city}</p>
          <hr>
          <p class="modal-text">${cellConstructor}</p>
          <p class="modal-text">${profile.location.street.number} ${profile.location.street.name},
            ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}</p>
          <p class="modal-text">Birthday: ${bdayConstructor}</p>
      </div>
    </div>
  `);

  $body.append($modalContainer);

  let profileIndex = $.inArray(profile, profileData);
  const $modalButtons = $('<div class="modal-btn-container"></div>');

  if( profileIndex === 0) {
    $modalButtons.html(`<button type="button" id="modal-next" class="modal-next btn">Next</button>
    `);
    $('.modal').append($modalButtons);
  }
  else if ( profileIndex === 11) {
    $modalButtons.html(`<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    `);
    $('.modal').append($modalButtons);
  }
  else {
    $modalButtons.html(`<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    `);
    $('.modal').append($modalButtons);
  }

  $('.modal-close-btn').click( () => {
    $modalContainer.remove();
  });

  $body.click( (e) => {
    if($modalContainer.show()) {
      if( $(e.target).hasClass('modal-container')) {
        $modalContainer.remove();
      }
    }
  });

  const $prevButton = $('#modal-prev');
  const $nextButton = $('#modal-next');

  $prevButton.click( () => {
    $modalContainer.remove();
    profileIndex -= 1;
    addModalWindow(profileData[profileIndex]);
  });

  $nextButton.click( () => {
    $modalContainer.remove();
    profileIndex += 1;
    addModalWindow(profileData[profileIndex]);
  });
}
