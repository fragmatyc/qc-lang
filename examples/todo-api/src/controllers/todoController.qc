// todoController.qc - Couche de contrôleur REST
Prend TodoService De "../services/todoService.qc"
Rends TodoController DispoPartout

Patente Publique TodoController
    Faik'service C't'un TodoService

    // Constructeur
    Faik'init C't'une Fonction
    Piafait
        Crée TodoService PisSacreLéDans service
        Call init Su service

    // GET /todos - Récupérer tous les todos
    Faik'handleGetTous C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'todos C't'un TabloD'Todo = Call getTousTodos Su service
        Call json Su res PisPawceZy todos

    // GET /todos/:id - Récupérer un todo par ID
    Faik'handleGetParId C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'id C't'un Tex = req.params.id
        Faik'todo C't'un Todo = Call getTodoParId Su service PisPawceZy id
        
        Si todo == ardjien
            Faik'erreur C't'un Objet = { erreur: "Todo pas trouvé, désolé!" }
            Call json Su Call status Su res PisPawceZy 404 PisPawceZy erreur
        OuSinon
            Call json Su res PisPawceZy todo

    // POST /todos - Créer un nouveau todo
    Faik'handleCreer C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'titre C't'un Tex = req.body.titre
        Faik'description C't'un Tex = req.body.description
        
        // Validation
        Si titre == ardjien
            Faik'erreur C't'un Objet = { erreur: "Le titre est obligatoire, voyons!" }
            Call json Su Call status Su res PisPawceZy 400 PisPawceZy erreur
            Artourne
        
        Faik'nouveauTodo C't'un Todo = Call creerTodo Su service PisPawceZy titre, description
        Call json Su Call status Su res PisPawceZy 201 PisPawceZy nouveauTodo

    // PUT /todos/:id - Mettre à jour un todo
    Faik'handleMettreAJour C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'id C't'un Tex = req.params.id
        Faik'donnees C't'un Objet = req.body
        
        Faik'todoMisAJour C't'un Todo = Call mettreAJourTodo Su service PisPawceZy id, donnees
        
        Si todoMisAJour == ardjien
            Faik'erreur C't'un Objet = { erreur: "Todo pas trouvé, désolé!" }
            Call json Su Call status Su res PisPawceZy 404 PisPawceZy erreur
        OuSinon
            Call json Su res PisPawceZy todoMisAJour

    // PATCH /todos/:id/complete - Marquer comme complété
    Faik'handleMarquerComplete C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'id C't'un Tex = req.params.id
        Faik'todoComplete C't'un Todo = Call marquerComplete Su service PisPawceZy id
        
        Si todoComplete == ardjien
            Faik'erreur C't'un Objet = { erreur: "Todo pas trouvé, désolé!" }
            Call json Su Call status Su res PisPawceZy 404 PisPawceZy erreur
        OuSinon
            Call json Su res PisPawceZy todoComplete

    // DELETE /todos/:id - Supprimer un todo
    Faik'handleSupprimer C't'une Fonction
        Fotuïpawce req, C't'un Request,
        Fotuïpawce res, C't'un Response,
    Piafait
        Faik'id C't'un Tex = req.params.id
        Faik'succes C't'une Boule = Call supprimerTodo Su service PisPawceZy id
        
        Si succes == tétumalade
            Faik'erreur C't'un Objet = { erreur: "Todo pas trouvé, désolé!" }
            Call json Su Call status Su res PisPawceZy 404 PisPawceZy erreur
        OuSinon
            Call send Su Call status Su res PisPawceZy 204
