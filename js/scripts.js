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
let profileData = [];

/*
* Fetch API Functions
*/

fetch('https://randomuser.me/api/?results=12&inc=picture,name,email,location')
  .then(checkStatus)
  .then(response => response.json())
  .then(data => storeProfileData(data))
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

function storeProfileData(data) {
  profileData = data.results;
  profileData.forEach(profile => {
    const profileInfo = `
    <div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${profile.picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
            <p class="card-text">${profile.email}</p>
            <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
        </div>
    </div>
    `;
    $profileGallery.append(profileInfo);
  });
  return profileData;
}

/*
* Event Listeners
*/
