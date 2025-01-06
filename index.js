const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

const VERIFY_TOKEN = "mi-token-seguro";
const ACCESS_TOKEN = "EAARfVZCwn130BOzyHBKF14ZBWZC1GM0733xokIZA3O3ZByLC1OI89hYbohLRLbD86tVFl5bG0ZAyZABceyiwSD9QZC30keVJsR1GjYD0iaCDTXaWtIt8zbmZCkS9Bju1gs8E3wjVS1Inx0iuY7jkZCKAB4Ege0UbHMtkkgpfzGxwdddpZCSf9B8bNhxvx9tIsqYXx6ZBVKVP1yFvaaA0p2xQ2QPwQSg6Ogt7ZC937PwZDZD"; // Genera uno desde la consola de desarrolladores

app.use(bodyParser.json());

// Ruta de verificación
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log("Webhook verificado");
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Verificación fallida');
    }
});

// Ruta para manejar eventos del webhook
app.post('/webhook', async (req, res) => {
    try {
        const body = req.body;
        
        // Verifica que el evento sea de un formulario
        if (body.object === 'page') {
            body.entry.forEach(async (entry) => {
                const changes = entry.changes;
                changes.forEach(async (change) => {
                    if (change.field === 'leadgen') {
                        const formId = change.value.form_id;
                        const leadgenId = change.value.leadgen_id;
                        console.log(`Nuevo formulario llenado. Form ID: ${formId}, Leadgen ID: ${leadgenId}`);
                        
                        // Obtener datos del lead
                        const leadData = await getLeadData(leadgenId);
                        console.log("Datos del lead:", leadData);
                    }
                });
            });
        }
        res.status(200).send('Evento recibido');
    } catch (error) {
        console.error("Error procesando el evento:", error);
        res.status(500).send('Error interno');
    }
});

// Obtener datos del lead desde la API de Leads
async function getLeadData(leadgenId) {
    const url = `https://graph.facebook.com/v16.0/${leadgenId}?access_token=${ACCESS_TOKEN}`;
    const response = await axios.get(url);
    return response.data;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
