// BUILD YOUR SERVER HERE

const express = require('express');
const server = express();
const Users = require('./users/model');
server.use(express.json());


server.put('/api/users/:id', async (req, res)=> {
    try{
        if (!await Users.findById(req.params.id)){
            
            res.status(404).json({
                message: `The user with the specified ID does not exist, ID:${req.params.id}`,
            })

        }else if (!req.body.name || !req.body.bio) {

            res.status(400).json({
                message:`Please provide name and bio for the user, recieved name:${req.body.name} and bio:${req.body.bio}`
            })

        }else{

            const updatedUser = await Users.update(req.params.id, req.body)
            res.status(200).json({bio: updatedUser.bio, id: updatedUser.id, name: updatedUser.name})

        }
    }catch(err){
        res.status(500).json({
            message: `unspecified error updating user with ID of ${req.params.id}`,
            err: err.message,
            stack: err.stack,
        })
    }
})


server.delete('/api/users/:id', async (req, res) => {
   
    try{
        if (!await Users.findById(req.params.id)){
                
                res.status(404).json({
                    message: `The user with the specified ID does not exist, ID:${req.params.id}`,
                })

        }else{
                res.status(200).json(await Users.remove(req.params.id))
            }
    }catch (err){
        res.status(500).json({
            message: `unspecified error while trying to delete user with valid ID of ${req.params.id}`,
            err: err.message,
            stack: err.stack,
        })
    }
});


server.post('/api/users', (req, res) => {
    
    !req.body.name || !req.body.bio ? res.status(400).json({
        message: `Please provide name and bio for the user, recieved name:${req.body.name} and bio:${req.body.bio}`
    }) 
    
    :Users.insert(req.body)
    .then(newUser => {
        res.status(201).json(newUser)
    })
    .catch(err => {
        res.status(500).json({
            message:`could not create user`,
            err: err.message,
            stack: err.stack,
        })
    })
});


server.get('/api/users', (req, res) => {
    
    Users.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({
            message: 'unspecified error getting users from server',
            err: err.message,
        })
    })
});


server.get('/api/users/:id', (req, res) => {
    
    Users.findById(req.params.id)
    .then(user => {
        if ( user === undefined ){
            res.status(404).json({
                message: `user does not exist with id of ${req.params.id}`,
            })
        }
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json({
            message: 'unknown error getting specific user',
            err: err.message,
        })
    })
});


server.use('/404', (req, res) => {
    res.status(404).json({
        message: "Page Not Found"
    })
});


module.exports = server; // EXPORT YOUR SERVER instead of {}
