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
- ORM (booksshelf.js)):
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
    - Tokens(JWT):
        - Access-token
        - Refresh-token(todo)
        - Token encryption(AES-256-CTR)
- Security:
    - Roles
    - Check permissions(create, read, update, delete) middleware
- Error handling

## Implemented (Client, AngularJS)
- Base ... wip
