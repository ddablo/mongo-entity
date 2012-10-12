mongo-entity
============

Mongo entity framework.

Usage
=====

**install**:

    npm install mongo-entity

**configure**:

in express app configuration add `addLocals` middleware and decorate middleware:

    app.use(middlewares.addLocals);
    app.use(function(req, res, next){
        req.mongoRef = mongoDB;
        //your decorator here...
        next();
    });

While `mongoDB` is your mongo-skin object.


