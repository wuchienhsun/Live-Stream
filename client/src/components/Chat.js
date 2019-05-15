import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setCurrentUser } from '../actions/streamActions';
import { donateCoin,currnetCoin,changeDonateProps } from '../actions/coinActions';
import classnames from 'classnames';



import '../css/chat.css';
import { Button,
  Card,
  CardTitle, 
    CardText,
   Modal,
   ModalHeader, 
   ModalBody, 
   ModalFooter,
   Form,
   FormGroup,
   Label,
   Input   
  } from 'reactstrap';


  let socket;
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      donate: false,
      modal: false,
      amount: '',
      errors: {msg: ''}
    }
    this.onChange = this.onChange.bind(this)
    this.toggle = this.toggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      errors: {msg:''}
    });
  };
  onChange(e) {
    this.setState({[e.target.name]: e.target.value})    
  }
  onSubmit(e){
    e.preventDefault();
    const donate_data = {
      amount: this.state.amount,
      host: this.props.stream.streamId
    }    
    console.log(donate_data);
    this.props.donateCoin(donate_data);
    this.setState({amount:''})
  }


  onClick(e){
    e.preventDefault();
    let message = document.getElementById('message').value
    socket.emit('msg', {
      message,
      user: this.props.auth.user.name,
      sender: socket.id
    })
    document.getElementById('message').value = '';
  }
  componentDidMount(){
    if(this.props.auth.isAuthenticated){
      this.props.currnetCoin(this.props.auth.user.id);
    }
      // socket = require('socket.io-client')('http://localhost:5000/');
      socket = require('socket.io-client')('https://www.wuhsun.com/');
      //   'transports': ['websocket']
      // });

      let url = window.location.href      
      // let roomID = url.replace("http://localhost:3000/a.", "")
    let roomID = url.replace("https://www.wuhsun.com/a.", "")
    // setInterval(()=>{
    //   socket.emit('updateAmount',window.location.href)
    // },10000)
        
    // socket.on('event',data => {      
    //     socket.emit('addRoom', data)
    // })
    socket.emit('addRoom', roomID)
    socket.on('addRoom', (data) => {
      console.log('addRoom',data);
    })
    socket.emit('updateAmount',window.location.href)
    socket.on('msg', (data) => {
      console.log('msg',data)        
      document.getElementById("output").innerHTML += '<p><strong>' + data.user + ': </strong>' + data.message + '<span class="show" id="read"></span></p>';      
    })
    socket.on('amount', (data) => {
      console.log('amount', data)
      this.props.setCurrentUser(data);
    })
    socket.on('donateMsg',(data) => {
      console.log('donateMsg', data);
      document.getElementById("output").innerHTML += '<p><strong>' + data.user + ': </strong>' +'打賞了'+ data.amount +'!!'+ '<span class="show" id="read"></span></p>';
    })
  }
  
  componentDidUpdate(){
    if(this.state.modal){
      if(this.state.donate === true){
        console.log('close the toggle')
        this.toggle();
        let data = {
          user: this.props.auth.user.name,
          amount: this.props.coin.donate_data.donate_user.coin
        }
        socket.emit('donateMsg', data)
        this.setState({donate: false})
        this.props.changeDonateProps();
        this.props.currnetCoin(this.props.auth.user.id);
      }
    }
    
  }

  componentWillReceiveProps(nextProps) {    
    if(nextProps.errors){
      this.setState({errors: nextProps.errors});
    }    
    if(nextProps.coin.donate) {
        this.setState({donate: true})
        console.log('send')
    }
      
  }
  componentWillUnmount(){
    console.log('componentWillUnmount','test');
    console.log('this.props.stream.streamHost',this.props.stream.streamHost)
    socket.off('amount');
    socket.off('msg');
    socket.off('donateMsg');    
    socket.off('addRoom');  
    socket.emit('updateAmount', this.props.stream.streamHost)    
    socket.emit('leave', this.props.stream.streamHost)  
  }
  
  render() {
    const { coin } = this.props.coin;
    const { msg } = this.state.errors;
    return (
      <>  
        <div id="mario-chat">
            <h5 id="title">聊天室</h5><span id="title-span">現在人數: {this.props.stream.current}</span>
            <div id="chat-window">
              <div id="output">                
              </div>
              <div id="feedback"></div>
            </div>
            <form autoComplete="off">
              <textarea id="message" type="text" placeholder="可以輸入訊息" />
              <Button className="btn-block" color="info" onClick={this.toggle}>donate</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>打賞！</ModalHeader>
          <ModalBody>          
            <Card body className="text-center mb-3">
        <CardTitle>你目前有{coin} 個Coin
        
        </CardTitle>

        <CardText>購買Coin 來打賞你喜歡的實況主！</CardText>
        </Card>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="item">打賞數量</Label>
                <Input 
                  type="text"
                  name="amount"
                  id="amount"
                  placeholder="數量"
                  className="mb-3"
                  className={classnames('mb-3 form-control form-control-lg', {
                    'is-invalid': msg.errors
                  })}
                  onChange={this.onChange}
                  value={this.state.amount}
                />  
                {msg.errors && (<div className="invalid-feedback">{msg.errors}</div>)}              
                <Button
                  color="dark"
                  style={{marginTop: '2rem'}}
                  block>
                  Donate</Button>
              </FormGroup> 
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
            </form>
              <button type="button" onClick={this.onClick.bind(this)} className="btn btn-block btn-dark">Send</button>                       
          </div>
      </>              
    )
  }
}

Chat.propTypes = {  
  changeDonateProps: PropTypes.func.isRequired,
  donateCoin: PropTypes.func.isRequired,
  currnetCoin:PropTypes.func.isRequired,
  setCurrentUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired,
  toggle:  PropTypes.func
};

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors,
  stream: state.stream,
  coin: state.coin
})

export default connect(mapStateToProps, { setCurrentUser, donateCoin, currnetCoin,changeDonateProps })(Chat);