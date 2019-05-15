import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { uploadVideo, uploadYtVideo } from '../../actions/videoActions'
import { Card, Input, Label } from 'reactstrap';
import '../../css/uploadVideo.css'

class UploadVideo extends Component {
  constructor(){
    super();
    this.state = {
      url: '',
      error: null,
      errors: {}
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handChange = this.handChange.bind(this)
  }
  onChange(e){
    let files = e.target.files
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);    
    reader.onload = (readerEvent) => {
      // this.setState({preImg: readerEvent.target.result})
    }
    let type= files[0].type
    if(type.indexOf('video') === -1){
      alert('file type errors, only access video type')
    } else {
      this.props.uploadVideo(files[0]);
    }    
  }
  handChange(e){
    this.setState({
      [e.target.name]:e.target.value,
      errors: {}
    })
  }
  onSubmit(e) {
    e.preventDefault()
    let url = this.state.url
    if(url.indexOf('https://www.youtube.com/') === -1 && url.indexOf('https://m.youtube.com/') === -1 && url.indexOf('https://youtu.be/') === -1){
      const data = {url:this.state.url}
      console.log(data);
      this.setState({errors:{msg: 'invalid URL'}})
    } else {
      const data = {url:this.state.url}
      console.log(data);
      this.props.uploadYtVideo(data)
      this.setState({
        url: '',
        errors: {}
      })
    }
  }
  render() {
  const { errors } =  this.state;
    return (
      <div className='mb-3'>
        <div className='container'>
          <Card body>          
          <div className='row'>
            <div className='col-2'>
            <form encType="multipart/form-data" onSubmit={this.onSubmit}>
              <Label type='button' id='label-upload' className='btn btn-block'  htmlFor='upload-img'>Upload</Label>
              <Input type='file' id='upload-img' onChange={(e) => this.onChange(e)} style={{ display: 'none'}} />
            </form>
            </div>
            <div className='col-10'>
            <form onSubmit={this.onSubmit}>             
              <input type="text"
              className={classnames('form-control form-control-lg', {
                'is-invalid': errors.msg
              })}
              placeholder="Input youtube URL to upload" name="url" value={this.state.url} onChange={this.handChange} />
              {errors.msg && (<div className="invalid-feedback">{errors.msg}</div>)}
            </form>
              
            </div>
          </div>
          </Card>
        </div>
      </div>
    )
  }
}
UploadVideo.propTypes = {
  uploadVideo: PropTypes.func.isRequired,
  uploadYtVideo: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.stream,
  errors: state.errors
})


export default connect(mapStateToProps, { uploadVideo, uploadYtVideo })(UploadVideo);
