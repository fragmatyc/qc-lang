// index.qc - Point d'entrée de l'application Todo API
Prend express De "express"
Prend TodoController De "./controllers/todoController.qc"

// Créer l'application Express
Faik'app C't'un Express = Call express

// Middleware pour parser le JSON
Call use Su app PisPawceZy Call json Su express

// Créer le contrôleur
Crée TodoController PisSacreLéDans controller
Call init Su controller

// Définir les routes
Call get Su app PisPawceZy "/todos", controller.handleGetTous
Call get Su app PisPawceZy "/todos/:id", controller.handleGetParId
Call post Su app PisPawceZy "/todos", controller.handleCreer
Call put Su app PisPawceZy "/todos/:id", controller.handleMettreAJour
Call patch Su app PisPawceZy "/todos/:id/complete", controller.handleMarquerComplete
Call delete Su app PisPawceZy "/todos/:id", controller.handleSupprimer

// Route de base
Faik'handleAccueil C't'une Fonction
    Fotuïpawce req, C't'un Request,
    Fotuïpawce res, C't'un Response,
Piafait
    Faik'reponse C't'un Objet = { message: "Bienvenue sur Todo API - Faite en QcLang!", version: "1.0.0" }
    Call json Su res PisPawceZy reponse

Call get Su app PisPawceZy "/", handleAccueil

// Démarrer le serveur
Faik'PORT C't'un Chif = 3000

Faik'onServerStart C't'une Fonction
Piafait
    Log("Todo API QcLang roule sur le port " + PORT)

Call listen Su app PisPawceZy PORT, onServerStart
