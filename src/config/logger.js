import winston from 'winston'
const { combine, timestamp, label, printf } = winston.format

const createLogger = (labelName = 'trabalho-api', filename = 'storage/logs/trabalho-api.log') => {
  const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`
  })

  return winston.createLogger({
    level: 'silly',
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: filename })
    ],
    format: combine(
      label({ label: labelName }),
      timestamp(),
      myFormat
    )
  })
}
export default createLogger
