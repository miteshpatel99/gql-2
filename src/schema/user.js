const { gql } = require('apollo-server-express')

const User = gql`
 type User{
     _id:ID
    id:String,
    name: String,
    email:String
  }`

module.exports = User
