# Angular.js & Express.js base portal

## Usage
### API
- type 'node ./bin/www' or 'nodemon'

### Client
- gulp serve

## Implemented (API, ExpressJS)
- Routing:
    - Base router
    - Routing of endpoints in own controllers
- ORM (objection.js):
    - Database - PostgreSQL 
    - Models
    - Base parent model
    - CRUD
    - Model validation (joi.js)
    - Fields visibility in model
- Auth:
    - Sign in
    - Sign out(todo)
    - Password hashing in DB (bcrypt.js)
    - Tokens(JWT, algorithm: 'HS512'):
        - Access-token
        - Refresh-token(todo)
        - Token encryption(AES-256-CTR)
- Security:
    - Roles
        - SU ['superuser']
        - ADMINROLES ['superuser', 'moderator']
        - EDITORROLES ['editor']
        - USER ['user'] default role on user creation
    - Logic roles:
        - Anonymous
        - IsAuth
        - Owner(checks in *checkToken* middleware and depends from ownership of checked model entity)
        - NotOwner === IsAuth and !Owner
    - Check permissions(create, read, update, delete) middleware
- Error handling

## Implemented (Client, AngularJS)
- Base ... wip

# Conventions:
- POST to create new resources
- POST to make custom VERBS
- PATCH to update resources
- GETbyId(), CREATE() - basic parent-model method
- GetById(), Create() - custom children-model method
- getById(), create() - controller methods

# Terminology:
- Model - row in DB table
- Entity - model + relations(folder in FS, related models)

# Permissions:
## TAG:
- Attach to items(ARTICLE, ALBUM): any user, must be ITEM OWNER or ADMINROLE
- Detach from items(ARTICLE, ALBUM): any user, must be ITEM OWNER or ADMINROLE
- Create: any member
- Remove: ADMINROLE
- Update: ADMINROLE