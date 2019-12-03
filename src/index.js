const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const { prepare } = require('./util')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const UserSchema = require('./schema/user')
const dbName = 'test'
const port = process.env.PORT || 4000
const path = require('path')
// Construct a schema, using GraphQL schema language

const start = async () => {
  try {
    const client = new MongoClient('mongodb+srv://arvind:dangar@cluster0-cmyl5.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    const db = await client.connect()
    const User = client.db(dbName).collection('users')
    const UserQuery = gql`
        type Query {
            users: [User]
        }
        `
    const typeDefs = [UserQuery, UserSchema]
    // Provide resolver functions for your schema fields
    const resolvers = {
      Query: {
        users: async () => {
          console.log('cokig')
          return (await User.find({}).toArray()).map(prepare)
          // return prepare(await User.find())
        }
      }
    }

    const server = new ApolloServer({ typeDefs, resolvers })

    const app = express()
    app.use(cors())
    app.use(bodyParser())
    server.applyMiddleware({ app })
    app.use(express.static(path.join(__dirname, 'pages')))
    app.get('/', (req, res) => {
      console.log(req.body)
      res.render('./pages/index')
      // res.json({ 'message': 'Welcome to advanced framework application. API is working fine.' })
    })
    // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

    app.listen({ port }, () =>
      console.log(` http://localhost:${port}${server.graphqlPath}`)
    )
  } catch (e) {
    console.log(e)
  }
}

start()
