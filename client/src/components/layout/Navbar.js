import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../actions/authActions';
import '../../css/nav.css'

class Navbar extends Component {
  state = {
    modal: false    
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }
  toggle = () => {    
    this.setState({
      modal: !this.state.modal
    });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    }

    //Attempt update
    this.props.login(user);
  };


  render() { 
    const { isAuthenticated, user, img } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          {/* <Link className="nav-link" to="/dashboard">dashboard</Link> */}
          <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <img id='user_img' alt='user img' src={img}></img> {user.name} !
        </a>
        <div id='dropdown' className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <Link className="dropdown-item" to={"a."+user.name}>Stream Room</Link>
          <Link className="dropdown-item" to="/dashboard">Stream Dashboard</Link>            
          <Link className="dropdown-item" to="/coindashboard">My Coins</Link>
          <Link className="dropdown-item" to="/donatelist">Donate History</Link>          
          <Link className="dropdown-item" to="/setting">Setting</Link>          
        </div>
        </li>
        <li className="nav-item">
          <a href="/" onClick={this.onLogoutClick.bind(this)} className="nav-link">Logout</a>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">Sign Up</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
      </ul>
    );

    return (
      <nav id="nav-fix" className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">Live Stream</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="mobile-nav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/list"> Live list
              </Link>
            </li>
          </ul>
        {isAuthenticated ? authLinks : guestLinks}          
        </div>
      </div>
    </nav>
    )
  }
}


Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  coin: state.coin
})


export default connect(mapStateToProps, { logoutUser })(Navbar);