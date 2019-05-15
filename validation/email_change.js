const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEmailChange(data){
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';


  if(Validator.isEmpty(data.email)){
    errors.email = 'Email field is required';
    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = '信箱格式錯誤';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}