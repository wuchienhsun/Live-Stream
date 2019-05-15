import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { updateUserEmail } from '../../actions/authActions';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,    
  Form,
  Input
} from 'reactstrap';


class Email extends Component {
  constructor(){
    super();
    this.state = {
      email: '',
      modal : false,
      updated: false,
      errors:{msg:''}
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit(e){
    e.preventDefault();
    let data = {email: this.state.email};
    this.props.updateUserEmail(data);
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      errors:{msg:''},
      email: ''
    });
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors:nextProps.errors})
    }
    if(nextProps.auth.updated){
      this.setState({updated:nextProps.auth.updated})
    }
  }
  render() {
    const { msg } = this.state.errors
    const { updated } = this.state
    let msgs;
    if(updated === true){
      msgs = (
        <div className="alert alert-success msg" role="alert">
         信箱更新成功，五秒後將會登出，請重新登入
        </div>
      )      
    } else {
      msgs = (null);
    }
    return (
      <div>
        <Button className='btn btn-block mb-3' onClick={this.toggle}>修改會員信箱</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>修改會員信箱</ModalHeader>
          <ModalBody>            
            <Form onSubmit={this.onSubmit}>
            {msgs}
              <label>填入新的會員信箱</label>
              <Input 
              name='email' 
              onChange={this.onChange} 
              value={this.state.email}
              className={(classnames('',{
                'is-invalid' : msg.email
              }))}
               />
              {msg.email && (<div className='invalid-feedback'>{msg.email}</div>)}
              <Button type='submit' className='btn btn-block mt-3' >更新</Button>
            </Form>            
          </ModalBody>
        </Modal>
      </div>
    )
  }
}



Email.propTypes = {
  updateUserEmail: PropTypes.func.isRequired,  
  auth: PropTypes.object.isRequired,  
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors  
})



export default connect(mapStateToProps, { updateUserEmail })(Email);