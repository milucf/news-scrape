# news-scrape

## Overview

This is a web app that lets users view and leave comments on the latest news.It uses Cheerio to scrape news from another site and Mongo database to store them.

## How It Works

Whenever a user visits this site, the app scrapes stories from a news outlet and displays them for the user. 

Users are able to leave comments on the articles displayed and revisit them later. The comments are being saved to the database as well and associated with their articles. Users also are able to delete comments left on articles. All stored comments are visible to every user.

# How To Setup And Run

You must have Mongo db running in your local Computer to test this app

Download this repository. 

Open terminal and navigate to the downloaded folder. Run `npm install` in your terminal to install dependencies. 

 In your terminal run `node server.js` to start the server. 
 
 Open your browser and  navigate to http://localhost:8080/ to see the example in action. 

