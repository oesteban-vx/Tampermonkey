// ==UserScript==
// @name         Differentiate farms
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Add some differentiation to farms!
// @author       oesteban
// @updateURL    https://raw.githubusercontent.com/oesteban-vx/Tampermonkey/main/DifferentiateFarms.js
// @downloadURL  https://raw.githubusercontent.com/oesteban-vx/Tampermonkey/main/DifferentiateFarms.js

// @match        http://*.elasticbeanstalk.com/*

// @icon         http://prodcloudweb-dev.us-west-2.elasticbeanstalk.com/resources/images/amsgeo_logo.ico
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
    "reproj2"    : ["rep2",  "fff1e0"],
    "reproj3"    : ["rep3",  "8bfbf0"], // blue
    "reproj4"    : ["rep4",  "8bebfb"],
    "idpsreproj" : ["i-rep", "e2f9d8"], // green
    "indexing"   : ["idx",   "f2e99f"], // yellow
    "auxiliary"  : ["aux",   "ee9696"], // red
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

    GM_addStyle("* { background-color: #" + color + "; } ");

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
    }
})();
