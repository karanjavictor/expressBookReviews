const express = require('express');
const axios = require('axios');
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
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    const response = await axios({books: books}, {responseType: 'json'});
    const allBooks = response.data;
    res.json(allBooks);
    return res.status(200).json({message: "Successfully retrieved books data"});
  } catch (err) {
      return res.status(400).json({message: err})
  }
}); 

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  try{
    const response = await axios({books: books[isbn] });
    return res.status(200).json({book: response.data}); 
    } catch(err) { 
    return res.status(400).json({message: err});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const bookKeys = Object.keys(books)
  const author = req.params.author
  try {
    for(let i = 0; i < bookKeys.length; i++) {
        if(books[bookKeys[i]].author === author){
            const response = await axios({
                author: books[ bookKeys[i]].author,
                title: books[bookKeys[i]].title,
                reviews: books[bookKeys[i]].reviews
            }); 
            return res.status(200).json({book: response.data});
        }
    }
  } catch(err) { 
    return res.status(400).json({message: err});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const bookKeys = Object.keys(books)
  const title = req.params.title
  try{
  for(let i = 0; i < bookKeys.length; i++) {
      if(books[bookKeys[i]].title === title){
          const response = await axios({
            author: books[bookKeys[i]].author,
            title: books[bookKeys[i]].title,
            reviews: books[bookKeys[i]].reviews})
          return res.status(200).json({book: response.data})
      }
    }
    } catch(err) {
        return res.status(200).json({message : err})
    }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  try {
      const response = await axios({reviews : books[isbn].reviews})
      return res.status(200).json({book:response.data})
  } catch(err) {
      res.status(400).json({message : err})
  }
});

module.exports.general = public_users;