import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStreamData, setStreamData, getStreamCateList, clearState } from '../../actions/streamActions';
import classnames from 'classnames';
import Loading from '../common/Loading';
import Upload from '../change/StreamImg';



 class Dashboard extends Component {
   constructor() {
     super();
     this.state = {
       value: '顯示金鑰',
       type: 'password',
       stream_name: '',
       stream_cate: '',
       stream_detail: '',
       streamCateList: null,
       updated: false,
       errors: {msg:''}
     }
     this.onClick = this.onClick.bind(this);
     this.onChange = this.onChange.bind(this);
     this.onSubmit = this.onSubmit.bind(this);
     this.onListChange = this.onListChange.bind(this);
   }
   componentDidMount() {
     this.props.getStreamCateList();
     if(this.props.auth.user.id) {
      this.props.getStreamData(this.props.auth.user.id);
    }
    this.setState({stream_name: this.props.streamName})
    this.setState({stream_cate: this.props.streamCate})
   }
   componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors: nextProps.errors});
    }
    if(nextProps.stream.streamCate) {
      this.setState({stream_cate: nextProps.stream.streamCate});
    }
    if(nextProps.stream.streamName) {
      this.setState({stream_name: nextProps.stream.streamName});
    }
    if(nextProps.stream.streamDetail) {
      this.setState({stream_detail: nextProps.stream.streamDetail});
    }
    if(nextProps.stream.updated){
      this.setState({updated: nextProps.stream.updated})
    }
    if(nextProps.stream.streamCateList){
      this.setState({streamCateList: nextProps.stream.streamCateList});
    }
   }
   componentWillUnmount(){
     this.setState({updated: false})
    this.props.clearState();
  }

   onChange(e) {
    this.setState({[e.target.name]: e.target.value})
   }
   onListChange(e) {
    this.setState({stream_cate: e.target.value})
   }   
   onClick(e) {
     if(this.state.type === 'password'){
       this.setState({
         type: 'text',
         value: '隱藏'
       })
     } else {
       this.setState({
         type: 'password',
         value: '顯示金鑰'
       })
     }
   }

   onSubmit(e) {
    e.preventDefault();
    const data = {
      stream_name: this.state.stream_name,
      stream_cate: this.state.stream_cate,
      stream_detail: this.state.stream_detail
    }    
    this.props.setStreamData(data);
   }

  render() {
    const { updated, stream_cate } = this.state;
    const { streamCateList, loading } = this.props.stream;
    const { msg } = this.state.errors;

    let userstreamdata;
    if(streamCateList === null || loading) {
      userstreamdata = (
          <>
            <h3>資料準備中....</h3>
            <Loading />
          </>
        )
      } else {
        let items = []
        items = streamCateList.map((list, key) => {
          return (
            <option key={list.id} value={list.id}>{list.name}</option>
          )
        })
        userstreamdata = (
          <>
          <label>實況種類</label>
          <select className="browser-default custom-select custom-select-lg mb-3" value={stream_cate} onChange={this.onListChange} >
            {items}
          </select>
          <label>實況簡介</label>
          <textarea type='textarea' name='stream_detail' placeholder='實況介紹' className='form-control form-control-lg' value={this.state.stream_detail} onChange={this.onChange} />
          </>
        )

      }
    let msgs;
    if(updated === true){
      msgs = (
        <div className="alert alert-success msg mt-3" role="alert">
         實況名稱更新成功
        </div>
      )
      setTimeout(() => {
        this.setState({updated: false})
      },3000)
    } else {
      msgs = (null);
    }


    return (

      <>
        
      <h1 className="display-4 text-center">實況資訊</h1>
      <p className="lead text-center">你的實況金鑰</p>
      <p className="lead text-center">請推流至rtmp://www.wuhsun.com:1935/live</p>
      <div className="form-group">
        <input type={this.state.type} name="stream_name" id="streamKey"  className="form-control form-control-lg" value={this.props.auth.user.streamKey}  readOnly/>
      </div>
      <input type="button" onClick={this.onClick} id="streamBtn" value={this.state.value} className="btn btn-danger btn-block mt-4" />
      {msgs}
      <p className="lead text-center mt-4">輸入你的實況資料</p>
      <form noValidate onSubmit={this.onSubmit}>
      <label>實況名稱</label>
      <div className="form-group">
        <input type="text" className={classnames('form-control form-control-lg', {'is-invalid': msg.stream_name})}
                placeholder="實況名稱"
                name='stream_name'
                value={this.state.stream_name}
                onChange={this.onChange} />
        {msg.stream_name && (<div className="invalid-feedback">{msg.stream_name}</div>)}
      </div>
      <div className="form-group">
      {userstreamdata}
      </div>
      
        <input
        type="submit"
        id="streamDataBtn"
        value="更新"
        className={'btn btn-dark btn-block mt-4'}
        onSubmit={this.onSubmit} />
      </form>
      <Upload />
      </>
    )
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  setStreamData: PropTypes.func.isRequired,
  getStreamData: PropTypes.func.isRequired,
  getStreamCateList: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors,
  stream: state.stream,
})


export default connect(mapStateToProps, { getStreamData, setStreamData, getStreamCateList,clearState })(Dashboard);
