const mongoose = require('mongoose')
const connectDB = async () =>{ // 1.when you work with mongoose youre working with promises so we use async await to set our functions
    try{
      const conn = await mongoose.connect(process.env.MONGO_URI, { //2.mongoose.connect is a promise so we await for it
                useNewUrlParser:true,
                  useUnifiedTopology:true,
                  //3.these 2 handle some console errors 
      })
      console.log(`MongoDB connected: ${conn.connection.host}`) // 3. basically this is our mongobd URI or database host
    }
    catch(err){//4.if something goes wrong and we cant connect we con.log error and whatever the error is and we stop the process
        console.error(err)
        process.exit(1)// 5. The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code. here our code. was 1
       

    }
} 
module.exports = connectDB 