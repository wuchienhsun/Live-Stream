import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { updateStreamImg } from '../../actions/streamActions';
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
      text: '當前照片',
      files: '',
      fileName: '',
      modal : false,
      preImg: null,
      streamUpdated: false,
      uploadImgLoading: false,
      errors:{msg:''}
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e){
    let files = e.target.files   
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (readerEvent) => {      
      this.setState({preImg: readerEvent.target.result})
    }        
    this.setState({fileName: files[0].name})
    this.setState({files: files[0]});
    this.setState({text: '你所選的照片'})
  }

  onSubmit(e){
    e.preventDefault();    
    this.setState({files:''})
    
    this.props.updateStreamImg(this.state.files);
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      errors:{msg:''},
      img: '',
      preImg: '',
      text: '當前照片'
    });
    this.setState({preImg: this.props.stream.streamImg})
    this.setState({uploadImgLoading: false})
  }


  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors:nextProps.errors})
    }
    if(nextProps.stream.streamUpdated){
      this.setState({streamUpdated:nextProps.stream.streamUpdated})
    }
    if(nextProps.stream.uploadImgLoading){
      this.setState({uploadImgLoading:!this.state.uploadImgLoading})
    }
    console.log(nextProps)
  }

  render() {
    const { msg } = this.state.errors
    const { streamUpdated,uploadImgLoading } = this.state
    let msgs;
    let load;

    if(streamUpdated === true){
      msgs = (
        <div className="alert alert-success msg" role="alert">
         照片更新成功！
        </div>
      )      
    } else {
      msgs = null;
    }

    if(uploadImgLoading === true && streamUpdated=== false){
      load = (
        <>
        <h5>資料上傳中...</h5>
      <Loading />
      </>
      )
    } else {
      load = null
    }

    return (
      <div>
        <Button className='btn btn-block mt-3' onClick={this.toggle}>修改實況顯示照片</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader>修改實況顯示照片</ModalHeader>
          <ModalBody>
          {load}
          {msgs}
            <h5>{this.state.text}</h5>
            <img src={this.state.preImg} alt='stream img' />
            <form encType="multipart/form-data" onSubmit={this.onSubmit}>            
            
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
  updateStreamImg: PropTypes.func.isRequired,  
  auth: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  stream: state.stream,
  errors: state.errors  
})



export default connect(mapStateToProps, { updateStreamImg })(Img);