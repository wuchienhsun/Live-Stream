import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { updateUserImg } from '../../actions/authActions';
import Loading from '../common/Loading';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input
} from 'reactstrap';


class Img extends Component {
  constructor(){
    super();
    this.state = {
      files: '',
      fileName: '',
      modal : false,
      preImg: null,
      updated: false,
      userImgLoading: false,
      errors:{msg:''}
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){    
    let files = e.target.files
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    console.log(files[0]);
    reader.onload = (readerEvent) => {
      this.setState({preImg: readerEvent.target.result})
    }
    this.setState({fileName: files[0].name})
    this.setState({files: files[0]});
  }

  onSubmit(e){
    e.preventDefault();    
    this.setState({files:''})
    this.props.updateUserImg(this.state.files);
  }
  toggle = () => {
    this.setState({
      updated: false,
      modal: !this.state.modal,
      errors:{msg:''},
      img: '',
      preImg: ''
    });
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors:nextProps.errors})
    }
    if(nextProps.auth.updated){
      this.setState({updated:nextProps.auth.updated})
    }
    if(nextProps.auth.userImgLoading){
      this.setState({userImgLoading: nextProps.auth.userImgLoading})
    }
  }

  render() {
    const { msg } = this.state.errors
    const { updated } = this.state
    const { userImgLoading } = this.props.auth
    let msgs;
    let load;


    if(userImgLoading === true){
      load = (<>
        <h5>資料上傳中...</h5>
        <Loading />
    </>)
  } else {
    load = (<> </>)
    if(updated === true){
      msgs = (
        <div className="alert alert-success msg" role="alert">
         照片更新成功！重新登入後即可顯示
        </div>
      )
    }
  }
    return (
      <div>
        <Button className='btn btn-block mb-3' onClick={this.toggle}>修改會員照片</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>修改會員照片</ModalHeader>
          <ModalBody>
            {msgs}
            {load}
            <img src={this.state.preImg} alt='user Img' />
            <form encType="multipart/form-data" onSubmit={this.onSubmit}>


              <label>新的會員照片</label>
              <Input
              type='file'
              name='file'
              onChange={(e) => this.onChange(e)}
              className={(classnames('',{
                'is-invalid' : msg.img
              }))}
               />
              {msg.img && (<div className='invalid-feedback'>{msg.img}</div>)}
              <Button type='submit' className='btn btn-block mt-3' >更新</Button>
            </form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}



Img.propTypes = {
  updateUserImg: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})



export default connect(mapStateToProps, { updateUserImg })(Img);
