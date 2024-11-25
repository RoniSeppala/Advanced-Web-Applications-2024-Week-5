const form = document.getElementById("todoForm")
const searchForm = document.getElementById("searchForm")
const output = document.getElementById("output")
const searchOutput = document.getElementById("todoList")
const userDeleteButtonDiv = document.getElementById("userDeleteButtonField")
const todoDeleteOutputDiv = document.getElementById("todoDeleteButtonOutput")

function loadUserTodos(user) {
    searchOutput.innerText = ""

    fetch("http://localhost:3000/todos/" + user).then((response) => response.json()).then((data) => {
        if (data == "User not found"){
            const outputListelement = document.createElement("li")
            outputListelement.innerText = "User not found"
            searchOutput.appendChild(outputListelement)
        } else {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                const newListElement = document.createElement("li")

                const newListLinkElement = document.createElement("a")
                newListLinkElement.href = "#"
                newListLinkElement.classList.add('delete-task')
                newListLinkElement.innerText = element
                newListLinkElement.onclick = () => deleteThisTodo(user, element, index)

                newListElement.appendChild(newListLinkElement)
                searchOutput.appendChild(newListElement)

                userDeleteButtonDiv.innerText = ""
                const userDeleteButton =  document.createElement("button")
                userDeleteButton.id = "deleteUser"
                userDeleteButton.innerText = `Delete ${user}`
                userDeleteButton.onclick = () => userDeleteButtonFunction(user)

                userDeleteButtonDiv.appendChild(userDeleteButton)
            }
        }
    })
}

function deleteThisTodo(userName, todoName, todoIndex){
    console.log(userName)
    console.log(todoName)
    console.log(todoIndex)

    const data = {
        "name": userName,
        "todo": todoName
    }

    fetch("http://localhost:3000/update", {
        method: "put",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => response.json()).then((data) => {
        console.log(data)
        todoDeleteOutputDiv.innerText = data

        loadUserTodos(userName)
    })
}

function userDeleteButtonFunction(userName) {
    fetch("http://localhost:3000/delete", {
        method: "delete",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({"name": userName})
    }).then((response) => response.json()).then((data) => {
        console.log(data)
        const userDeletionInfo = document.createElement("p")
        userDeletionInfo.innerText = data
        if (data == "User deleted successfully") {
            searchOutput.innerText = ""
        }

        userDeleteButtonDiv.appendChild(userDeletionInfo)
    })
}

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const user = form.elements["userInput"].value
    const todo = form.elements["todoInput"].value

    const data = {
        "name": user,
        "todo": todo
    }

    console.log(data)

    fetch("http://localhost:3000/add", {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(data)
    }).then((response) => response.json()).then((data) => {
        console.log(data)
        output.innerText = ""
        const outputPElement = document.createElement("p")
        outputPElement.textContent = data
        output.appendChild(outputPElement)
    })
})

searchForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const searchedUser = searchForm.elements["searchInput"].value

    loadUserTodos(searchedUser)
})