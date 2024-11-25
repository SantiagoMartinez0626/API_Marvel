const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// Conexión MongoDB
mongoose.connect('mongodb://mongodb:27017/marvelapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión exitosa a MongoDB');
}).catch(err => {
    console.error('Error de conexión a MongoDB:', err);
});

// Modelos
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{
        id: Number,
        name: String,
        thumbnail: {
            path: String,
            extension: String
        }
    }]
});

const User = mongoose.model('User', userSchema);

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, 'tu_clave_secreta', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.user = user;
        next();
    });
};

// Rutas de autenticación
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            email,
            password: hashedPassword,
            favorites: []
        });

        await user.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'El email ya está registrado' });
        } else {
            res.status(500).json({ message: 'Error en el registro' });
        }
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ userId: user._id }, 'tu_clave_secreta', { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login' });
    }
});

// Rutas de favoritos
app.get('/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener favoritos' });
    }
});

app.post('/favorites', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const character = req.body;

        const exists = user.favorites.some(fav => fav.id === character.id);
        if (exists) {
            return res.status(409).json({ message: 'El personaje ya está en favoritos' });
        }

        user.favorites.push(character);
        await user.save();
        res.status(201).json(character);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar favorito' });
    }
});

app.delete('/favorites/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const characterId = parseInt(req.params.id);

        const initialLength = user.favorites.length;
        user.favorites = user.favorites.filter(fav => fav.id !== characterId);

        if (user.favorites.length === initialLength) {
            return res.status(404).json({ message: 'Personaje no encontrado' });
        }

        await user.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar favorito' });
    }
});

app.listen(3000, () => {
    console.log('API ejecutándose en el puerto 3000');
});
