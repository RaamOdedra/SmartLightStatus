const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const deviceModel = require('./device.model');

mongoose.connect('mongodb://localhost:27017/SmartLightStatus', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log(err)
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//AddDevice post api

app.post('/api/addDevice', (req, res, next) => {
    const newDevice = new deviceModel(req.body);
    newDevice.save((err, device) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(device);
            res.status(201).json({
                message: 'New device added',
                data: device
            });
        }
    });
})

//GetDevice get api

app.get('/api/findDevice', function (req, res) {
    var id = req.params.id
    deviceModel.find((err, device) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (device) {
            res.send(device)
        } else {
            return res.status(404).send("No record found")
        }
    });
});


//UpdateDevice put api

app.put('/api/updateDevice/:id', (req, res, next) => {
    console.log(req.body);
    deviceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, device) => {
        console.log(device);
        if (err) {
            return res
                .status(500)
                .send({ error: "unsuccessful" })
        };
        console.log(device);
        res.status(201).json({
            message: device,
        });
    });
})

const server = http.createServer(app)
server.listen(4000, () => {
    console.log('server started on port 4000 to show changes using nodemon');
});