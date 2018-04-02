'use strict';

/*
class Globals {
    constructor() {
        const AppResoursesPaths = require('./data/app-resourses-paths');

        let $appStarted = false;
        let $appExiting = false;
        let $appRelease = false;

        this.appResoursesPaths = new AppResoursesPaths($appRelease);

        Object.defineProperty(this, 'appStarted', {
            get: () => {
                return $appStarted;
            }
        });

        Object.defineProperty(this, 'appExiting', {
            get: () => {
                return $appExiting;
            }
        });

        Object.defineProperty(this, 'appRelease', {
            get: () => {
                return $appRelease;
            }
        });
    }

    appStart() {
        if (this.appStarted) {
            return false;
        }



        return true;
    }
}
*/
/*
const AppResoursesPaths = require('./data/app-resourses-paths');

let $appStarted = false;
let $appExiting = false;
let $appRelease = false;
let $appResoursesPaths = new AppResoursesPaths($appRelease);

const globals = {
    get appStarted() {
        return $appStarted;
    },
    get appExiting() {
        return $appExiting;
    },
    get appRelease() {
        return $appRelease;
    },
    get appResoursesPaths() {
        return $appResoursesPaths;
    }
};

globals.appStart = () => {
    if (this.appStarted) {
        return false;
    }



    return true;
};
*/

const globals = {
    app: null
};

module.exports = globals;