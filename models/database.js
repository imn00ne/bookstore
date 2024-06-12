const mongoose = require("mongoose");

mongoose
.connect("mongodb://127.0.0.1:27017/bookmodel")
.then(()=>{
    console.log("database concted");

})

.catch((err) =>{
    console.log(err.message);
});


// const mongoose = require("mongoose");
// mongoose
//     .connect(process.env.MONGO_URL)
//     .then(() => {
//         console.log("Database Connected!");
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });