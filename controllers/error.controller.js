const dotenv = require('dotenv'); 
const { AppError } = require('../utils/appError.util');

dotenv.config({path: './config.env'})

const sendErrorDev = (err, req, res) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		status: 'fail',
		message: err.message,
		error: err,
		stack: err.stack,
	});
}

const sendErrorProd = (err, req, res) => {
	const statusCode = err.statusCode || 500;

	res.status(statusCode).json({
		status: 'fail',
		message: err.message || 'Something went very wrong',
	});
}

const handlerUniqueEmailError = () => {
	return new AppError('The email has been taken')
}

const globalErrorHandler = (err, req, res, next) => {

	if(process.env.NODE_ENV === 'development'){
		sendErrorDev(err, req, res)
	}else if(process.env.NODE_ENV === 'production'){
		let error = {...err}
		error.message = err.message

		if(err.name = 'SequelizeUniqueConstraintError'){
			error = handlerUniqueEmailError
		}
		
		sendErrorProd(err, req, res)
	}
	
};

module.exports = { globalErrorHandler };
