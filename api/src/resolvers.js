/**
 * Here are your Resolvers for your Schema. They must match
 * the type definitions in your scheama
 */

module.exports = {
  Query: {
    pets: (_, { input }, context) => { console.log(JSON.stringify(input, null, 2)); console.log(JSON.stringify(context, null, 2)); return context.models.Pet.findMany(input); },
    pet: (_, { input }, context) => { console.log(JSON.stringify(input, null, 2)); console.log(JSON.stringify(context, null, 2)); return context.models.Pet.findOne(input); }
  },
  Mutation: {
    newPet: (_, { input }, context) => {
      return context.models.Pet.create(input)
    }
  },
  // Pet: {
  //   img(pet) {
  //     return pet.type === 'DOG'
  //       ? 'https://placedog.net/300/300'
  //       : 'http://placekitten.com/300/300'
  //   }
  // },
  User: {
    pets: (_, __, context) => {
      return context.models.Pet.findMany()
    }
  },
  Pet: {
    owner: (_, __, context) => {
      return context.models.User.findOne();
    }
  }
}
