const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = validateStreamInput = (data) => {
  let errors = {}

  data.stream_name = !isEmpty(data.stream_name) ? data.stream_name : '';

  if(Validator.isEmpty(data.stream_name)) {
    errors.stream_name = "請填入實況名稱！"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}