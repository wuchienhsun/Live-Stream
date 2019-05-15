import React, { Component } from 'react'
import { connect } from 'react-redux';
import { streamRoom, clearSream } from '../actions/streamActions';
import PropTypes from 'prop-types';
import Loading from './common/Loading';
import flvjs from 'flv.js';
import Chat from './Chat';
import '../css/video.css'

class Stream extends Component {
  constructor() {
    super();
    this.state = {
      errors: {}
    }
  }
  componentDidMount() {   
    this.props.streamRoom({user_name:this.props.match.params.user_name})
  }
  componentDidUpdate(){
    let videoElement = this.refs.vid;
    if(videoElement){
      if(flvjs.isSupported()){
             let flvPlayer = flvjs.createPlayer({
                 type: 'flv',
                 url: 'https://www.wuhsun.com:8443/live/'+this.props.stream.streamKey+'.flv'
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

  componentWillUnmount(){    
    this.props.clearSream();
  }
  render() {
    const { streamKey, loading, streamName, streamCate, streamDetail } = this.props.stream;
    if(streamKey === null || loading) {
      return (
        <>
        <h3>Stream Loading....</h3>
        <Loading />
        </>
        )
    } else {
      return (        
        <div id='row'>
          <div id="streamVideo">       
            <div>
              <script src="flv.min.js"></script>
              <video src="vid" width="100%" controls></video>
              <h2>實況名稱： {streamName} &nbsp;&nbsp;&nbsp;&nbsp; 主題： {streamCate}</h2>
              <h5>實況簡介： {streamDetail}</h5>
            </div>
          </div>
          <div id="chat">
            <Chat />
          </div>
        </div>
      )
    }
    
  }
}

Stream.propTypes = {
  streamRoom: PropTypes.func.isRequired,
  clearSream: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors,
  stream: state.stream,
  coin: state.coin
})



export default connect(mapStateToProps,{ streamRoom,clearSream })(Stream);
