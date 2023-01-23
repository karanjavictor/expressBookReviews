const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
      if(!isValid(username)){
          users.push({"username": username, "password": password})
          return res.status(200).json({message: "User successfully registered. Now you can log in"});
      }else {
          return res.status(404).json({message : "User already exists!"})
      }
  }
  return res.status(404).json({message: "Unable to register user!"});
});
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn])
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const bookKeys = Object.keys(books)
    const author = req.params.author
    for(let i = 0; i < bookKeys.length; i++) {
        if(books[bookKeys[i]].author === author){
            res.send({
                author: books[bookKeys[i]].author,
                title: books[bookKeys[i]].title,
                reviews: books[bookKeys[i]].reviews
            })
        }
    }
    
   
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookKeys = Object.keys(books)
  const title = req.params.title
  for(let i = 0; i < bookKeys.length; i++) {
      if(books[bookKeys[i]].title === title){
          res.send({
              author: books[bookKeys[i]].author,
              title: books[bookKeys[i]].title,
              reviews: books[bookKeys[i]].reviews
          })
      }
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const Isbn = req.params.isbn
  res.send(books[Isbn])
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
