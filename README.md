# news-scraper
<h1>Reddit Jr.</h1>
<p>This app is a simple web scraper that allows the user to search any subreddit and immediately be returned the titles and links associated with the most recent posts. It is, in essence, a smaller/lighter way of browsing reddit with added note saving capability. In addition, every time a user searches a subreddit, all of the results are stored in a mongoDB for later use. The different files perform as follows...</p>

<h2>Models Folder</h2>
<p>This folder stores all the mongoose models that set up the schema for entering things into the mongoDB. The are exported into the index.js file and then exported to the rest of the app from there</p>

<h2>public</h2>
<p>This folder contains all the client side code, i.e. the html, css, and static javascript. The javascript handles all of the button presses, which amounts to most of the app's functionality. It also generates all of the titles and links for the individual results and stores them in the db.</p>

<h2>server</h2>
<p>The server is the brain behind the whole operation. It handles all of the different HTTP requests that the app will issue throughout it's use. I implemented the use of subreddit as a parameter so that the requests follow the specific path in regards to the subreddit, that way the user isn't saving all of the articles to one giant url.</p>