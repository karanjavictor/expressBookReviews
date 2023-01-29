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
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
}); 

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
let bookList = []
  for(const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for(let i = 0; i < book.length; i++){
      if(book[i][0] === 'author' && book[i][1] === req.params.author){
        bookList.push(books[key]);
      }
    }
  }
  if(bookList.length === 0){
    return res.status(300).json({message : "Author not Found!"})
  }
  res.send(bookList)
});

// Get all books based on title

public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let bookList = []
  for(const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for(let i = 0; i < book.length; i++){
      if(book[i][0] === 'title' && book[i][1] === req.params.title){
        bookList.push(books[key]);
      }
    }
  }
  if(bookList.length === 0){
    return res.status(300).json({message : "title not Found!"})
  }
  res.send(bookList)
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  res.send(books[isbn].reviews)
});
//code for getting the list of books in the shop using promise callbacks

function gettingBooks(){
  return new Promise((resolve,reject)=> {
    resolve(books)
  })
}
public_users.get('/',function (req,res){
  gettingBooks.then(
    (theBooks)=> res.send(JSON.stringify(theBooks,null,4)),
    (error) => res.send(error)
  )
});
// code for getting book details based on isbn using promise callbacks
function getISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve,reject)=> {
    if(book_){
      resolve(book_)
    }else {
      reject("Unable to find book!")
    }
  })
}

public_users.get('/isbn/:isbn',function(req,res){
  const isbn = req.params.isbn;
  getISBN(isbn).then(
    (theBooks)=> res.send(JSON.stringify(theBooks, null, 4)),
    (error) => res.send(error)
  )
})
//Adding promise Callback to the code
function getbyAuthor(author) {
  let output = [];
  return new Promise((resolve,reject)=> {
    for(var isbn in books){
      let book_ = books[isbn]
      if(book_.author === author){
        output.push(book_);
      }
    }
    resolve(output)
  })
}
//get book details based on author
public_users.get('/author/:author',function (req,res){
  const author = req.params.author;
  getbyAuthor(author)
  .then(
    result => res.send(JSON.stringify(result, null, 4))
  );
});
function getbyTitle(title) {
  let output = [];
  return new Promise((resolve,reject) => {
    for(var isbn in books){
      let book_= books[isbn]
      if (book_.title === title){
        output.push(book_)
      }
    }
    resolve(output)
  })
}
//get book details based on title
public_users.get('/title/:title', function (req,res){
  const title = req.params.title;
  getbyTitle(title)
  .then(
    result => res.send(JSON.stringify(result, null, 4))
  );
});




module.exports.general = public_users;