export default (mongoose) => {
  const schema = mongoose.Schema({
    agencia: {
      type: Number,
      required: true
    },
    conta: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true
    }
  })

  // renomeacao da collection repete a atribuicao depois do schema
  const Account = mongoose.model('account', schema, 'account')

  return Account
}
