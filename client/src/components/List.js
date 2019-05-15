import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCurrentStream } from '../actions/streamActions';
import Loading from './common/Loading';
import { Card,CardTitle, CardText, } from 'reactstrap';
import '../css/list.css'


class List extends Component {
  constructor(){
    super(); 
    this.state = {            
      errors: {msg: null}
    }    
  }
componentDidMount(){
  this.props.setCurrentStream();
}
componentWillReceiveProps(nextProps) {  
  if(nextProps.errors) {
    this.setState({errors: nextProps.errors});
  }
}
  render() {
    const { loading, playlist } = this.props.stream;    
    if(playlist === null || loading){
      return (
        <><h3>資料準備中....</h3><Loading /></>
      )
    } else {
      return (
        <div className="list">
          <div className="container">
            <div className="row">
                <div className="col-md-12">
                {playlist.length === 0 ?
                    <h4>目前沒有直播唷</h4> : 
                      playlist.map((play, key) =>
                        (
                          <Card className="mb-3" body inverse style={{ backgroundColor: '#333', borderColor: '#333' }} key={key}>
                            <div className="row mb-3">
                              <div className="col-md-3 ">                
                                <img id='stream_img' src={play.stream_img} alt='stream img' />
                              </div>
                              <div className="col-md-9">                
                              <CardTitle id="stream_name" className="border-bottom border-light pd-3"><strong>{play.stream_name}</strong></CardTitle>
                              <span id='span_name'>{play.stream_room}</span>
                              <CardText className='mb-3'>{play.stream_detail}</CardText>
                              </div>              
                            </div>                          
                            <Link id='link' className='btn'  to={"a."+play.stream_room}>直播間</Link>
                          </Card>
                        )
                      )
                     }
                  
                </div>            
            </div>
          </div>
        </div>
      )
    }    
  }
}

List.propTypes = {
  auth: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setCurrentStream: PropTypes.func.isRequired  
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors,
  stream: state.stream,
  coin: state.coin
})

export default connect(mapStateToProps, { setCurrentStream })(List);
