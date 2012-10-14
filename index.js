var helpers = require('./helpers');
const FAIL_RESULT = 'FAILURE';
const SUCCESS_RESULT = 'SUCCESS';

/**
 * Created with JetBrains WebStorm.
 * User: Daniboy
 * Date: 8/28/12
 * Time: 9:11 AM
 * To change this template use File | Settings | File Templates.
 */

function beforeCallback(err, result, callback) {

    if (!result) return callback(err);

    //make any result be array even if there is only one object.
    if (!result.length) {
        result = [result];
    }

    if (result && result.length) {

        //in case of array result
        //do not show _id but use more readable name - id
        for (var i = 0; i < result.length; i++) {
            var row = result[i];

            if (row && row['_id']) {
                row.id = row._id;
                delete row._id;
            }
        }
    }

    callback(err, result);
}

function Entity(collectionName) {
    this.collectionName = collectionName;

    this.preapareOperation = function (req, res, opts, callback) {
        if (!opts) //nothing to do...
            return true;

        var validateResult = {err:"SUCCESS"};

        if (opts.query.$id) {
            //resolve id to objectid
            var id = opts.query.$id;
            delete opts.query.$id;

            opts.query._id = req.mongoRef.ObjectID.createFromHexString(id);
        }

        for (qfield in opts.query) {
            //TODO: make recursive
            if (opts.query[qfield].$id) {
                opts.query[qfield] = req.mongoRef.ObjectID.createFromHexString(opts.query[qfield].$id);
            }
        }

        if (opts.requiredFields && !req.validateHelper.validateObject(req, opts.query, validateResult, opts.requiredFields)) {
            callback(validateResult.err);
            return false;
        }

        if (!opts.options) {
            opts.options = {};
        }

        return true;
    };
}

/**
 * creates an entities
 * @param {Object} req express request
 * @param {Object} res express request
 * @param {Object} [opts] options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback] callback function
 */
Entity.prototype.createEntities = function (req, res, opts, callback) {
    if ('function' === typeof opts) callback = opts, opts = undefined;

    if (!opts.options) {
        opts.options = { safe:true };
    }
    else {
        opts.options.safe = true;
    }

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).insert(opts.query, opts.options, function (err, rows) {
        beforeCallback(err, rows, callback);
    });
}

/**
 * find entities
 * @param {Object} req
 * @param {Object} res
 * @param {Object} [opts] opts options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback]
 */
Entity.prototype.findEntities = function (req, res, opts, callback) {
    if ('function' === typeof opts) callback = opts, opts = undefined;

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).findItems(opts.query, opts.options, function (err, rows) {
        beforeCallback(err, rows, callback);
    });
}

/**
 * get object id
 * @param {Object} req
 * @param {Object} res
 * @param {Object} [opts] opts options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback]
 */
Entity.prototype.getObjIdOfEntity = function (req, res, opts, callback) {
    if ('function' === typeof opts) callback = opts, opts = undefined;

    opts.options = {_id:1};

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).findOne(opts.query, opts.options, function (err, entity) {
        if (err) return callback(err);

        if (!entity) return callback(req.errorHelper.entityNotFound);

        callback(undefined, entity._id);
    });
}

/**
 * count entities
 * @param {Object} req
 * @param {Object} res
 * @param {Object} [opts] opts options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback]
 */
Entity.prototype.countEntities = function (req, res, opts, callback) {
    if ('function' === typeof opts) callback = opts, opts = undefined;

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).count(opts.query, callback);
}

/**
 * updates an entity
 * @param {Object} req express request
 * @param {Object} res express request
 * @param {Object} [opts] options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback] callback function
 *
 * options:
 * remove : set to a true to remove the object before returning
 * new    : set to true if you want to return the modified object rather than the original. Ignored for remove.
 * upsert : true/false (perform upsert operation)
 **/
Entity.prototype.updateEntity = function (req, res, opts, callback) {
    if ('function' === typeof opts) callback = opts, opts = undefined;

    if (!opts.sort) {
        opts.sort = [];
    }

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).findAndModify(opts.query, opts.sort, opts.update, opts.options, function (err, rows) {
        beforeCallback(err, rows, callback);
    });
}

/**
 * deletes an entity
 * @param {Object} req express request
 * @param {Object} res express request
 * @param {Object} [opts] options - a custom 'query', a custom 'options' and 'requiredFields'
 * @param {Function} [callback] callback function
 *
 **/
Entity.prototype.removeEntity = function (req, res, opts, callback) {

    //TODO: look at $atomic

    if ('function' === typeof opts) callback = opts, opts = undefined;

    if (!opts.options) {
        opts.options = { safe:true };
    }
    else {
        opts.options.safe = true;
    }

    if (!this.preapareOperation(req, res, opts, callback))
        return;

    req.mongoRef.collection(this.collectionName).remove(opts.query, opts.options, function (err, success) {
        if (err) return callback(err);

        if (!success) return callback(req.errorHelper.entityNotFound);

        callback(undefined, []);
    });
}

exports.Entity = Entity;
exports.addLocals = function (req, res, next) {
    res.locals.errors = {};
    req.errorHelper = helpers.errorHelper;
    req.validateHelper = helpers.validateHelper;

    res.jsonWithOptions = function (err, result) {
        if (err) {
            return res.send(500, {error:helpers.errorHelper.getUserMessage(err), result: FAIL_RESULT});
        }

        res.json({ result: SUCCESS_RESULT, data: result });
    }

    next();
};