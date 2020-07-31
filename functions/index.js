const functions = require("firebase-functions");
const auth = require('./util/auth');
// console.log(auth())


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

const app = require("express")();

const {
  getAllEvents,
  postEvent,
  deleteEvent,
  editEvent,
} = require("./APIs/events");

const { loginUser, signUpUser,getUserDetail } = require("./APIs/users");
// Events
app.get("/events",auth, getAllEvents);
app.post("/event",auth, postEvent);
app.delete("/events/:eventId",auth, deleteEvent);
app.put("/event/:eventId",auth, editEvent);
// Users 
app.post("/login", loginUser);
app.post("/signup", signUpUser);
app.get('/user', auth, getUserDetail);


exports.api = functions.https.onRequest(app);
