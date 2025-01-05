const express = require('express');
const app = express();

const VERIFY_TOKEN = "mi-token-seguro";

// Manejar solicitudes de verificación
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log("Verificación exitosa");
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Verificación fallida');
    }
});

// Manejar eventos del webhook
app.post('/webhook', (req, res) => {
    console.log('Evento recibido:', req.body);
    res.status(200).send('Evento procesado');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
