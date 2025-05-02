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

// LOADING FROM SAVE
App.get('/LoadGame', (Req, Res) => {
    Res.json(SavedState);
});
// STARTING SERVER
App.listen(Port, () => console.log(`Server running on http://localhost:${Port}`));
