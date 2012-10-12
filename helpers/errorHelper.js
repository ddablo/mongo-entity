/**
 * Created with JetBrains WebStorm.
 * User: farin99
 * Date: 8/22/12
 * Time: 10:51 PM
 * To change this template use File | Settings | File Templates.
 */

const errorCodes = {
    getUserMessage: function(err){

        if(errorCodeMessages[err]){
           return errorCodeMessages[err];
        }
        else if(errorCodeMessages[err.code]){
            return errorCodeMessages[err.code];
        }
        else{
            console.log(err);
            return err;
        }
    }

  , generalError: "General error"
  , duplicateKey: 11000
  , invalidArguments: 66001
  , noInput: 66002
  , userNotExist: 66003
  , userNotLoggedIn: 66004
  , userAlreadyLoggedIn: 66005
  , incorrectUserType:66006
  , entityNotFound: 66007
};

const errorCodeMessages = {
    11000: "UNIQUE_KEY_VIOLATION"
  , 66001: "INVALID_ARGUMENTS"
  , 66002: "NO_INPUT_PROVIDED"
  , 66003: "USER_NOT_EXIST"
  , 66004: "USER_NOT_LOGGED_IN"
  , 66005: "USER_ALREADY_LOGGED_IN"
  , 66006: "INCORRECT_USER_TYPE"
  , 66007: "ENTITY_NOT_FOUND"
};

module.exports = errorCodes;
