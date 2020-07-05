import db from '../config/db.js'
const Account = db.account

const findAll = async () => {
  global.logger.info('Search all accounts')
  const accounts = await Account.find()
  return accounts
}

const findAllSortedMinBalance = async () => {
  global.logger.info('Search all accounts')
  const accounts = await Account.find().sort({ balance: 1 })
  return accounts
}

const findAllSortedMaxBalance = async () => {
  global.logger.info('Search all accounts')
  const accounts = await Account.find().sort({ balance: -1, name: 1 })
  return accounts
}

const findOneByAgencyAndAccount = async ({ agencia, conta }) => {
  global.logger.info(`Search account with agencia ${agencia} and conta ${conta}`)
  const account = await Account.findOne({ agencia: agencia, conta: conta })
  return account
}

const findAccountsByAgency = async ({ agencia }) => {
  global.logger.info(`Search account with agencia ${agencia}`)
  const accounts = await Account.find({ agencia: agencia })
  return accounts
}

const findOneByAccount = async ({ conta }) => {
  global.logger.info(`Search account with conta ${conta}`)
  const account = await Account.findOne({ conta: conta })
  return account
}

const update = async (account) => {
  const { _id, agencia, conta } = account
  global.logger.info(`Updating agencia ${agencia} and conta ${conta}`)
  const updatedAccount = await Account.findByIdAndUpdate(_id, account, { new: true })
  global.logger.info('Updated account.')
  return updatedAccount
}

const removeById = async (id) => {
  global.logger.info(`deleting account...${id}`)
  const data = await Account.findByIdAndRemove({ _id: id })
  global.logger.info('deleted account.')

  return data
}
const updatePrivateGroup = async () => {
  const data = await Account.aggregate([
    {
      $group: {
        _id: '$agencia'
      }
    }
  ])

  const updatePromises = data.map(async (agency) => {
    const bestAccount = await Account.findOne({ agencia: agency._id }).sort(
      '-balance'
    )
    return await bestAccount.updateOne({ agencia: 99 })
  })

  await Promise.all(updatePromises)

  return await Account.find({ agencia: 99 }, { _id: 0 }).sort(
    '-balance'
  )
}

export {
  findAll,
  findOneByAgencyAndAccount,
  findOneByAccount,
  findAllSortedMaxBalance,
  findAllSortedMinBalance,
  findAccountsByAgency,
  update,
  removeById,
  updatePrivateGroup
}
