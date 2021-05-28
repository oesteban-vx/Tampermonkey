// ==UserScript==
// @name         IDPS projects
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add project code & location to IPDS tab
// @author       oesteban
// @match        https://prod.gpipe.vexcelgroup.com/project/*
// @icon         https://prod.gpipe.vexcelgroup.com/resources/favicon.ico
// ==/UserScript==

(function() {
    'use strict';

    var href = window.location.href

    if (/project\/\d+$/.exec(href))
    {
        var raw_code = document.getElementById("rawcode").value
        var location = document.querySelectorAll(".content-header small")[0].innerHTML
        document.title = raw_code + " - " + location + " (IDPS)"
    }
})();
