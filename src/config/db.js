import mongoose from 'mongoose'

import accountModel from '../models/account.js'

const db = {}

db.mongoose = mongoose
db.account = accountModel(mongoose)

export default db
