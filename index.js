const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const VERIFY_TOKEN = "mi-token-seguro";

// Configuración del body-parser
app.use(bodyParser.json());

// Ruta para la verificación inicial del webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log("Webhook verificado exitosamente");
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Verificación fallida');
    }
});

// Ruta para manejar eventos del webhook
app.post('/webhook', (req, res) => {
    console.log("Evento recibido: ", req.body);
    res.status(200).send('Evento procesado');
});

// Inicia el servidor en Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
