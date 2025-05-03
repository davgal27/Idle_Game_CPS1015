const express = require('express');
const fs = require('fs'); //filesystem mod

const App = express();
const Port = process.env.PORT || 3000;
const FilePath = './SavedState.json';

App.use(express.json());
App.use(express.static('public'));

// INITIALIZING (from memory into server)
let SavedState = { Counters: {}, Achievements: {} };

const LoadSavedState = () => { //loading from file SavedState.json
    fs.readFile(FilePath, 'utf-8', (Error, Progress) => {
        if (Error) {
            console.error('Error loading Save!', Error);
            SavedState = { Counters: {}, Achievements: {} }; //if error-> go back to start
        } else {
            SavedState = JSON.parse(Progress); //load successfuly
        }
    });
};
LoadSavedState();

// SAVING DATA THROUGH AUTOSAVE
const Autosave = () => {
    setInterval(() => {
        fs.writeFile(FilePath, JSON.stringify(SavedState, null, 2), (Error) => {
            if (Error) {
                console.error('Failed to save game:', Error);
            } else {
                console.log('Game state saved!');
            }
        });
    }, 10000); // Autosave every 10 seconds
};

Autosave();
// Saving from info recieved from the browser (client)
App.post('/SaveGame', (req, res) => {
    const data = req.body;

    if (data && data.Counters && data.Achievements) {
        // Update in-memory state and save to file
        SavedState = data;
        fs.writeFile(FilePath, JSON.stringify(SavedState, null, 2), (Error) => {
            if (Error) {
                console.error('Failed to save game:', Error);
                return res.status(500).send('Failed to save game');
            } else {
                console.log('Game state saved!');
                return res.status(200).send('Save received');
            }
        });
    } else {
        res.status(400).send('Invalid save data');  // Error if the data is invalid
    }
});


// LOADING FROM SAVEDSTATE.JSON
App.get('/LoadGame', (req, res) => {
    fs.readFile(FilePath, 'utf-8', (Error, data) => {
        if (Error) {
            console.error('Error loading saved state:', Error);
            res.status(500).send('Error loading game state');
        } else {
            const savedState = JSON.parse(data);
            res.json(savedState); // Send saved state to client
        }
    });
});
// STARTING SERVER
App.listen(Port, () => console.log(`Server running on http://localhost:${Port}`));
