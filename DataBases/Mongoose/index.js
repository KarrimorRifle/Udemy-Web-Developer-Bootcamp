const mongoose = require("mongoose");
const {schema} = mongoose;

main()
    .then(() => {console.log("worked")})
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

