'use strict';

const MongoClient = require('mongodb').MongoClient;

const CONNECTION_STRING = 'mongodb://localhost:27017';
const APP_1_DB = 'app_1';
const APP_1_USERS_COLLECTION = 'users'

MongoClient.connect(CONNECTION_STRING, onConnect);

async function onConnect(error, client) {
    if (error) {
        return console.log(error);
    }

    let app1Db = client.db(APP_1_DB);

    label_OC_1: {
        let success = await new Promise((resolve, reject) => {
            console.log('dropDatabase: app_1');

            app1Db.dropDatabase((error, result) => {
                if (error) {
                    console.log(error);
                    return resolve(false);
                }

                resolve(true);
            });
        });

        if (success !== true) {
            break label_OC_1;
        }

        app1Db = client.db(APP_1_DB);

        success = await new Promise((resolve, reject) => {
            console.log(`createCollection app_1.${APP_1_USERS_COLLECTION}`);

            app1Db.createCollection(APP_1_USERS_COLLECTION, {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        properties: {
                            userName: {
                                bsonType: 'string'
                            },
                            email: {
                                bsonType: 'string'
                            },
                            password: {
                                bsonType: 'string'
                            },
                            passwordFormat: {
                                bsonType: 'int'
                            },
                            passwordSalt: {
                                bsonType: 'string'
                            },
                            createdDateTime: {
                                bsonType: 'date'
                            },
                            createdDateTimeTicks: {
                                bsonType: 'long'
                            },
                            lastLoginDateTime: {
                                bsonType: ['date', 'null']
                            },
                            lastLoginDateTimeTicks: {
                                bsonType: ['long', 'null']
                            },
                            lastActivityDateTime: {
                                bsonType: ['date', 'null']
                            },
                            lastActivityDateTimeTicks: {
                                bsonType: ['long', 'null']
                            },
                            currentIp: {
                                bsonType: ['string', 'null']
                            },
                            previousIp: {
                                bsonType: ['string', 'null']
                            },
                            displayName: {
                                bsonType: 'string'
                            }
                        },
                        required: ['userName', 'email', 'password', 'passwordFormat', 'passwordSalt', 'createdDateTime', 'createdDateTimeTicks', 'displayName']
                    }
                }
            }, (error, collection) => {
                if (error) {
                    console.log(error);
                    return resolve(false);
                }

                collection.createIndex({ 'userName': 1, 'email': 1 }, { unique: true });
                resolve(true);
            });
        });

        if (success !== true) {
            break label_OC_1;
        }

        let usersCollection = app1Db.collection(APP_1_USERS_COLLECTION);

        success = await new Promise((resolve, reject) => {
            console.log(`createIndex app_1.${APP_1_USERS_COLLECTION}`);
            let usersCollection = app1Db.collection(APP_1_USERS_COLLECTION);

            usersCollection.createIndex({ 'userName': 1, 'email': 1 }, { unique: true }, (error, result) => {
                if (error) {
                    console.log(error);
                    return resolve(false);
                }

                resolve(true);
            });
        });
    }

    client.close();

    console.log('Db: MongoDB Initialized.');
}