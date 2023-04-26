const express = require('express')
const bodyParser = require("body-parser")
const app = express()
const port = 8000
const cors = require('cors')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
let users = [
    {
        displayName: "abdul hanan",
        email: "abdulhanan3279@gmail.com",
        uid: "tea4tlc2D5Zrwj13Z49o0qUgu1x1",
        password: "123456"
    },
    {
        displayName: "moon rajpoot",
        email: "moon3279@gmail.com",
        uid: "lI7lWuqXrYYlJCBVt0qVhXWHqGy2",
        password: "123456"
    },
]
let events = [
    {
        creator: "tea4tlc2D5Zrwj13Z49o0qUgu1x1",
        date: "2023-01-31",
        description: "lahore",
        location: "pakistan",
        time: "12:59",
        title: "Annual Dinner",
        attendees: [],
        id: "0f0PWkvpRkSwOXsKErCX",
    },
    {
        creator: "tea4tlc2D5Zrwj13Z49o0qUgu1x1",
        date: "2023-05-31",
        description: "This is freelancer event",
        location: "Lahore",
        time: "12:00",
        title: "Freelancing",
        attendees: ["ynxIAHelIfZxDmhaOGMWkj2Lse03", "ynxIAHelIfZxDmhaOGMWkj2Ls45"],
        id: "0f0PWkvpRkSwOXsKErCY",
    },
    {
        creator: "tea4tlc2D5Zrwj13Z49o0qUgu1x1",
        date: "2022-01-31",
        description: "This is amazon event",
        location: "India",
        time: "12:05",
        title: "Amazon Grand Events",
        attendees: ["ynxIAHelIfZxDmhaOGMWkj2Lse03", "ynxIAHelIfZxDmhaOGMWkj2Ls45"],
        id: "0f0PWkvpRkSwOXsKEXXX",
    },
    {
        creator: "lI7lWuqXrYYlJCBVt0qVhXWHqGy2",
        date: "2022-01-31",
        description: "this is fiverr event",
        location: "India",
        time: "12:05",
        title: "fiverr Grand Events",
        attendees: ["ynxIAHelIfZxDmhaOGMWkj2Lse03", "ynxIAHelIfZxDmhaOGMWkj2Ls45"],
        id: "0f0PWkvpRkSwOXsKEXXy",
    },
]

// parse application/json
app.use(bodyParser.json())
app.get('/getData', (req, res) => {
    console.log("submit event is running");
    res.json(events)
})

app.post('/submitEvent', (req, res) => {
    console.log("req.body in submitEvent", req.body);
    let event = req.body
    event = { ...event, id: Math.floor(Math.random() * 1000) }

    // events = events.push(event)
    events = [...events, event]
    console.log("submited event", events);
    res.json(events)
})
app.delete('/deleteEvent', (req, res) => {
    console.log("req.query", req.query);
    // console.log("req.params", req.params.id);
    const eventId = req.query.id
    const filteredEvents = events.filter((event) => event.id != eventId)
    console.log("filtered events", filteredEvents);
    events = filteredEvents
    res.json(events)
})
// app.put used for changing in entire resource
//app.patch used for changing in some part of resource so I use patch
app.patch('/updateEvent', (req, res) => {
    console.log("update", req.body);
    const eventId = req.body.updateEventId
    console.log("the event id", eventId);
    const updatedEvent = req.body.updateEventForm
    console.log("the updated event", updatedEvent);
    events = events.map((event) => {
        if (event.id == eventId) {
            let updatingEvent = {
                ...event,
                title: updatedEvent?.editTitle || event.title,
                date: updatedEvent?.editDate || event.date,
                time: updatedEvent?.editTime || event.time,
                location: updatedEvent?.editLocation || event.location,
                description: updatedEvent?.editDescription || event.location,
                attendees: updatedEvent?.attendees || event.attendees
            }
            console.log("the single event", updatingEvent);
            return updatingEvent
        }
        else {
            return event
        }
    }

    )
    console.log("updateed events", events);
    res.send("ok")
})
app.post("/signupUser", (req, res) => {
    console.log("the signup user is", req.body);
    const newUser = req.body.user
    users = [...users, {
        ...newUser, uid: Math.floor(Math.random() * (55000 - 1000 + 1) + 1000).toString()
    }]
    console.log("the user is", users);
    res.json(users)
})
app.post("/loginUser", (req, res) => {
    console.log("the user details", req.body);
    const email = req.body.loginedUser.email
    const password = req.body.loginedUser.password
    const authenticatingUser = users.filter((user) => user.email == email && user.password == password)
    console.log("the login user", authenticatingUser);
    res.json(authenticatingUser)
}
)
app.listen(port, () => {
    console.log(`server started on port ${port}`);
})


/**for random id
 * 
 * function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Generate a random ID with length 20
const id = generateRandomId(20);
console.log(id);
 */