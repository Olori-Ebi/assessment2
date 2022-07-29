const Validator = require('./validation')

exports.validateSignup = (req, res, next) => {
    const validated = Validator.createUser(req.body);
    if (validated.error) {
      return handleValidationError(validated.error, res);
    }
    return next();
  };
  
exports.validateSignin = (req, res, next) => {
    const validated = Validator.signIn(req.body);
    if (validated.error) {
      return handleValidationError(validated.error, res);
    }
    return next();
  };
  
exports.validateProduct = (req, res, next) => {
    const validated = Validator.createProduct(req.body);
    if (validated.error) {
      return handleValidationError(validated.error, res);
    }
    return next();
  };
  
  const handleValidationError = (validationError, res) => {
      const message = validationError.details[0].message;
      return res.status(400).json({message})
  };
  