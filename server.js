import {ApolloServer,gql} from "apollo-server";

let tweets = [
    {
        id : "1",
        text: "Hello",
        userId : "2",
    },
    {
        id : "2",
        text: "Second",
        userId : "1",
    },
];

let users = [
    {
        id : "1",
        firstName : "nico",
        lastName : "las",
    },
    {
        id : "2",
        firstName : "Elon",
        lastName : "Musk",
    },
];


const typeDefs = gql`

    type User {
        id : ID!
        username : String!
        firstName : String!
        lastName : String!
        fullName : String!
    }

    type Tweet {
        id : ID!
        text : String!
        author : User
    }

    type Query{
        allUsers : [User!]!
        allTweets : [Tweet!]!
        tweet(id : ID!): Tweet
        ping : String!
    }

    type Mutation {
        postTweet(text : String!, userId : ID!) : Tweet!
        """Delete founded tweets by id"""
        deleteTweet(id:ID!) : Boolean!
    }

`;


const resolvers = {
    Query:{
        allTweets(){
            return tweets;
        },
        tweet(rood, {id}){
            return tweets.find(tweet => tweet.id === id)
        },
        allUsers(){
            console.log("allUsers called")
            return users;
        }
    },

    Mutation : {
        postTweet(_, {text, userId}){
            const newTweet = {
                id : tweets.length + 1,
                text,
            };
        tweets.push(newTweet);
        return newTweet;

        },

        deleteTweet(_, {id}){
            const tweet = tweets.find((tweet) => tweet.id === id);
            if(!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        }
    },

    User:{
        firstName({firstName}){
            return firstName;
        },

        fullName({firstName,lastName}){
            return `${firstName} ${lastName}`
        }
    },
    Tweet : {
        author({userId}){
            return users.find((user) => user.id === userId);
        }

    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`running on ${url}`);
})