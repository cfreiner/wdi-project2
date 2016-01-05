#WDI Project 2: Crow's Nest

## Summary
This app provides a visualization of tweets on a map.  The user can input a location, which causes the map to center on that location.  Geolocated tweets are streamed in real-time through Twitter's streaming API.  Only a small percentage of tweets are tagged with the user's exact location.  Many tweets are picked up by the app because they originate within the bounds of the map, or are "about" a location on the map, but they are not visualized.  The only tweets that are displayed are ones with exact user coordinates, or tagged with a specific point of interest that exists in Google's Places API.  A history page lists the locations that the user has visited in the app on a world map.

## Technologies used
* Node.js & Express.js server
* Postgres & Sequelize backend
* Passport & OAuth for authentication
* Socket.io & Twit for streaming tweets
* Bootstrap for front-end

## API's
* Twitter streaming API
* Google Maps
* Google Places

## Ongoing issues and future implementations
Twitter's OAuth callback doesn't come with an email address, so users who log in via Twitter have null entries for their email and username. In the future, I plan to implement a form for these users to complete their account information for local authentication. I would also like to make the t.co links in tweets clickable in the Google maps info windows.

Perhaps the biggest downfall of the app is the limited number of tweets that are tagged with exact locations. This is a result of Twitter moving towards a Four Square-based place-centric check-in system and away from users tagging their exact geocoordinates.  When use of this place-tagging system becomes more prevalent, the app will probably become more useful and more fun.

Tweets come with entities like hashtags and links, so future features could include ways to visualize hashtags.  This would be a good way to utilize all the tweets that are included in the stream that aren't tagged with exact coordinates.

##Link to design docs
https://www.dropbox.com/sh/wkc78l0fi8vh02c/AAA92nRJtDOd75bMlAm55Looa?dl=0

##User Stories
1. I'm a bored student sitting in class. I want a distraction, so I go to Crow's Nest and watch local tweets.  Maybe I also check some other locations, and tweet some of my own tweets and watch them pop up on the screen.

2. I'm an avid twitter user. I get into tweet conversations and arguments with people all the time. If I'm conversing with someone local, I want to be able to see their exact location on the map.
