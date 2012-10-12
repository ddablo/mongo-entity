/**
 * Created with JetBrains WebStorm.
 * User: Daniboy
 * Date: 8/28/12
 * Time: 9:21 AM
 * To change this template use File | Settings | File Templates.
 */

Object.prototype.getObjectByPath = function (path){
    var paths = path.split('.')
        , current = this
        , i;

    for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
            return undefined;
        } else {
            current = current[paths[i]];
        }
    }
    return current;
}

exports.validateObject = function (req, obj, validateResult, requiredProps) {
    if (requiredProps.length == 0)
        return true;

    if (!obj) {
        validateResult.err = req.errorHelper.noInput;
        return false;
    }

    for (var i = 0; i < requiredProps.length; i++) {

        var propPath = requiredProps[i];

        if (!obj.getObjectByPath(propPath)) {
            validateResult.err = req.errorHelper.invalidArguments;
            return false;
        }
    }

    return true;
}