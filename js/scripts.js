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
    //Add fetch results to profileData as an array of objects
    profileData = data.results;
    //Run functions to append the 12 fetched profiles to the dom and add search functionality
    appendProfileData(profileData);
    search();
  })
  .catch(error => console.log('Looks like there was a problem!', error));

/*
* Helper Functions
*/

//Only fetch data if no scripting/server errors
function checkStatus(response) {
  if(response.ok) {
    return Promise.resolve(response);
  }
  else {
    return Promise.reject(new Error(response.statusText));
  }
}

//Compile & append html elements for the 12 profile cards
function appendProfileData(profile) {

  profileData.forEach(profile => {

    const $profileContainer = $('<div class="card"></div>');

    $profileContainer.html(`
      <div class="card-img-container">
          <img class="card-img" src="${profile.picture.large}" alt="profile picture">
      </div>
      <div class="card-info-container">
          <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
          <p class="card-text">${profile.email}</p>
          <p class="card-text cap">${profile.location.city}</p>
      </div>
    `);

    $profileGallery.append($profileContainer);

    //Add event listener to run modal window creation function when a card is clicked
    $profileContainer.click( () => {
      addModalWindow(profile);
    });
  });
}

//Create a modal window and associated functionality/listeners for the modal view
function addModalWindow(profile) {

  const $modalContainer = $('<div class="modal-container"></div>');

  //Vars to parse fetch profile data into the proper format
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

  //Vars to store our profileData index and div references to allow next/prev interaction
  let profileIndex = $.inArray(profile, profileData);
  const $modalButtons = $('<div class="modal-btn-container"></div>');
  const $modalDiv = $('.modal');

  //Create next/prev buttons checking for end case scenarios where we only want one button
  if( profileIndex === 0) {
    $modalButtons.html(`<button type="button" id="modal-next" class="modal-next btn">Next</button>
    `);
    $modalDiv.append($modalButtons);
  }
  else if ( profileIndex === 11) {
    $modalButtons.html(`<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
    `);
    $modalDiv.append($modalButtons);
  }
  else {
    $modalButtons.html(`<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
    `);
    $modalDiv.append($modalButtons);
  }

  //Event listeners to close the modal view by clicking the 'X' or by clicking off the window
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

  //Vars and associated listeners for the next/prev functionality
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

//Create and append search feature to the dom
function search() {

  const $form = $('<form action="#" method="get"></form>');

  $form.html(`
      <input type="search" id="search-input" class="search-input" placeholder="Search...">
      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
      <input type="submit" value="🔄" id="search-reset" class="search-submit">
    `);

  $search.append($form);

  //Vars to reference targets for searching + user search input
  const $searchSubmit = $('#search-submit');
  const $searchReset = $('#search-reset');
  const $profileContainer = $('.card');
  const $allProfileNames = $('.card #name');

  //Search input listener on submit button click
  $searchSubmit.click( () => {

    //Reference search input value + only search if field isn't empty
    let $searchInput = $('#search-input').val();

    if($searchInput.lenth !== 0) {
      //Loop through all profile cards look for any names containing input string
      for( let i = 0; i < $profileContainer.length; i += 1) {
        if( $($allProfileNames[i]).text().toLowerCase().includes($searchInput) ) {
          $($profileContainer[i]).show();
        }
        else {
          $($profileContainer[i]).hide();
        }
      }
    }
  });

  //Search reset listener on reset buttton click
  $searchReset.click( () => {
    $profileContainer.show();
    $('form').trigger('reset');
  });

}
