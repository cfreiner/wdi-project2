//Create a DOM element that looks like a real tweet. This is used to make
//Google's info windows look like tweets.
var createDomTweet = function(tweet) {
  var parent = document.createElement('div');
  parent.classList.add('tweet');
  var header = document.createElement('div');
  var body = document.createElement('div');
  var userImage = document.createElement('img');
  userImage.setAttribute('src', tweet.user.profile_image_url);
  userImage.classList.add('user-image');
  var logo = document.createElement('img');
  logo.setAttribute('src', '/images/TwitterLogo.png');
  logo.classList.add('twitter-logo');
  var username = document.createElement('span');
  username.classList.add('username');
  username.textContent = tweet.user.name;
  var screenname = document.createElement('span');
  screenname.classList.add('screen-name');
  screenname.textContent = '@' + tweet.user.screen_name;
  var text = document.createElement('p');
  text.classList.add('tweet-text');
  text.textContent = tweet.text;
  body.appendChild(text);
  header.appendChild(userImage);
  header.appendChild(logo);
  header.appendChild(username);
  header.appendChild(document.createElement('br'));
  header.appendChild(screenname);
  parent.appendChild(header);
  parent.appendChild(body);
  return parent;
};
