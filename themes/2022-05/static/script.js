(function () {
    'use strict';

    function executeSiteSearch(query) {
        query = 'site:mfreiholz.de ' + query;
        window.location.href = 'http://www.google.com/search?q=' + encodeURIComponent(query);
    }

    // Bind site search.
    // window.document.getElementById('sitesearchquery')
})();