import React, { Component } from 'react'
import UploadVideo from './UploadVideo';
import Loading from '../common/Loading';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';



import { getUserVideoList, deleteUserVideo } from '../../actions/videoActions';
import { Card, CardBody,
  CardTitle, CardSubtitle,
  CardFooter} from 'reactstrap';
import '../../css/videolist.css'

class VideoList extends Component {
  constructor(){
    super();
    this.state = {
      userVideoListState: null,
      videoupload: false,
      Delete: false,
      errors: {msg:''}
    }
    this.onClick = this.onClick.bind(this)
  }
  componentDidMount(){
    this.props.getUserVideoList()        
  }
  componentWillReceiveProps(next){
    if(next.video.userVideoList){
      this.setState({userVideoListState: next.video.userVideoList})
    }
  }

  onClick(e){
    this.props.deleteUserVideo({video_path:e.target.name});
    this.setState({Delete: true});
    setTimeout(() => {
      this.setState({Delete: false});
    }, 3000);
  }

  render() {    
    const { getUserVideoLoding } = this.props.video;
    const { userVideoListState, Delete } = this.state;
    // const URL = 'http://localhost:3000/video/';    
    const URL = 'https://www.wuhsun.com/video/';  
    
    if(getUserVideoLoding || userVideoListState === null){
      return (
        <div className='container'>
            <UploadVideo />
            <h5 id='loading'>資料準備中...</h5>
            <Loading />
        </div>
      )                                 
    } else {
      return (
        <div className='container'>
          <UploadVideo />  
          {Delete ? (<div className="alert alert-danger msg" role="alert">
         刪除成功
        </div>) : null}
          {userVideoListState.length === 0 ? <h4>No Video Create</h4> :
              <div id='flex' className='row'>
            {
              userVideoListState.map((list, key) =>                         
              <div id='flex-container' className='col-4 mb-3' key={key}>
              <Card >              
              <CardBody>
                  <video id='video' src={list.video_url}>                    
                  </video>
                  {list.user_id==='loading' ? (<div>
                    <h5>資料上傳中...</h5>
                    <Loading />
                  </div>) : null}
                  
                <CardTitle id='video_name'>{list.video_name}</CardTitle>
                <CardSubtitle id='video_path'>
                  <Link target="_blank" rel="noopener noreferrer" to={'/video/'+list.video_path}>{list.user_id==='loading' ?list.video_path : URL+list.video_path}</Link>                  
                </CardSubtitle>
              </CardBody>
                  <CardFooter id='card-footer' className="text-muted">
                    <div className='card-footer-div'>
                    <div className="dropdown">
                        <a href="/" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img id='footer-div-img' src={require('../../img/settings.png')} alt='settings icon'></img>
                        </a>

                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">                          
                          <Link className="dropdown-item" to={'/edit/'+list.video_path}>Setting</Link>          
                          <a className="dropdown-item" name={list.video_path} data-toggle="modal" href="/" key={key} onClick={(list) => { this.onClick(list) }}>
                          Delete
                          </a>                          
                        </div>
                      </div>                                        
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

          <div>
            </div>
            </div>
            
          }
          </div>
      )
    } 
  }
}
VideoList.propTypes = {
  auth: PropTypes.object.isRequired,
  video: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUserVideoList: PropTypes.func.isRequired,
  deleteUserVideo: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  video: state.video,
  errors: state.errors
})

export default connect(mapStateToProps, {getUserVideoList, deleteUserVideo})(VideoList)
