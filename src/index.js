import express from "express"
import { db_initialize_create } from "./db.js"
import itemRoutes from "./routes/items.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000;
//const key = process.env.JWT_SECRET;

app.use("/items", itemRoutes);

app.get('/health', (req, res) => {
    res.json( { status: "OK" } )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  //console.log(`The secret key is ${key}`)
})

db_initialize_create().then(() => {
    console.log("The database has been initialized!")
});