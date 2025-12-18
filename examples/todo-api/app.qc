// app.qc - Configuration de l'application Todo API
Patente Publique TodoAPI
    Faik'Nom C't'un Tex = "TodoAPI"
    Faik'Version C't'un Tex = "1.0.0"
    Faik'Auteur C't'un Tex = "sylvain.cloutier@ezoqc.com"
    Faik'Description C't'un Tex = "Une API REST pour gérer des todos, écrite en QcLang"
    Faik'License C't'un Tex = "ISC"
    Faik'Entrée C't'un Tex = "src/index.qc"

    Faik'Dependances C't'un TabloD'Dependance
        BzoinD'express v4.18.2
        BzoinD'uuid v9.0.0
        BzoinD'lodash v4.17.21

    Faik'Scripts C't'un TabloD'Script
        Faik'Clean C't'une Fonction
        Piafait
            SupprimeDossier dist
