// ==UserScript==
// @name         Github Link Plus
// @namespace    GithubPlus
// @match        https://github.com/*
// @match        https://*.github.com/*
// @author       Tatsuya Ono (@ono)
// @description  This script add extra information onto github repo links. It is useful when you see a page like this: https://github.com/joyent/node/wiki/modules and find projects which are actively developped and popular. Note that github has API limit which is 5000 per day and it is consumed easily with this approach.
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://code.jquery.com/jquery-1.6.1.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  $('a[href*="github.com"]').each( function() {
    var href = $(this).attr('href');
    var a = href.match(/github\.com\/([a-z0-9_-]+)\/([a-z0-9_-]+)\/*/i);
    if (a && a.length==3) {
      var usr = a[1], prj = a[2];
      var link = $(this);
      $.getJSON("https://api.github.com/repos/" + usr + "/" + prj + "?callback=?", function(ret) {
        var data = ret.data;
        var info = "watchers: " + data["watchers"];
        info += ", pushed at: " + data["pushed_at"].substr(0,10);

        // add info to text
        link.text( link.text() + "(" + info + ")");

        // info on tooltip
        // link.attr('title', info);
      });
    }
  });
}

// load jQuery and execute the main function
if (typeof(jQuery)=="undefined") {
  addJQuery(main);
} else {
  main();
}

