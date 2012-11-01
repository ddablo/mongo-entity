/**
 * Created with JetBrains WebStorm.
 * User: farin99
 * Date: 8/22/12
 * Time: 10:51 PM
 * To change this template use File | Settings | File Templates.
 */

var error_code_messages = {
};

var error_codes = {
    registerError:function (errors) {
        for (var i = 0; i < errors.length; i++) {
            var err = errors[i];
            error_code_messages[err.err_code.toString()] = err.err_full_msg;
            error_codes[err.err_msg_key] = err.err_code;
        }

    }, getUserMessage:function (err) {

        if (error_code_messages[err]) {
            return error_code_messages[err];
        }
        else if (error_code_messages[err.code]) {
            return error_code_messages[err.code];
        }
        else {
            console.log(err);
            return err;
        }
    }, generalError:"General error"
};

module.exports = error_codes;
