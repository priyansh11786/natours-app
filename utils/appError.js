//This class extends Error class hence on calling the super constructor with the message 
//that came from when instance of this class was created, we create the err object. 
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        //This line of code will keep this function call out of the call stack when instance of this Class is created.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;