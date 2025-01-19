
const { error } = require("console");
const express=require("express");
const app=express();
app.use(express.json())


class Book{

    constructor(id,name,title){
        this.id=id
        this.name=name
        this.title=title
    }
     ChangeTranslation(language){
        
        this.title=`${this.title} - (${language})`

     }

     static validate(book){
        if(!(book instanceof Book)) return 'book must be instance of the book class'
        if(!book.id || typeof book.id!=="number") return 'invalid or missing ID'
        if(!book.name || typeof book.name!=="string") return 'invalid or miising book name'
        if(!book.title || typeof book.title!=="string") return 'invalid or missing book title'
        return null;
     }
}

let books=[]

app.post("/books",(req,res)=>{

    const {id,name,title}=req.body
    if(books.some((book)=>book.id===id)){
        return res.status(400).json({error:"this book already exist"})
    }

    const newBook=new Book(id,name,title)
    const error=Book.validate(newBook)
    if(error) return res.status(400).json({error})
    books.push(newBook)
    res.status(201).json({message:"book has been added",book:newBook})

})

app.get("/books",(req,res)=>{

    res.status(200).json(books)

})

app.get("/books/:id",(req,res)=>{
    const bookID=parseInt(req.params.id)
   const book=books.find(book=>book.id==bookID)
   if(!book) res.status(404).json({error:"sorry book does not exist"})
    res.status(200).json(book)
    
})

app.put("/books/:id",(req,res)=>{

    const bookID= parseInt(req.params.id,10)
    const bookIndex=books.findIndex((book)=>book.id===bookID)

    if(bookIndex===-1) return res.status(400).json({error:"book is not found"})
    
    const {name,title}=req.body
    if (name) books[bookIndex].name=name
    if(title) books[bookIndex].title=title
    res.status(200).json({"message":"book has been updated",book:books[bookIndex]})

})

app.delete("/books/:id",(req,res)=>{

    const bookID= parseInt(req.params.id,10)
    const bookIndex=books.findIndex((book)=>book.id===bookID)

    if(bookIndex===-1) return res.status(400).json({error:"book is not found"})
    
    books.splice(bookIndex,1)
    return res.status(200).json({"message":"book has been deleted"})

})

app.patch("/books/:id/translation",(req,res)=>{
    const bookID= parseInt(req.params.id,10)
    const{language}=req.body
    if(!language || typeof language !=="string"){
        res.status(400).json({error:"sorry invalid or missing language"})
    }
    const book=books.find((b)=>b.id===bookID)
    if(!book) return res.status(404).json({error:"the book is not found"})
    
    Book.ChangeTranslation(language)
    res.status(200).json({message:"update translate",language})
})


const port=3000;
app.listen(port,()=>{
    console.log(`library system is started on http://localhost:${port}`)
})