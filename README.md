# TTTaevas.github.io

This is the website where all of the matches I have ever reffed on *osu!* are listed, along with the people who played in them.

It features statistics for the matches shown, as well as a search bar so you can look for specific players.

## How to use

Go to [tttaevas.github.io](https://tttaevas.github.io), and just look at the matches, lol

You can use the search bar at the top to only show matches with specific players.

Statistics about the matches that are shown can be found at the top of the webpage.

## How to make your own

Click the "Use this template" button, name your project `<your_github_username>.github.io`, clone your project, add a `.env` file and add to it `osu_api_key=` plus your [osu! api key](https://osu.ppy.sh/p/api/). **Be careful to not make your key visible by all!**

In the `filler.js` file in the `filler` folder, you can find the `new_tournaments` array. You simply need to change it according to your reffing experience!

Tournaments are represented by arrays within the `new_tournaments` array. Those arrays are composed like that:

- The first element of an array is the tournament's name
- The second element of an array is the tournament's forum post link (you can make an empty string instead if needed)
- The third element of an array is the tournament's schedule, as an array of [JS dates](https://www.w3schools.com/jsref/jsref_obj_date.asp), from the first day of qualifiers to the last day of (grand) finals.
- The fourth element of an array is an array of all the ids of the multiplayer matches you have reffed, as integers. Strings should work fine too.

You will need to install dependencies before proceeding to the last step. In the `filler` folder, simply do `npm install`, if [npm](https://www.npmjs.com/) is installed! (if it's not installed, I recommend installing [Node.js](https://nodejs.org/), as it is needed and installs npm automatically)

Once you're done with all that, you simply need to generate a new `index.html` by using the `node filler.js` command in the `filler` folder with [Node.js](https://nodejs.org/), then push a commit to your project!
