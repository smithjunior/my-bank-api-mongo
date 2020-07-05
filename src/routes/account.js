import express from 'express'
import {
  findAllSortedMaxBalance,
  findAllSortedMinBalance,
  findOneByAgencyAndAccount,
  findOneByAccount,
  findAccountsByAgency,
  update,
  removeById,
  updatePrivateGroup
} from '../controllers/account.js'
const router = express.Router()
router.post('', async (request, response) => {
  const { agencia, conta } = request.body
  try {
    const account = await findOneByAgencyAndAccount({ agencia, conta })
    if (!account) {
      throw new Error('account does not exist')
    }
    return response.json({ balance: account.balance })
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})
router.post('/transaction', async (request, response) => {
  const { agencia, conta, value } = request.body
  try {
    const account = await findOneByAgencyAndAccount({ agencia, conta })

    if (!account) {
      throw new Error('account does not exist')
    }

    if (value >= 0) {
      account.balance += value
    } else {
      if (account.balance >= Math.abs(value)) {
        account.balance += (value - 1)
      } else {
        throw new Error('the value is above limit')
      }
    }

    const accountUpdated = await update(account)
    delete accountUpdated._id

    return response.json({ message: 'New Balance', account: accountUpdated })
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})

router.post('/transfer', async (request, response) => {
  const { agenciaSource, agenciaTarget, value } = request.body
  try {
    const accountSource = await findOneByAccount({ conta: agenciaSource })
    const accountTarget = await findOneByAccount({ conta: agenciaTarget })

    if (!accountSource || !accountTarget) {
      throw new Error('account does not exist')
    }
    if (accountSource.agencia !== accountTarget.agencia) {
      accountSource.balance -= 8
    }

    accountSource.balance -= value
    accountTarget.balance += value

    const updatedAccountSource = await update(accountSource)
    await update(accountTarget)

    return response.json({ newBalance: updatedAccountSource.balance })
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})

router.delete('', async (request, response) => {
  const { agencia, conta } = request.body
  try {
    const account = await findOneByAgencyAndAccount({ agencia, conta })

    if (!account) {
      throw new Error('account does not exist')
    }

    const dataRemove = await removeById(account._id)
    const accounts = await findAccountsByAgency({ agencia: agencia })

    return response.json({ message: 'removed with success', totalActivedAccounts: accounts.length })
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})

router.get('/send-to-private', async (request, response) => {
  try {
    const listPrivate = await updatePrivateGroup()
    return response.json(listPrivate)
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    res.status(400).send({
      message: err.message
    })
  }
})

router.post('/avg', async (request, response) => {
  const { agencia } = request.body
  try {
    const accounts = await findAccountsByAgency({ agencia: agencia })
    const totalAccounts = accounts.length

    const totalBalance = accounts.reduce((acc, item) => acc + item.balance, 0)
    return response.json({ totalAccounts: totalAccounts, avgBalance: totalBalance / totalAccounts })
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})

router.post('/max-accounts', async (request, response) => {
  const { value } = request.body
  try {
    const accounts = await findAllSortedMaxBalance()
    const accountsFiltered = accounts.filter(account => account.balance >= value)

    return response.json(accountsFiltered)
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})

router.post('/min-accounts', async (request, response) => {
  const { value } = request.body
  try {
    const accounts = await findAllSortedMinBalance()
    const accountsFiltered = accounts.filter(account => account.balance <= value)

    return response.json(accountsFiltered)
  } catch (err) {
    global.logger.info(`[ERROR] Falha na requisicao - ${err.message}`)
    return response.status(400).json({ error: err.message })
  }
})
export default router
