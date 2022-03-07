import mongoose from './db'

const BcaUsersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
},{
  timeStamps: true,
})

export const BcaUsers = mongoose.model('bcausers', BcaUsersSchema)