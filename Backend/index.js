const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let favorites = [];

app.post('/favorites', (req, res) => {
    const character = req.body;
    const exists = favorites.some(fav => fav.characterId === character.characterId);
    if (!exists) {
        favorites.push(character);
        res.status(201).send(character);
    } else {
        res.status(409).send({ message: 'El personaje ya se encuentra en favoritos.' });
    }
});

app.get('/favorites', (req, res) => {
    res.send(favorites);
});

app.delete('/favorites/:id', (req, res) => {
    const characterId = req.params.id;
    favorites = favorites.filter(fav => fav.characterId !== characterId);
    res.status(204).send();
});

app.listen(3000, () => {
    console.log('API ejecutándose correctamente');
});
