'use strict';

(function () {
    /**
    * @const
    * @enum {Number}
    */
    var requestDataType = {
        register: 0
    };

    var registerRequest = App.Ajax.create();
    var tbUserName = null;
    var tbEmail = null;
    var tbPassword = null;
    var tbConfirmPassword = null;
    var btnRegister = null;
    var lErrorText = null;
    var allowRegisterRequest = false;

    function btnRegisterClick(e) {
        register();
    }

    function register() {
        if (allowRegisterRequest == false) {
            return;
        }

        allowRegisterRequest = false;
        btnRegister.disabled = true;

        if (lErrorText.style.display !== 'none') {
            lErrorText.style.display = 'none';
            lErrorText.innerText = '';
        }

        var userName = tbUserName.value;
        var email = tbEmail.value;
        var password = tbPassword.value;
        var confirmPassword = tbConfirmPassword.value;

        var errorText = null;

        if (userName.length < 1) {
            errorText = 'Must enter the user name'
        }
        else if (email.length < 1) {
            errorText = 'Must enter the email'
        }
        else if (password.length < 1) {
            errorText = 'Must enter a password'
        }
        else if (confirmPassword.length < 1) {
            errorText = 'Must enter a confirm password'
        }
        else if (password !== confirmPassword) {
            errorText = 'Password does not match the confirm password'
        }

        if (errorText != null) {
            setError(errorText);
            allowRegisterRequest = true;
            btnRegister.disabled = false;

            return;
        }

        var actionData = {
            userName,
            email,
            password
        };

        var requestData = {
            type: requestDataType.register,
            data: actionData
        };

        requestSendData(registerRequest, requestData);
    }

    registerRequest.onreadystatechange = function () {
        if (registerRequest.readyState == 4) {
            if (registerRequest.status == 200) {
                try {
                    var data = JSON.parse(registerRequest.responseText);
                    processingRegister(data);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                console.log('registerRequest.status: ' + registerRequest.status);
            }

            allowRegisterRequest = true;
            btnRegister.disabled = false;
        }
    };

    function processingRegister(data) {
        if (data.status !== 1) {
            setError('Error: ' + data.errorCode);
            return;
        }

        if (data.success !== true) {
            setError(data.message);
            return;
        }

        window.location.assign(data.loginStatus.targetUrl);
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

        App.Ajax.sendData(request, '/account/register', 'POST', headers, JSON.stringify(data));
    }

    document.addEventListener('DOMContentLoaded', function () {
        tbUserName = document.getElementById('tbUserName');
        tbEmail = document.getElementById('tbEmail');
        tbPassword = document.getElementById('tbPassword');
        tbConfirmPassword = document.getElementById('tbConfirmPassword');
        btnRegister = document.getElementById('btnRegister');
        lErrorText = document.getElementById('lErrorText');

        btnRegister.addEventListener('click', btnRegisterClick);

        allowRegisterRequest = true;
    });
})();

