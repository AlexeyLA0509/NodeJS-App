'use strict';

(function () {
    /**
     * @const
     */
    var requestUrls = {
        logout: '/account/logout'
    };

    var ndUMLogout = null;
    var allowLogoutRequest = false;






    function ndUMLogoutClick(e) {
        if (allowLogoutRequest !== true) {
            return;
        }

        allowLogoutRequest = false;

        var logoutRequest = App.Ajax.create();
        logoutRequest.onreadystatechange = logoutRequestOnRSC;

        requestLogoutSendData(logoutRequest);
    }

    function logoutRequestOnRSC(e) {
        var logoutRequest = e.target;

        if (logoutRequest.readyState == 4) {
            if (logoutRequest.status == 200) {
                try {
                    var data = JSON.parse(logoutRequest.responseText);
                    processingLogout(data);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                console.log('logoutRequest.status: ' + logoutRequest.status);
            }

            allowLogoutRequest = true;
        }
    }

    function processingLogout(data) {
        if (data.status !== 1) {
            console.log('Error: ' + data.errorCode);
            return;
        }

        window.location.reload(true);
    }


    /**
     * @param {HttpRequest} request
     */
    function requestLogoutSendData(request) {
        requestSendData(request, requestUrls.logout, 'POST', null, null);
    }

    /**
     * @param {HttpRequest} request
     * @param {String} url
     * @param {String} method
     * @param {Array} headers
     * @param {String} data
     */
    function requestSendData(request, url, method, headers, data) {
        App.Ajax.sendData(request, url, method, headers, data);
    }

    document.addEventListener('DOMContentLoaded', function () {
        ndUMLogout = document.getElementById('ndUMLogout');

        if (ndUMLogout != null) {
            ndUMLogout.addEventListener('click', ndUMLogoutClick);
            allowLogoutRequest = true;
        }
    });
})();