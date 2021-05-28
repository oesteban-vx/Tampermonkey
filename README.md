## TamperMonkey

[TamperMonkey](https://www.tampermonkey.net/) is a browser complement which
allows you running JS code associated to web pages and modify their content on
the fly.

You can use many user written scripts, avaliable on public repositories, but
you can also write your own, maybe simpler, but useful nonetheless.

### How to install the scripts
First, if you don't have it, install [TamperMonkey](https://www.tampermonkey.net/).
Then click on its icon ![Tampermonkey icon](https://tampermonkey.freetls.fastly.net/favicon.ico)
and `Add new script`. Then copy and paste the code there, and `Save`.

### Our scripts

#### `DifferentiateFarms.js`
This gets some data from the farms' URL and then
* sets a different background color for each of the farms
* puts in the title (browser tab) the farm name, task and workunit

This is nice just to know which tab you want to open, or to go back and forth
in your history.

![Sample screenshot](screenshots/BrowserTabs.png)
![Sample screenshot](screenshots/history.png)
