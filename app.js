//CRUD OPERATION WITHOUTDATABASE lecture 7


//const { error } = require("console");
/*const express=require("express");
const app=express();
app.use(express.json())*/


/*class Book{

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
})*/


//-----------------------------------------------------------------------------------------------------------------


//CONNECTION WITH DATABASE AND CRUD OPERATIONS lecture 13

const express=require("express");
const mysql=require("mysql2")
const app=express();
app.use(express.json())

//configure mysql connection
const connection=mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"B7bksaja92@",
    database:"library"

})

//connect to mySQL
connection.connect((err)=>{

    if(err){
        console.log("error connection to mySQL: ", err)
    }
})

//add a new book to database

app.post("/books",(req,res)=>{
    
    const {id,name,title}=req.body
    const query="insert into books (id,name,title) values (?,?,?)"
     connection.query(query,[id,name,title],(err)=>{
        if(err){
            return res.status(500).json({error:"cannt adding a new book",details:err.message})
        }

        res.status(201).json({message:"book has been added"})

     })

})

// Get all books
app.get("/books",(req,res)=>{

    const query="select * from books"
    connection.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving the books",details:err.message})
        }
        if(results.length===0){
            return res.status(404).json({results:"books has not found"})

        }
        res.json(results)
    })

})


//get book by id

app.get("/books/:id",(req,res)=>{

    const query="select * from books where id=?"
    connection.query(query,[req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving book by id",details:err.message})
        }
        if(results.length===0){
            return res.status(404).json({message:"sorry book not found"})

        }

        res.json(results[0])
    })

})

//update books by id

app.put("/books/:id",(req,res)=>{

    const {name,title}=req.body
    const query="UPDATE books set name=? , title=? where id=?"

    connection.query(query,[name,title,req.params.id],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error updating book by id",details:err.message})

        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry book has not found"})
        }

        res.status(200).json({message:"book has been updated"})
    })

})

// delete book by id

app.delete("/books/:id",(req,res)=>{
    const query="DELETE from books where id=?"
    connection.query(query,[req.params.id],(err,results)=>{

        if(err){
            return res.status(500).json({error:"error deleting book by id",details:err.message})

        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry book has not found"})
        }

        res.status(200).json({message:"book has been deleted"})

    })
})


// translation

app.patch("/books/:id/translation",(req,res)=>{

    const {language}=req.body

    if(!language || typeof language !=="string"){
        return res.status(400).json({error:"invalid or missing language"})
    }
    const query="update books set title=CONCAT(title ,'- (',?,')') where id=? "
    connection.query(query,[language,req.params.id],(err,results)=>{

        if(err){
            return res.status(500).json({error:"error updating book for translation",details:err.message})

        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry book has not found"})
        }

        res.status(200).json({message:"book has been translated"})

    })

})


//strat the server
const port=3000
app.listen(port,()=>{
    console.log(`server has been started on http://localhost:${port}`)
})


//get book shop by id

app.get("/bookshop/:shop_id",(req,res)=>{

    const query="select * from bookshop where shop_id=?"
    connection.query(query,[req.params.shop_id],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving bookshop by shop_id",details:err.message})
        }
        if(results.length===0){
            return res.status(404).json({message:"sorry bookshop not found"})

        }

        res.json(results[0])
    })

})

//get cities

app.get("/bookshop",(req,res)=>{

    const query="SELECT city FROM bookshop"
    connection.query(query,(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving the cities",details:err.message})
        }
        if(results.affectedRows===0){
            return res.status(404).json({results:"cities has not found"})

        }
        res.json(results)
    })

})

//get bookshop by name

app.get("/bookshop/name/:name",(req,res)=>{

    const query="select * from bookshop where name=?"
    connection.query(query,[req.params.name],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving bookshop by name",details:err.message})
        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry bookshop not found"})

        }

        res.json(results[0])
    })

})

//get bookshop by email

app.get("/bookshop/email/:email",(req,res)=>{

    const query="select * from bookshop where email=?"
    connection.query(query,[req.params.email],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error retrieving bookshop by email",details:err.message})
        }
        if(results.length===0){
            return res.status(404).json({message:"sorry bookshop not found"})

        }

        res.json(results[0])
    })

})

//update bookshop name
app.put("/bookshop/:shop_id",(req,res)=>{

    const{name}=req.body
    const query="update bookshop set name=? where shop_id=?"
    connection.query(query,[name,req.params.shop_id],(err,results)=>{

        if(err){
            return res.status(500).json({error:"error updating bookshop name by shop_id",details:err.message})

        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry bookshop name has not found"})
        }

        res.status(200).json({message:"bookshop name has been updated"})

    })

})

//update bookshop Email

app.put("/bookshop/email/:email",(req,res)=>{

    const {email}=req.body
    const query="update bookshop set email=? where email=?"
    connection.query(query,[email,req.params.email],(err,results)=>{
        
        if(err){
            return res.status(500).json({error:"error updating bookshop email name by email",details:err.message})
        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry bookshop email has not found"})

        }
        
        res.status(200).json({message:"bookshop email has been updated"})

    })

})

//add one bookshop
app.post("/bookshop",(req,res)=>{

    const {shop_id,city,name,contactNumber,email,address}=req.body
    const query="insert into bookshop (shop_id,city,name,contactNumber,email,address) values (?,?,?,?,?,?)"
    connection.query(query,[shop_id,city,name,contactNumber,email,address],(err)=>{
        if(err){
            return res.status(500).json({error:"sorry cannt add a new bookshop",details:err.message})
        }

        res.status(200).json({message:"bookshop has been added"})
    })
})

// delete one shop
app.delete("/bookshop/:shop_id",(req,res)=>{
    const query="delete from bookshop where shop_id=?"
    connection.query(query,[req.params.shop_id],(err,results)=>{
        if(err){
            return res.status(500).json({error:"error deleting bookshop by shop_id",details:err.message})

        }
        if(results.affectedRows===0){
            return res.status(404).json({message:"sorry bookshop has not found"})
        }

        res.status(200).json({message:"bookshop has been deleted"})
    })
})