const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

const app = require('express')();

const {
    getAllEvents,
    postEvent,
    deleteEvent,
    editEvent,
} = require('./APIs/events')

app.get('/events', getAllEvents);
app.post('/event',postEvent)
app.delete('/events/:eventId', deleteEvent);
app.put('/event/:eventId', editEvent);
exports.api = functions.https.onRequest(app);