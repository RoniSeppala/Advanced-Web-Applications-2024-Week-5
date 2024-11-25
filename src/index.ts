import {Router, Request, Response} from "express"
import fs from "fs"
import path from "path"

const router: Router = Router()

type TUser = {
    name: string,
    todos: string[]
}

//check if data.json exists and if not, then create it
const dataJsonFilepath = path.join(__dirname, '../../data.json')

if (!fs.existsSync(dataJsonFilepath)){
    fs.writeFileSync(dataJsonFilepath, "", "utf8")
}


//hello world
router.get("/hello", (req:Request, res:Response) => {
    res.json({"msg":"hello world"})
})

router.post("/add", (req:Request, res:Response) => {
    const reqName = req.body.name
    const reqTodo = req.body.todo

    let todoData: TUser[] = [];

    fs.readFile("data.json", "utf8", (error: NodeJS.ErrnoException | null, data: string) => {
        if (error) {
            console.error(error)
            res.json({"msg":"read file error"})
            return
        }

        try {
            if (data.trim()){
                todoData = JSON.parse(data)
            }
        } catch (parseError: any) {
            console.error(`Json parse error ${parseError}`)
            res.json({"msg":"json parse error"})
            return
        }

        const existingUser = todoData.find(user => user.name === reqName)

        if (existingUser) {
            existingUser.todos.push(reqTodo)
        } else {
            const newUser: TUser = {
                name: reqName,
                todos: [reqTodo]
            }

            todoData.push(newUser)
        }


        fs.writeFile("data.json", JSON.stringify(todoData), (error: NodeJS.ErrnoException | null) => {
            if (error){
                console.error(error)
                res.json({"msg":"file write error"})
                return
            }
            res.json(`Todo added successfully for user ${reqName}`)
        })
    })
})

router.get("/todos/:id", (req:Request, res:Response) => {

    const reqName = req.params.id

    let todoData: TUser[] = [];
    let userTodos: String[];

    fs.readFile("data.json", "utf8", (error: NodeJS.ErrnoException | null, data: string) => {
        if (error) {
            console.error(error)
            res.json({"msg":"read file error"})
            return
        }

        try {
            if (data.trim()){
                todoData = JSON.parse(data)
            }
        } catch (parseError: any) {
            console.error(`Json parse error ${parseError}`)
            res.json({"msg":"json parse error"})
            return
        }

        const existingUser = todoData.find(user => user.name === reqName)

        if (existingUser) {
            userTodos = existingUser.todos
            res.json(userTodos)
        } else {
            res.json("User not found")
        }

    })
})

router.delete("/delete", (req:Request, res: Response) => {
    const reqName = req.body.name

    let todoData: TUser[] = [];
    let newTodoData: TUser[] = [];

    fs.readFile("data.json", "utf8", (error: NodeJS.ErrnoException | null, data: string) => {
        if (error) {
            console.error(error)
            res.json({"msg":"read file error"})
            return
        }

        try {
            if (data.trim()){
                todoData = JSON.parse(data)
            }
        } catch (parseError: any) {
            console.error(`Json parse error ${parseError}`)
            res.json({"msg":"json parse error"})
            return
        }

        newTodoData = todoData.filter(user => user.name !== reqName)

        if (JSON.stringify(newTodoData) != JSON.stringify(todoData)) {
            fs.writeFile("data.json", JSON.stringify(newTodoData), (error: NodeJS.ErrnoException | null) => {
                if (error){
                    console.error(error)
                    res.json({"msg":"file write error"})
                    return
                }
                res.json(`User deleted successfully`)
            })
        } else {
            res.json(`User not found`)
        }
    })
})

router.put("/update", (req:Request, res:Response) => {
    console.log(req.body)
    const reqName = req.body.name
    const reqDeleteTodo = req.body.todo

    let todoData: TUser[] = [];

    fs.readFile("data.json", "utf8", (error: NodeJS.ErrnoException | null, data: string) => {
        if (error) {
            console.error(error)
            res.json({"msg":"read file error"})
            return
        }

        try {
            if (data.trim()){
                todoData = JSON.parse(data)
            }
        } catch (parseError: any) {
            console.error(`Json parse error ${parseError}`)
            res.json({"msg":"json parse error"})
            return
        }

        const existingUser = todoData.find(user => user.name === reqName)

        if (existingUser) {
            for (let index = 0; index < existingUser.todos.length; index++) {
                const element = existingUser.todos[index];
                if (element == reqDeleteTodo) {
                    existingUser.todos.splice(index, 1)
                    break
                }
            }
        } else {
            console.log("todo not found")
            res.json({"msg":"todo not found"})
            return
        }

        fs.writeFile("data.json", JSON.stringify(todoData), (error: NodeJS.ErrnoException | null) => {
            if (error){
                console.error(error)
                res.json({"msg":"file write error"})
                return
            }
            res.json(`Todo deleted successfully`)
        })
    })
})

export default router