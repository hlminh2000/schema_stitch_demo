const { gql } = require('apollo-server');
const fetch = require('node-fetch');
const {makeExecutableSchema} = require('graphql-tools');

const USER_SERVICE_ROOT = "http://localhost:9001"

const typeDefs = gql`
    enum UserStatus {
        APPROVED
        PENDING
        REJECTED
    }

    enum UserType {
        ADMIN
        USER
    }

    type User {
        id: Int
        email: String
        first_name: String
        last_name: String
        created_at: Float
        last_login: Float
        name: String
        preferred_language: String
        status: UserStatus
        type: UserType
        applications: [String]
        groups: [String]
        permissions: [String]
    }

    type Query {
        userById(id: Int!): User
    }
`;

const resolvers = {
    Query: {
        userById: (_, args) => 
            fetch(`${USER_SERVICE_ROOT}/user/${args.id}`)
                .then(res => res.json())
        ,
    },
};

const makeExecutableUserSchema = () => 
    makeExecutableSchema({
        typeDefs,
        resolvers,
    })
module.exports = makeExecutableUserSchema
