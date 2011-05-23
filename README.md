Tick
==========================

Tick is a todo list app running on [Express](http://expressjs.com) and uses a custom version of [Reqwest](http://github.com/ded/reqwest) in the browser for XHR.

It writes your "Ticks" (todo list items) to a JSON file that is stored on your server.


**NOTE**

I'm only currently supporting Chrome (and I believe Safari works) as this is just a personal project that I'm actually using. 

If you want to fork and change it to support other browsers, I'll gladly take pull requests.


INSTALLATION
----------------------------

You need the following:

* Node 0.4.7
* Express 2.3.4
* EJS (templating engine used)

Clone the repo. Duh.
 
Fire up the Express app 

<code>node tick/server/app.js</code>

and navigate to [http://dev:3300](http://dev:3300) in your browser (a virtual host is setup)


USAGE
---------------------------

* Add new ticks by pressing ENTER.
* Save ticks by pressing TAB.
* Press the question mark key - ? - to toggle the legend (it will slide up after 5 seconds).


TODO
----------------------------

* Add offline support
* Check for no items in list and change UI to reflect that.
* Create modal/notification that says "Type question mark to reveal usage info."  Add an option (cookie) to never show again.
* Generate PDF?
* Bundle it like a Titanium Desktop app?
* Host it?
* Add support for user accounts?  Sign in with Github account.
* Allow for creation of vanity URLs.  (http://some.domain.for.tick.com/joemccann)