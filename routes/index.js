var express = require('express');
var router = express.Router();
const path = require("path");
const fs = require("fs");


const bookCollection = require("../models/bookschema")
const { checkPrice } = require("../utils/middlewares");
const upload = require("../utils/multer");
// const upload = require("../utils/multer").single("poster");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});


router.get("/library", async function (req, res, next) {
  try {
      const books = await bookCollection.find();
      res.render("library", { books: books });
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

router.get('/about', function(req, res, next) {
  res.render('home');
});



router.get("/create-book", function (req, res, next) {
  res.render("createbook");
});


router.post(
  "/create-book",
  upload.single("poster"),
  checkPrice,
  async function (req, res, next) {
      try {
          const newBook = await new bookCollection({
              ...req.body,
              poster: req.file.filename,
          });

          await newBook.save();
          res.redirect("/library");
      } catch (error) {
          res.send(error);
          console.log(error);
      }
  }
);

// router.post("/create-book", checkPrice, async function (req, res, next) {
//   upload(req, res, async function (err) {
//       if (err) {
//           console.log(err);
//           res.json(err);
//       } else {
//           // ------------------------
//           try {
//               const newBook = await new bookCollection({
//                   ...req.body,
//                   poster: req.file.filename,
//               });

//               await newBook.save();
//               res.redirect("/library");
//           } catch (error) {
//               console.log(error);
//               res.send(error);
//           }
//         }

          // --------------------

      //   });
      // });

router.get('/', function(req, res, next) {
  res.render('createbook');
});

router.get('/about', function(req, res, next) {
  res.render('updatebook');
});

router.get("/details/:id", async function (req, res, next) {
  try {
      const book = await bookCollection.findById(req.params.id);
      res.render("detailsbook", { book: book });
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

router.get("/update-book/:id", async function (req, res, next) {
  try {
      const book = await bookCollection.findById(req.params.id);
      res.render("updatebook", { book: book });
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

router.post("/update-book/:id",upload.single("poster"), async function (req, res, next) {
  try {
    const updatedBook = {...req.body};
    // if(req.file){
    //   updatedBook.poster = req.file.filename;
    //   fs.unlinkSync(
    //     path.join(
          
    //       __dirname, `../public/images/${req.body.oldimage}`
    //     )
    //   );  
    // }
    if (req.file) {
      updatedBook.poster = req.file.filename;
      const oldImagePath = path.join(__dirname, `../public/images/${req.body.oldimage}`);

      // Check if old image exists before attempting to delete
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log('Old image deleted:', oldImagePath);
      } else {
        console.warn('Old image file does not exist:', oldImagePath);
      }
    }


      await bookCollection.findByIdAndUpdate(req.params.id,updatedBook);
      res.redirect(`/details/${req.params.id}`);
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

router.get("/delete-book/:id", async function (req, res, next) {
  try {
      // await bookCollection.findByIdAndDelete(req.params.id);
      const book = await bookCollection.findByIdAndDelete(req.params.id);

      fs.unlinkSync(path.join(__dirname, `../public/images/${book.poster}`));
      res.redirect("/library");
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

module.exports = router;
