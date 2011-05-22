Tick
==========================

Tick is a todo list app running on [Express](http://expressjs.com) and uses a custom version of [Reqwest](http://github.com/ded/reqwest) in the browser for XHR.

It writes your "ticks" (todo list items) to a JSON file that is stored on your server.


**NOTE**

I'm only currently supporting Chrome (and I believe Safari works) as this is just a personal project that I'm actually using. 

If you want to fork and change it to support other browsers, I'll gladly take pull requests.

USAGE
----------------------------

You need the following:

* Node 0.4.7
* Express 2.3.4

Clone the repo. Duh.
 
Fire up the Express app 

<code>node tick/server/app.js</code>

and navigate to [127.0.0.1:3300](127.0.0.1:3300) in your browser.


TODO
----------------------------

* Add offline support
* Check for no items in list and change UI to reflect that.
* Style this fucking thing.  
* Generate PDF?
* Bundle it like a Titanium Desktop app?
* Host it?
* Add support for user accounts?