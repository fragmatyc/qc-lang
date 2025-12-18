// todoRepository.qc - Couche d'accès aux données
Prend Todo De "../models/todo.qc"
Rends TodoRepository DispoPartout

Patente Publique TodoRepository
    // Base de données en mémoire (simulation)
    Faik'todos C't'un TabloD'Todo = []

    // Récupérer tous les todos
    Faik'getTous C't'une Fonction Qyartourne un TabloD'Todo
    Piafait
        Artourne todos

    // Récupérer un todo par son ID
    Faik'getParId C't'une Fonction Qyartourne un Todo
        Fotuïpawce id, C't'un Tex,
    Piafait
        Faik'resultat C't'un Todo = ardjien
        LoopSu'todos Dans todo Pifait
            Si todo.id == id
                resultat = todo
        Artourne resultat

    // Créer un nouveau todo
    Faik'creer C't'une Fonction Qyartourne un Todo
        Fotuïpawce nouveauTodo, C't'un Todo,
    Piafait
        Call push Su todos PisPawceZy nouveauTodo
        Artourne nouveauTodo

    // Mettre à jour un todo
    Faik'mettreAJour C't'une Fonction Qyartourne un Todo
        Fotuïpawce id, C't'un Tex,
        Fotuïpawce donnees, C't'un Objet,
    Piafait
        Faik'index C't'un Chif = -1
        Faik'compteur C't'un Chif = 0
        LoopSu'todos Dans todo Pifait
            Si todo.id == id
                index = compteur
            compteur++
        
        Si index == -1
            Artourne ardjien
        
        // Mettre à jour les propriétés
        Si donnees.titre != ardjien
            todos[index].titre = donnees.titre
        Si donnees.description != ardjien
            todos[index].description = donnees.description
        Si donnees.complete != ardjien
            todos[index].complete = donnees.complete
        
        Artourne todos[index]

    // Supprimer un todo
    Faik'supprimer C't'une Fonction Qyartourne une Boule
        Fotuïpawce id, C't'un Tex,
    Piafait
        Faik'indexASupprimer C't'un Chif = -1
        Faik'compteur C't'un Chif = 0
        LoopSu'todos Dans todo Pifait
            Si todo.id == id
                indexASupprimer = compteur
            compteur++
        
        Si indexASupprimer == -1
            Artourne tétumalade
        
        Call splice Su todos PisPawceZy indexASupprimer, 1
        Artourne ouin
