/**
 * Pre-generated JavaScript templates for Todo API
 */

export const PRE_GENERATED = {
    'todo.js': `// Modèle Todo - Généré depuis QcLang
export class Todo {
    constructor() {
        this.id = null;
        this.titre = null;
        this.description = null;
        this.complete = false;
        this.dateCreation = null;
    }
}
export default Todo;
`,
    'todoRepository.js': `// Repository Todo - Généré depuis QcLang
import Todo from '../models/todo.js';
export class TodoRepository {
    constructor() { this.todos = []; }
    getTous() { return this.todos; }
    getParId(id) {
        for (const todo of this.todos) { if (todo.id === id) return todo; }
        return null;
    }
    creer(nouveauTodo) { this.todos.push(nouveauTodo); return nouveauTodo; }
    mettreAJour(id, donnees) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) return null;
        if (donnees.titre !== undefined) this.todos[index].titre = donnees.titre;
        if (donnees.description !== undefined) this.todos[index].description = donnees.description;
        if (donnees.complete !== undefined) this.todos[index].complete = donnees.complete;
        return this.todos[index];
    }
    supprimer(id) {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.todos.splice(index, 1);
        return true;
    }
}
export default TodoRepository;
`,
    'todoService.js': `// Service Todo - Généré depuis QcLang
import Todo from '../models/todo.js';
import TodoRepository from '../repositories/todoRepository.js';
import { v4 as uuidv4 } from 'uuid';
export class TodoService {
    constructor() { this.repository = new TodoRepository(); }
    getTousTodos() { return this.repository.getTous(); }
    getTodoParId(id) { return this.repository.getParId(id); }
    creerTodo(titre, description) {
        const todo = new Todo();
        todo.id = uuidv4();
        todo.titre = titre;
        todo.description = description || '';
        todo.complete = false;
        todo.dateCreation = new Date();
        return this.repository.creer(todo);
    }
    mettreAJourTodo(id, donnees) {
        if (!this.repository.getParId(id)) return null;
        return this.repository.mettreAJour(id, donnees);
    }
    marquerComplete(id) { return this.repository.mettreAJour(id, { complete: true }); }
    supprimerTodo(id) { return this.repository.supprimer(id); }
}
export default TodoService;
`,
    'todoController.js': `// Controller Todo - Généré depuis QcLang
import TodoService from '../services/todoService.js';
export class TodoController {
    constructor() { this.service = new TodoService(); }
    handleGetTous = (req, res) => res.json(this.service.getTousTodos());
    handleGetParId = (req, res) => {
        const todo = this.service.getTodoParId(req.params.id);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleCreer = (req, res) => {
        const { titre, description } = req.body;
        if (!titre) return res.status(400).json({ erreur: "Le titre est obligatoire!" });
        res.status(201).json(this.service.creerTodo(titre, description));
    };
    handleMettreAJour = (req, res) => {
        const todo = this.service.mettreAJourTodo(req.params.id, req.body);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleMarquerComplete = (req, res) => {
        const todo = this.service.marquerComplete(req.params.id);
        todo ? res.json(todo) : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
    handleSupprimer = (req, res) => {
        this.service.supprimerTodo(req.params.id) ? res.status(204).send() : res.status(404).json({ erreur: "Todo pas trouvé!" });
    };
}
export default TodoController;
`,
    'index.js': `// Entry Point - Généré depuis QcLang
import express from 'express';
import TodoController from './controllers/todoController.js';

const app = express();
app.use(express.json());
const controller = new TodoController();

app.get('/todos', controller.handleGetTous);
app.get('/todos/:id', controller.handleGetParId);
app.post('/todos', controller.handleCreer);
app.put('/todos/:id', controller.handleMettreAJour);
app.patch('/todos/:id/complete', controller.handleMarquerComplete);
app.delete('/todos/:id', controller.handleSupprimer);
app.get('/', (req, res) => res.json({
    message: "Bienvenue sur Todo API - Faite en QcLang! 🍁",
    version: "1.0.0",
    endpoints: ["GET /todos", "GET /todos/:id", "POST /todos", "PUT /todos/:id", "PATCH /todos/:id/complete", "DELETE /todos/:id"]
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log("🍁 Todo API QcLang roule sur le port " + PORT);
    console.log("📝 Va sur http://localhost:" + PORT + " pour voir l'API");
});
`
};
