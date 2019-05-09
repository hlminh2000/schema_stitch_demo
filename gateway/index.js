const { ApolloServer } = require('apollo-server')
const { mergeSchemas } = require("graphql-tools")

const { gql } = require('apollo-server');
const makeExecutableUserSchema = require("./schemas/userService")
const makeExecutableProgramSchema = require("./schemas/programService")

const linkTypeDefs = gql`
  extend type User {
    programs: [Program]
  }
  extend type Program {
    adminUsers: [User]
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
    },
    Program: {
      adminUsers: {
        fragment: `... on Program { adminIds }`,
        resolve: (program, args, context, info) => 
          program.adminIds.map(id => 
            info.mergeInfo.delegateToSchema({
              schema: userSchema,
              operation: 'query',
              fieldName: 'userById',
              args: { id },
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