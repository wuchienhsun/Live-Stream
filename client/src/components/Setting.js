import React, { Component } from 'react'
import Email from './change/Email';
import Img from './change/Img';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


class Setting extends Component {  
  render() {    
    return (
      <>
        <h1>修改個人資料</h1>
          <div className='row'>
            <div className='col-4'>
              <img src={this.props.auth.user.img} alt='user img'></img>
              <Img />
            </div>
            <div className='col-8'>
              <div className="card">
                <div className="card-body">
                  <div className='mb-3'>暱稱: {this.props.auth.user.name}</div>
                  <div>信箱: {this.props.auth.user.email}</div>
                </div>
              </div>
            <Email />
          </div>
        </div>        
      </>
    )
  }
}


Setting.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth  
})



export default connect(mapStateToProps)(Setting);
