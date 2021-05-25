// ==UserScript==
// @name         Differentiate farms
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add some differentiation to farms!
// @author       You
// @match        http://prodcloudweb-prod*.elasticbeanstalk.com/*
//  match        http://prodcloudweb-production-publishing-ue1.us-east-1.elasticbeanstalk.com/*
//  match        http://prodcloudweb-prod-indexing-ue1.us-east-1.elasticbeanstalk.com/*
// @match        http://*.elasticbeanstalk.com/*

// @icon         https://www.google.com/s2/favicons?domain=elasticbeanstalk.com
// @grant        GM_addStyle
// @require      file://C/Users/i22225/projects/TamperMonkey/DiffentiateFarms.tm
// ==/UserScript==

const stringHashCode = str => {
  let hash = 0
  for (let i = 0; i < str.length; ++i) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash
}

(function() {
    'use strict';
    var host = location.hostname;
    var hash = stringHashCode(host)
    hash &= 0xffffff
    hash |= 0xc0c0e0
    GM_addStyle("* { background-color: #" + hash.toString(16) + "; } ");

    // http://prodcloudweb-prod-indexing-ue1.us-east-1.elasticbeanstalk.com/tasks/show
    // http://prodcloudweb-production-publishing-ue1.us-east-1.elasticbeanstalk.com/secured/workunits/workunit/n32w97-us-tx-fortworth-2020_n32w97-us-tx-fortworth-2020__PD_OGG/1090
    // http://prodcloudweb-prod-citizen.us-west-2.elasticbeanstalk.com/tasks/show
    var farm = /prodcloudweb-prod[^-]*-(.*?)[\.-]/.exec(host)[1]

    var title = farm

    // http://prodcloudweb-production-reproj-ue1.us-east-1.elasticbeanstalk.com/secured/workunits/workunit/n35w84-us-tn-etowah-2019_SPHERICALORTHO_OGGWFI_OHLG/1
    var WU = /\/workunits\/workunit\/(.*)\/(\d+)/.exec(location.href)

    // http://prodcloudweb-production-reproj-ue1.us-east-1.elasticbeanstalk.com/tasks/task/n35w84-us-tn-etowah-2019_SPHERICALORTHO_OGGWFI_OHLG
    var task = /\/tasks\/task\/(.*)/.exec(location.href)

    if (WU)
    {
        title = farm + " / " + WU[2] + " / " + WU[1]
    }
    else if (task)
    {
        title = farm + " / " + task[1]
    }

    document.title = title
})();
