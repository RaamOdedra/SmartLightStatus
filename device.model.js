const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    name: { type: String },
    device_id: { type: String },
    state: { type: String, default: "off" },
    zone_id: { type: String, required: true }
});

module.exports = mongoose.model('device', deviceSchema);