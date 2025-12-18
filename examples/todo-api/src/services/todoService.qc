// todoService.qc - Couche de logique métier
Prend Todo De "../models/todo.qc"
Prend TodoRepository De "../repositories/todoRepository.qc"
Prend uuid De "uuid"
Rends TodoService DispoPartout

Patente Publique TodoService
    Faik'repository C't'un TodoRepository

    // Constructeur
    Faik'init C't'une Fonction
    Piafait
        Crée TodoRepository PisSacreLéDans repository

    // Récupérer tous les todos
    Faik'getTousTodos C't'une Fonction Qyartourne un TabloD'Todo
    Piafait
        Artourne Call getTous Su repository

    // Récupérer un todo par ID
    Faik'getTodoParId C't'une Fonction Qyartourne un Todo
        Fotuïpawce id, C't'un Tex,
    Piafait
        Artourne Call getParId Su repository PisPawceZy id

    // Créer un nouveau todo
    Faik'creerTodo C't'une Fonction Qyartourne un Todo
        Fotuïpawce titre, C't'un Tex,
        Fotuïpawce description, C't'un Tex,
    Piafait
        Crée Todo PisSacreLéDans nouveauTodo
        nouveauTodo.id = Call v4 Su uuid
        nouveauTodo.titre = titre
        nouveauTodo.description = description
        nouveauTodo.complete = tétumalade
        Crée Date PisSacreLéDans maintenant
        nouveauTodo.dateCreation = maintenant
        
        Artourne Call creer Su repository PisPawceZy nouveauTodo

    // Mettre à jour un todo
    Faik'mettreAJourTodo C't'une Fonction Qyartourne un Todo
        Fotuïpawce id, C't'un Tex,
        Fotuïpawce donnees, C't'un Objet,
    Piafait
        // Vérifier que le todo existe
        Faik'todoExistant C't'un Todo = Call getParId Su repository PisPawceZy id
        Si todoExistant == ardjien
            Artourne ardjien
        
        Artourne Call mettreAJour Su repository PisPawceZy id, donnees

    // Marquer un todo comme complété
    Faik'marquerComplete C't'une Fonction Qyartourne un Todo
        Fotuïpawce id, C't'un Tex,
    Piafait
        Faik'donnees C't'un Objet = { complete: ouin }
        Artourne Call mettreAJour Su repository PisPawceZy id, donnees

    // Supprimer un todo
    Faik'supprimerTodo C't'une Fonction Qyartourne une Boule
        Fotuïpawce id, C't'un Tex,
    Piafait
        Artourne Call supprimer Su repository PisPawceZy id
