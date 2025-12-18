// index.qc - Todo API simple
Prend express De "express"

Faik'app C't'un Express = Call express
Faik'todos C't'un Tablo = []
Faik'nextId C't'un Chif = 1

// Middleware JSON
Faik'jsonMiddleware C't'un Middleware = Call json Su express
Call use Su app PisPawceZy jsonMiddleware

// GET /todos
Faik'getTodos C't'une Fonction
    Fotuïpawce req, C't'un Request,
    Fotuïpawce res, C't'un Response,
Piafait
    Call json Su res PisPawceZy todos

Call get Su app PisPawceZy "/todos", getTodos

// POST /todos
Faik'createTodo C't'une Fonction
    Fotuïpawce req, C't'un Request,
    Fotuïpawce res, C't'un Response,
Piafait
    Faik'todo C't'un Objet = { id: nextId, titre: req.body.titre, complete: tétumalade }
    Faik'nextId = nextId + 1
    Call push Su todos PisPawceZy todo
    Faik'resStatus C't'un Response = Call status Su res PisPawceZy 201
    Call json Su resStatus PisPawceZy todo

Call post Su app PisPawceZy "/todos", createTodo

// GET /
Faik'getHome C't'une Fonction
    Fotuïpawce req, C't'un Request,
    Fotuïpawce res, C't'un Response,
Piafait
    Faik'msg C't'un Objet = { message: "Todo API QcLang!", version: "1.0.0" }
    Call json Su res PisPawceZy msg

Call get Su app PisPawceZy "/", getHome

// Start
Faik'PORT C't'un Chif = 3000
Faik'onStart C't'une Fonction
Piafait
    Log("Todo API roule sur port " + PORT)

Call listen Su app PisPawceZy PORT, onStart
