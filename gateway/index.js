const { ApolloServer } = require('apollo-server')
const { mergeSchemas } = require("graphql-tools")

const makeExecutableUserSchema = require("./schemas/userService")
const makeExecutableProgramSchema = require("./schemas/programService")

const linkTypeDefs = `
  extend type User {
    programs: [Program]
  }
`;

const userSchema = makeExecutableUserSchema()
const programSchema = makeExecutableProgramSchema()

const schema = mergeSchemas({
  schemas: [
    userSchema,
    programSchema,
    linkTypeDefs
  ],
  resolvers: {
    User: {
      programs: {
        fragment: `... on User { permissions }`,
        resolve: (user, args, context, info) => 
          user.permissions.map(p => 
            info.mergeInfo.delegateToSchema({
              schema: programSchema,
              operation: 'query',
              fieldName: 'programByName',
              args: {
                name: p,
              },
              context,
              info,
            })
          )
      }
    }
  }
})

const server = new ApolloServer({ 
  schema,
  uploads: false 
});

server.listen().then(({ url }) => {
  console.log(`🚀  Gateway ready at ${url}`);
});