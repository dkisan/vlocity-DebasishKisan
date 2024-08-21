const { default: mongoose } = require("mongoose");

const pollSchema = new mongoose.Schema({
  title: String,
  options: [
    {
      option: {
        type: String,
        required: true
      },
      votes: {
        type: Number,
        default: 0
      }
    }
  ],
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Poll', pollSchema);