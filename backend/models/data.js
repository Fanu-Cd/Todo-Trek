const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
          title: { type: String, required: true },
          time: { type: Date, required: true },
          collaborators: { type: Object, required: false },
},{collection:"TodoTrek"});//"TodoTrek" is the name of the collection 

const Data = mongoose.model('Data', dataSchema);
module.exports = Data