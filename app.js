const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const zoneModel = require('./zone.model');
const deviceModel = require('./device.model');
const objectid = require('objectid')
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



// ************** Add zone API ****************

//AddZone post api

app.post('/api/addzone', (req, res, next) => {
    console.log(req.body);
    const newZone = new zoneModel(req.body);
    newZone.save((err, zone) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(zone);
            res.status(201).json({
                message: 'New zone added',
                data: zone
            });
        }
    });
})

//GetZone get api

app.get('/api/findZone', function (req, res) {
    var id = req.params.id
    zoneModel.find((err, zone) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (zone) {
            res.send(zone)
            console.log(zone)
            console.log("===============================================================================================")
        } else {
            return res.status(404).send("No record found")
        }
    });
});

//DeleteZone get api

app.get('/api/deleteZone/:id', function (req, res) {

    console.log(req.params.id)
    zoneModel.findByIdAndRemove(id, function (err, zone) {

        if (err) {
            return res.status(500).send("Internal server error")
        } else {
            res.send("Zone Deleted")
        }
    });
});


//UpdateZone put api

app.put('/api/updateZone/:id', (req, res, next) => {
    console.log(req.body);
    // const newUser = new userModel(req.body);

    zoneModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, zone) => {
        console.log(zone);
        if (err) {
            return res
                .status(500)
                .send({ error: "unsuccessful" })
        };
        res.send({ success: "success" });
    });
})


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

//GetDevice by Id get api

app.get('/api/findDevices/:id', function (req, res) {
    var id = req.params.id
    deviceModel.find({ zone_id: req.params.id }, (err, device) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (device) {
            res.send(device)
        } else {
            return res.status(404).send("No user found")
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


app.get('/api/sendstatus', (req, res) => {

    console.log(req.query);


    console.log({ _id: req.query.id, state: req.query.state });

    // const newDevice = new deviceModel({ state: req.query.state });
    // console.log("New Device print ",newDevice);

    deviceModel.updateOne({ _id: objectid(req.query.id) }, { $set: { state: req.query.state } })
        .exec((error, result) => {
            console.log(error);
            console.log("Result", JSON.stringify(result, null, 2));
            if (error) {
                console.log(error);
                return res
                    .status(500)
                    .send({ error: "unsuccessful" })
            };
            res.send({ success: "success" });
        })
});



const server = http.createServer(app)
server.listen(4000, () => {
    console.log('server started on port 4000 to show changes using nodemon');
});