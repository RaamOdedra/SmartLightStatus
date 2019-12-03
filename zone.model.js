const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    zone_name: { type: String }
});

module.exports = mongoose.model('zones', zoneSchema);