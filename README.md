# Angular.js & Express.js base portal

## Usage
### API
- type 'node ./bin/www' or 'nodemon'

### Client
- gulp serve

## Implemented (API, ExpressJS)
- Routing
    - Base router
    - Routing of endpoints in own controllers
- ORM (booksshelf.js))
    - Database - PostgreSQL 
    - Models
    - Base parent model
    - CRUD
    - Model validation (joi.js)
    - Fields visibility in model
- Auth
    - Sign in\Sign out
    - Password hashing in DB (bcrypt.js)
    - Tokens(access-token, refresh-token, hJWT) ... wip

## Implemented (Client, AngularJS)
- Base ... wip

## TODO
- Validate each :id param from request with validateReq.id() middleware
