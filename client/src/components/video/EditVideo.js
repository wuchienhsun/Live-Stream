import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Progress } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import Loading from '../common/Loading';


import { editVideo } from '../../actions/videoActions';
import {
  Card, CardBody,
  CardFooter, Button
} from 'reactstrap';
import '../../css/Videos.css'
import flvjs from 'flv.js';

class EditVideo extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
      videoConditionText: 'Pause',
      pauseCondition: false,
      start: 0,
      end: 100,
      startpoint: 0,
      endpoint: 0,
      CurrentTime: 0,
      duration: 0,
      muted: true,
      mutedTrue: 'Sound on',
      mutedFalse: 'Sound off',
      errors: { msg: '' }
    }
    this.videoCondition = this.videoCondition.bind(this);
    this.progressUpdate = this.progressUpdate.bind(this)
    this.videochange = this.videochange.bind(this)
    this.videoEndchange = this.videoEndchange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onmouseUp = this.onmouseUp.bind(this)
  }
  componentDidMount() {
    let videoElement = this.refs.player;
    if (videoElement) {
      if (flvjs.isSupported()) {
        let flvPlayer = flvjs.createPlayer({
          type: 'mp4',
          url: 'https://d6u0gq2utdlwf.cloudfront.net/project_2/video/' + this.props.match.params.id + '.mp4'
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
  componentWillReceiveProps(next) {
    if (next.video.editVideoload === false) {
      this.props.history.push('/');
    }
  }
  onSubmit(e) {
    let video_path = this.props.match.params.id
    e.preventDefault()
    const { startpoint, endpoint, duration } = this.state
    if (startpoint === 0 && endpoint === duration) {
      this.props.history.push('/');
    } else {
      if (endpoint > startpoint) {
        const data = {
          start: startpoint,
          end: endpoint,
          video_path
        }
        console.log(data);
        this.props.editVideo(data, this.props.history)
      } else {
        const data = {
          start: endpoint,
          end: startpoint,
          video_path
        }
        console.log(data);
        this.props.editVideo(data, this.props.history)
      }
    }
  }
  sound() {
    let { muted } = this.state;
    if (muted === true) {
      this.setState({ muted: false })
    } else {
      this.setState({ muted: true })
    }
  }
  progressUpdate() {
    let video = this.refs.player
    if (Math.floor(video.currentTime / video.duration * 100) === Math.floor(this.state.end)) {
      video.pause();
    }
    this.setState(
      {
        duration: video.duration,
        value: (video.currentTime / video.duration * 100),
        CurrentTime: video.currentTime
      }
    );
  }
  // condition play or pause
  videoCondition() {
    let { player } = this.refs
    if (this.state.pauseCondition) {
      if (player.currentTime === player.duration) {
        player.currentTime = 0
        player.play();
      }
      player.play();
      this.setState(
        {
          videoConditionText: 'Pause',
          pauseCondition: false
        }
      )
    } else {
      player.pause();
      this.setState(
        {
          videoConditionText: 'Play',
          pauseCondition: true
        }
      )
    }
  }

  videochange() {
    let { player, customRange1 } = this.refs;
    let time = (customRange1.value / 100) * (player.duration);
    console.log(time);
    player.currentTime = time;
    this.setState(
      {
        CurrentTime: time,
        start: (time / player.duration * 100),
        startpoint: time
      });
  }

  onmouseUp() {
    let { startpoint } = this.state
    let { player } = this.refs
    player.currentTime = startpoint
    player.play();
  }

  videoEndchange() {
    let { player, customRange2 } = this.refs
    let time = (customRange2.value / 100) * (player.duration)
    player.currentTime = time
    this.setState(
      {
        currentTime: time,
        end: (time / player.duration * 100),
        endpoint: time
      }

    )
  }
  render() {
    let { pauseCondition, CurrentTime,
      muted, value, startpoint,
      start, end, mutedFalse,
      mutedTrue, videoConditionText,
      endpoint, duration } = this.state
    let { editVideoload } = this.props.video
    return (
      <>
        <script src="flv.min.js"></script>
        <div id='card-containe'>
          <Card>
            <CardBody className='cardbody'>
              <video ref='player' play={pauseCondition.toString()} id="videoElement" width="100%" onTimeUpdate={this.progressUpdate} muted={muted} autoPlay></video>
              <label>CurrentTime: {Math.floor(CurrentTime)}</label>
              <Progress className='mb-3' onChange={this.videochange} value={value} ></Progress>
              {editVideoload && <><h5>影片剪輯中...</h5><Loading /></>}
              <label htmlFor="customRange1">Start: {Math.floor(startpoint)}</label>
              <input type="range" ref='customRange1' className="custom-range" min="0" max="100" id="customRange1" onChange={this.videochange} value={start} />
              <label htmlFor="customRange1">End : {endpoint !== 0 ? Math.floor(endpoint) : Math.floor(duration)}</label>
              <input type="range" ref='customRange2' className="custom-range" min="0" max="100" id="customRange2" onChange={this.videoEndchange} onMouseUp={this.onmouseUp} value={end} />
            </CardBody>
            <CardFooter id='card-footer' className="text-muted">
              <Button className='mr-3' id='mutebtn' onClick={this.sound.bind(this)}>{muted ? mutedTrue : mutedFalse}</Button>
              <Button className='mr-3' onClick={this.videoCondition.bind(this)}>{videoConditionText}</Button>
            </CardFooter>
          </Card>
        </div>

        <form onSubmit={this.onSubmit}>
          {!editVideoload && <Button className='btn btn-block' type='submit'>Update</Button>}
        </form>
      </>
    )
  }
}

EditVideo.propTypes = {
  auth: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  editVideo: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
  errors: state.errors
})

export default connect(mapStateToProps, { editVideo })(withRouter(EditVideo));