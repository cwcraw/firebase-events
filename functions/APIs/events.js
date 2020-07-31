const { db } = require('../util/admin');

exports.getAllEvents = (request, response) => {
	db
        .collection('events')
        .where('username', '==', request.user.username)
		.orderBy('Time', 'desc')
		.get()
		.then((data) => {
            let events = [];
            console.log(data)
			data.forEach((doc) => {
                console.log(doc)
				events.push({
                    eventId: doc.id,
                    Event: doc.data().Event,
					Location: doc.data().Location,
					Note: doc.data().Note,
					Time: doc.data().Time,
				});
			});
			return response.json(events);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code});
		});
};

exports.postEvent = (request, response) => {
	if (request.body.Event.trim() === '') {
		return response.status(400).json({ Event: 'Event not be empty' });
    }
    
    if(request.body.Location.trim() === '') {
        return response.status(400).json({ Location: 'Location not be empty' });
    }
	if (request.body.Time.trim() === '') {
		return response.status(400).json({ Time: 'Time not be empty' });
    }
    
    const newEventItem = {
        username: request.user.username,
        Event: request.body.Event,
        Location: request.body.Location,
        Time: request.body.Time,
        Note: request.body.Note
    }

    db
        .collection('events')
        .add(newEventItem)
        .then((doc)=>{
            const responseEventItem = newEventItem;
            responseEventItem.id = doc.id;
            return response.json(responseEventItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
        });
};

exports.deleteEvent = (request, response) => {
    const document = db.doc(`/events/${request.params.eventId}`);
    document
        .get()
        .then((doc) => {
            if(doc.data().username !== request.user.username){
                return response.status(403).json({error:"Unauthorized"})
           }
            if (!doc.exists) {
                return response.status(404).json({ error: 'Event not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editEvent = ( request, response ) => { 
    if(request.body.todoId  ){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('events').doc(`${request.params.eventId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};