'use strict';

if ('applicationCache' in window) {
  applicationCache.onupdateready = function() {
    location.reload();
  };
}
