const { gql } = require('apollo-server');
const fetch = require('node-fetch');
const {makeExecutableSchema} = require('graphql-tools');

const PROGRAM_SERVICE_ROOT = "http://localhost:9002"

const typeDefs = gql`

    type CancerType {
        id: String
        name: String
    }

    type PrimarySite {
        id: String
        name: String
    }

    type Program {
        short_name: String
        description: String
        name: String
        membership_type: String
        commitment_donors: Int
        submitted_donors: Int
        genomic_donors: Int
        website: String
        institutions:String
        countries: String
        regions: String
        cancer_types: [CancerType]
        primary_sites: [PrimarySite]
        created_at: Float
        updated_at: Float
        adminIds: [Int]
    }

    type Query {
        programByName(name: String!): Program
    }
`;

const resolvers = {
    Query: {
        programByName: (_, args) => 
            fetch(`${PROGRAM_SERVICE_ROOT}/program/${args.name}`)
                .then(res => res.json())
        ,
    },
};

const makeExecutableProgramSchema = () => 
    makeExecutableSchema({
        typeDefs,
        resolvers,
    })
module.exports = makeExecutableProgramSchema
