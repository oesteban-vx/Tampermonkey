// ==UserScript==
// @name         Differentiate farms
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Add some differentiation to farms!
// @author       oesteban
// @updateURL    https://raw.githubusercontent.com/oesteban-vx/Tampermonkey/main/DifferentiateFarms.js
// @downloadURL  https://raw.githubusercontent.com/oesteban-vx/Tampermonkey/main/DifferentiateFarms.js

// @match        http://*.elasticbeanstalk.com/*
// @match        http://*.web.farm.vexcelgroup.com/*
// @include      http://qy-farm-*

// @icon         http://qy-farm-101:8080/resources/images/amsgeo_logo.ico
// @grant        GM_addStyle
// ==/UserScript==

const stringHashCode = str => {
  let hash = 0
  for (let i = 0; i < str.length; ++i) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash
}

var farm_abbrevs = {
    "publishing" : ["pub",   "ffe6b0"], // orange
    "reproj"     : ["rep1",  "fff1b8"],
    "reproj1"    : ["rep1",  "fff1b8"],
    "reproj2"    : ["rep2",  "fff1e0"],
    "reproj3"    : ["rep3",  "8bfbf0"], // blue
    "reproj4"    : ["rep4",  "8bebfb"],
    "idpsreproj" : ["i-rep", "e2f9d8"], // green
    "indexing"   : ["idx",   "f2e99f"], // yellow
    "auxiliary"  : ["aux",   "eed6d6"], // red
    "qc"         : ["qc",    "fda3e6"], // pink
    "dxm"        : ["dxm",   "cfd2d6"], // gray
};

(function() {
    'use strict';
    var host = location.hostname;
    var hash = stringHashCode(host)
    hash &= 0xffffff
    hash |= 0xc0c0c0
    var color = hash.toString(16)

    var farm = ""

    var regexes = [
        // http://prodcloudweb-prod-indexing-ue1.us-east-1.elasticbeanstalk.com/tasks/show
        // http://prodcloudweb-production-publishing-ue1.us-east-1.elasticbeanstalk.com/secured/workunits/workunit/n32w97-us-tx-fortworth-2020_n32w97-us-tx-fortworth-2020__PD_OGG/1090
        // http://prodcloudweb-prod-citizen.us-west-2.elasticbeanstalk.com/tasks/show
        /prodcloudweb-prod[^-]*-(.*?)[\.-]/,

        // http://prodcloudweb-dev.us-west-2.elasticbeanstalk.com/tasks/show
        /prodcloudweb-([^\.]+)/,

        // http://reproj1.web.farm.vexcelgroup.com
        /([^\.]+)\.web.farm.vexcelgroup.com/,

        // http://qy-farm-001:8080
        /(qy-farm-\d+)/,

        ]

    for(var i = 0, size = regexes.length; i < size ; i++)
    {
        var r = regexes[i].exec(host)
        if (r) {
            farm = r[1]
            var item = farm_abbrevs[farm]
            if (item)
            {
                // alert("item 0 = " +item[0]);
                farm = item[0]
                if (item[1]) {
                    color = item[1]
                }
            }
            break
        }
    }

    if (farm == "")
    {
        var base_color = "80cfff" // darkish-blue
        r = /qy-farm-(\d+)/.exec(host)
        if (r)
        {
            var qy_number = parseInt(r[1], 10)
            color = parseInt(base_color,16)
            color += 0x00100 * qy_number / 100 * 10
            color += 0x10000 * qy_number % 100 * 10
            color = "#" + color.toString(16)
        }
    }


    GM_addStyle("* { background-color: #" + color + "; } ");
    GM.addStyle(".navbar-brand {font-size: 30px;}");

    if (farm != "")
    {
        var title = ""

        // .../secured/workunits/workunit/n35w84-us-tn-etowah-2019_SPHERICALORTHO_OGGWFI_OHLG/1
        var WU = /\/workunits\/workunit\/(.*)\/(\d+)/.exec(location.href)

        // .../tasks/task/n35w84-us-tn-etowah-2019_SPHERICALORTHO_OGGWFI_OHLG
        var task = /\/tasks\/task\/(.*?)([?\/]|$)/.exec(location.href)

        // .../tasks/task/n35w84-us-tn-etowah-2019_SPHERICALORTHO_OGGWFI_OHLG
        var create_task = /\/tasks\/createTask/.exec(location.href)

        // .../secured/clients/show
        var others = /\/secured\/([^/]+)\//.exec(location.href)

        if (WU)
        {
            title = WU[1] + " / " + WU[2]
        }
        else if (task)
        {
            title = task[1]
        }
        else if (others)
        {
            title = others[1]
        }
        else if (create_task)
        {
            title = "Create task"
        }
        else if (/loginPage/.exec(location.href))
        {
            title = "Login"
        }
        if (title != "")
        {
            title = title + " /"
        }

        document.title = title + farm

        var elements = document.getElementsByClassName("navbar-brand");
        if (elements) {
            elements[0].text = farm.toUpperCase()
        }
    }
})();

