const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("Give password")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen-eldemarkki:${password}@fullstackopen-cluster.rsbew.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model("Contact", contactSchema)

if (process.argv.length >= 5) {
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4]
  })

  contact.save().then(() => {
    console.log("Contact saved!")
    mongoose.connection.close()
  })
}
else if(process.argv.length === 3){
  Contact.find({}).then(contacts => {
    console.log("phonebook:")
    contacts.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })

    mongoose.connection.close()
  })
}