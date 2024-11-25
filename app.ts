import express, {Express} from "express"
import router from "./src/index"
import path from "path"

const app: Express = express()
const port = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname,"../public")))
app.use("/",router)

app.listen(port, () =>{
    console.log(`Server running on port ${port}`)
})