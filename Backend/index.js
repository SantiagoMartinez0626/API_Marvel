const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let favorites = [];

app.post('/favorites', (req, res) => {
    const character = req.body;
    const exists = favorites.some(fav => fav.id === character.id);
    
    if (!exists) {
        favorites.push(character);
        console.log('Favorito agregado:', character);
        res.status(201).send(character);
    } else {
        res.status(409).send({ message: 'El personaje ya se encuentra en favoritos.' });
    }
});

app.get('/favorites', (req, res) => {
    res.send(favorites);
});

app.delete('/favorites/:id', (req, res) => {
    const characterId = parseInt(req.params.id, 10);
    console.log('Intentando eliminar favorito con ID:', characterId);
    
    const initialLength = favorites.length;
    favorites = favorites.filter(fav => fav.id !== characterId);

    if (favorites.length < initialLength) {
        console.log('Favorito eliminado. Favoritos restantes:', favorites);
        res.status(204).send();
    } else {
        res.status(404).send({ message: 'Personaje no encontrado' });
    }
});

app.listen(3000, () => {
    console.log('API ejecutándose correctamente en el puerto 3000');
});
