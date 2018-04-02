'use strict';

(function () {
    /**
    * @const
    * @enum {Number}
    */
    var requestDataType = {
        authenticate: 0
    };

    var authRequest = App.Ajax.create();
    var tbEmail = null;
    var tbPassword = null;
    var chbRememberMe = null;
    var btnLogin = null;
    var lErrorText = null;
    var allowLoginRequest = false;

    function tbEPKeyDown(e) {
        if (e.keyCode === 13) {
            authenticate();
        }
    }

    function btnLoginClick(e) {
        authenticate();
    }

    function authenticate() {
        if (allowLoginRequest == false) {
            return;
        }

        allowLoginRequest = false;
        btnLogin.disabled = true;

        if (lErrorText.style.display !== 'none') {
            lErrorText.style.display = 'none';
            lErrorText.innerText = '';
        }

        var email = tbEmail.value;
        var password = tbPassword.value;
        var rememberMe = chbRememberMe.checked;

        var actionData = {
            email,
            password,
            rememberMe
        };

        var requestData = {
            type: requestDataType.authenticate,
            data: actionData
        };

        requestSendData(authRequest, requestData);
    }

    authRequest.onreadystatechange = function () {
        if (authRequest.readyState == 4) {
            if (authRequest.status == 200) {
                try {
                    var data = JSON.parse(authRequest.responseText);
                    processingAuthenticate(data);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                console.log('authRequest.status: ' + authRequest.status);
            }

            allowLoginRequest = true;
            btnLogin.disabled = false;
        }
    };

    function processingAuthenticate(data) {
        if (data.status !== 1) {
            setError('Error: ' + data.errorCode);
            return;
        }

        if (data.success !== true) {
            setError(data.message);
            return;
        }

        window.location.assign(data.targetUrl);
    }

    /**
     * @param {String} text
     */
    function setError(text) {
        if (lErrorText.style.display !== '') {
            lErrorText.style.display = '';
        }

        lErrorText.innerText = text;
    }

    /**
    * @param {HttpRequest} request
    * @param {{Type:Number, Data:String}} data
    */
    function requestSendData(request, data) {
        var headers = new Array();
        headers.push(['Content-type', 'application/json; charset=utf-8']);

        App.Ajax.sendData(request, '/account/login' + window.location.search, 'POST', headers, JSON.stringify(data));
    }

    document.addEventListener('DOMContentLoaded', function () {
        tbEmail = document.getElementById('tbEmail');
        tbPassword = document.getElementById('tbPassword');
        chbRememberMe = document.getElementById('chbRememberMe');
        btnLogin = document.getElementById('btnLogin');
        lErrorText = document.getElementById('lErrorText');

        tbEmail.addEventListener('keydown', tbEPKeyDown);
        tbPassword.addEventListener('keydown', tbEPKeyDown);
        btnLogin.addEventListener('click', btnLoginClick);

        allowLoginRequest = true;
    });
})();