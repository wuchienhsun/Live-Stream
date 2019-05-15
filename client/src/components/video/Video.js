import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { plusVideoViewsAmount } from '../../actions/videoActions';
import { Card, CardBody,  
  CardFooter, } from 'reactstrap';
  import '../../css/Videos.css'
import flvjs from 'flv.js';

class Video extends Component {
  constructor(){
    super();
    this.state = {    
      errors: {msg:''}
    }
    this.myVideo = React.createRef();
  }


  
  
  componentDidMount() {
    this.props.plusVideoViewsAmount({video_path:this.props.match.params.id});
    let videoElement = this.myVideo.current;    
    if(videoElement){
      if(flvjs.isSupported()){
            let flvPlayer = flvjs.createPlayer({
                type: 'mp4',
                // url: 'https://s3-ap-northeast-1.amazonaws.com/appworks-stylish-1/project_2/video/'+this.props.match.params.id+'.mp4'
                url: 'https://d6u0gq2utdlwf.cloudfront.net/project_2/video/'+this.props.match.params.id+'.mp4'

                
            });
          //   let flvPlayer = flvjs.createPlayer({
          //     type: 'flv',
          //     url: 'http://localhost:8000/live/'+this.props.stream.streamKey+'.flv'
          // });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play();
      }
    }
  }
render() {   
    const path = this.props.match.params.id     
    return (
      <>
      <script src="flv.min.js"></script>
      <div id='card-containe'>
      <Card>
        <CardBody className='cardbody'>
          <video ref={this.myVideo}  id="videoElement" width="100%" autoPlay controls></video>
        </CardBody>
        <CardFooter id='card-footer' className="text-muted">
              <div className='card-footer-div'>
                  
              </div>
              <img id='footer-img' src={require('../../img/eye.png')} alt='eye icon'></img>
            <span>
              {this.props.video.views[path]}
            </span>
        </CardFooter>
      </Card>
      </div>

      </>
    )
  }
}


Video.propTypes = {
  auth: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  plusVideoViewsAmount: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
  errors: state.errors
})

export default connect(mapStateToProps, {plusVideoViewsAmount})(Video)