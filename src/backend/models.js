const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    nom: {
        type: String
      },
    prenom: {
        type: String
      }, 
    civility: {
        type: String
      },
    email: {
        type: String
      },
    birth: {
        type: String
      },
    balance: {
      type: Number
    },
    accountnumber: {
      type: String
    },
    pin: {
      type: String
    },
    pass: {
        type: String
      }
});
const Users = module.exports = mongoose.model("users", UsersSchema);

module.exports = {
    Users: Users,
}