import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import createLogger from './config/logger.js'
import cors from 'cors'
// Routes
import accountRouter from './routes/account.js'

dotenv.config()

global.logger = createLogger()

const logger = global.logger

logger.info('connecting on Mongo DB...')
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
logger.info('connected on Mongo DB')

const app = express()

// Enable JSON on Express
app.use(express.json())

// Enable CORS on project
app.use(cors())

// Routes
app.use('/account', accountRouter)

app.listen(3000, () => {
  logger.info('Server running ...')
})
