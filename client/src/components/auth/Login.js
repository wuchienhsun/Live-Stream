import React, { Component } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginUser } from '../../actions/authActions';
import  PropTypes from 'prop-types';

class Login extends Component {
  constructor() {
    super();
    this.state = {      
      email: '',
      password: '',      
      errors: {msg:''}
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if(this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }
    if(nextProps.errors){
      this.setState({errors: nextProps.errors});
    }
  }

  onChange(e) {
    this.setState({[e.target.name]: e.target.value})    
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {      
      email: this.state.email,
      password: this.state.password,      
    }
    this.props.loginUser(userData);
  }
  render() {
    const { msg } =  this.state.errors;
    return (
  <div className="login">
    <div className="container">
      <div className="row">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your account</p>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input type="email" 
              className={classnames('form-control form-control-lg', {
                'is-invalid': msg.email
              })}
              placeholder="Email Address" name="email" onChange={this.onChange} value={this.state.email} />
              {msg.email && (<div className="invalid-feedback">{msg.email}</div>)}
            </div>
            <div className="form-group">
              <input type="password" 
              className={classnames('form-control form-control-lg', {
                'is-invalid': msg.password
              })}
              placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
              {msg.password && (<div className="invalid-feedback">{msg.password}</div>)}
            </div>
            <input type="submit" className="btn btn-info btn-block mt-4" />
          </form>
        </div>
      </div>
    </div>
  </div>
    )
  }
}


Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors
})


export default connect(mapStateToProps, { loginUser })(withRouter(Login));
