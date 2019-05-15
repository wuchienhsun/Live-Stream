import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import VideoList from '../video/VideoList';
import { getAllUploadVideoList } from '../../actions/videoActions';
import {
  Card, CardBody,
  CardTitle, CardSubtitle,
  CardFooter
} from 'reactstrap';

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      errors: {}
    }
  }
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.getAllUploadVideoList();
    }
  }
  render() {
    let { isAuthenticated } = this.props.auth;
    let { allvideolist } = this.props.video;
    // const URL = 'http://localhost:3000/video/';
    const URL = 'https://www.wuhsun.com/video/';
    if (isAuthenticated) {
      return (
        <VideoList />
      )
    } else {
      return (
        <>
          <div className="landing">
            <div className="dark-overlay landing-inner text-light">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1 className="display-3 mb-4">Live Stream
                        </h1>
                    <p style={{ fontSize: '28px' }} className="lead">Put The YouTube URL And Download Videos From Youtube</p>
                    <img className='land-img' style={{ width: '108px' }} src={require('../../img/youtube-2.png')} alt='youtube-video-img'></img>
                    <p style={{ fontSize: '28px', marginTop: '10px' }} className="lead">Start Live Stream And Share To Other People</p>
                    <img className='land-img' style={{ width: '108px', marginLeft: '24px' }} src={require('../../img/video-camera.png')} alt='youtube-video-img'></img>
                    <hr />
                    <img className='land-img ml-1' style={{ width: '56px', marginRight: '9px' }} src={require('../../img/down-arrow.png')} alt='youtube-video-img'></img>
                    <hr />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="landing-2">
            <div className="dark-overlay landing-inner-2 text-light">
              <div className="container">
                <div className="row">
                  <div className="col-md-12 text-center">
                    <h1>Recently other user updated</h1>
                    {allvideolist.length === 0 ? null :
                      <div id='flex' className='row mt-3 mb-3' >
                        {
                          allvideolist.map((list, key) =>
                            <div id='flex-container' className='col-4 mb-3' key={key}>
                              <Card >
                                <CardBody>
                                  <video id='video' src={list.video_url}>
                                  </video>
                                  <CardTitle id='video_name' style={{ color: 'black' }}>{list.video_name}</CardTitle>
                                  <CardSubtitle id='video_path'>
                                    <Link target="_blank" rel="noopener noreferrer" to={'/video/' + list.video_path}>{list.user_id === 'loading' ? list.video_path : URL + list.video_path}</Link>
                                  </CardSubtitle>
                                </CardBody>
                                <CardFooter id='card-footer' className="text-muted">
                                  <div className='card-footer-div'>
                                  </div>
                                  <img id='footer-img' src={require('../../img/eye.png')} alt='eye icon'></img>
                                  <span>
                                    {list.views}
                                  </span>
                                </CardFooter>
                              </Card>
                            </div>
                          )
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  getAllUploadVideoList: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video
});

export default connect(mapStateToProps, { getAllUploadVideoList })(Landing);