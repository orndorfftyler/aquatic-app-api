function makeUsersArray() {
    return [
        {
          id: 1,
          username: 'Bulbasaur',
          pw: '$2a$04$eiOmCEDM7wF.5YgBJZ1wcuBMR2dDeqdtadlkQvmVmO7sLvd1YIXI.'
        },
        {
          id: 2,
          username: 'Pikachu',
          pw: '$2a$04$2d4jbxnHeUFZtBbgbNxyJuaG0ArlGThAFQt1BRlaXnbG4dnrZRPMS'
        },
        {
          id: 3,
          username: 'Squirtle',
          pw: '$2a$04$IOdFJCcPq5MwZ1Pd7RNU5eVe6JDkt48G6Z79InupI/aoIRE.53SNK'
        }
      ];
  }
  
  module.exports = {
    makeUsersArray
  }