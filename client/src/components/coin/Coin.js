import React, { Component } from 'react'
import { connect } from 'react-redux';
import { buyCoin,currnetCoin } from '../../actions/coinActions';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,  
  Card, 
  CardTitle, 
  CardText,
  NavLink
} from 'reactstrap';

class Coin extends Component {
  constructor(){
    super();
    this.state = {
      pay:false,
      modal: false
    }
    this.onClicka = this.onClicka.bind(this)
    this.onClickb = this.onClickb.bind(this)
    this.onClickc = this.onClickc.bind(this)
  }
  componentWillMount(){
    if(this.props.auth.isAuthenticated){
      this.props.currnetCoin(this.props.auth.user.id);
    }
  }
  componentDidUpdate(){
    if (this.state.modal) {
      if(this.state.pay) {
        this.toggle();
      }
    }
    if(!this.props.coin.new){
      this.props.currnetCoin();
    }
  }


  toggle = () => {    
    this.setState({
      modal: !this.state.modal
    });
  };
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  
  onClicka(e) {
    e.preventDefault();
    this.props.buyCoin('a');
  }
  onClickb(e) {
    e.preventDefault();
    this.props.buyCoin('b');
  }
  onClickc(e) {
    e.preventDefault();
    this.props.buyCoin('c');
  }
  render() {
    const { coin } = this.props.coin
    return (
      <div>

      
      <NavLink onClick={this.toggle} href="#">
      Buy Some Coins ?
    </NavLink>

    <Modal
      isOpen={this.state.modal}
      toggle={this.toggle}
    >    
      <ModalHeader toggle={this.toggle}>Buy some Coins ?</ModalHeader>
      <ModalBody>
      <Card body className="text-center mb-3">
        <CardTitle>你目前有{ coin } 個Coin
        
        </CardTitle>

        <CardText>購買Coin 來打賞你喜歡的實況主！</CardText>        
      </Card>
      <Card body className="text-center mb-3">
        <CardTitle>100 Coins</CardTitle>
        <CardText>購買100個Coins </CardText>                
        <Button onClick={this.onClicka}>$50.00</Button>
      </Card>
      <Card body className="text-center mb-3">
        <CardTitle>500 Coins</CardTitle>
        <CardText>購買500個Coins</CardText>
        <Button onClick={this.onClickb}>$250.00</Button>
      </Card>
      <Card body className="text-center mb-3">
      
        <CardTitle>1000</CardTitle>
        <CardText>購買1000個Coins</CardText>
        <Button onClick={this.onClickc}>$500.00</Button>
      </Card>      
      </ModalBody>
    </Modal>
  </div>
      
    )
  }
}

Coin.propTypes = {
  buyCoin: PropTypes.func.isRequired,
  currnetCoin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  coin: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  coin: state.coin
})


export default connect(mapStateToProps, { buyCoin, currnetCoin })(Coin);