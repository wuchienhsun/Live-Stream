import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { getOrderDetail } from '../../actions/coinActions';
import Loading from '../common/Loading';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Coin from './Coin';


class CoinDashboard extends Component {
  constructor() {
    super();
    this.state = {
      errors: {msg: null}
    }
  }

  componentDidMount() {
    this.props.getOrderDetail({user_name:this.props.match.params.user_name})
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({errors: nextProps.errors})
    }
  }
  render() {
    const { details, loading } = this.props.coin
    return (
      <div>
        <button style={{border: "1px #007BFF solid",backgroundColor: '#B2BAC4'}} className='btn btn-block'>
          <Coin>Buy Some Coins ?</Coin>
        </button>        
        <h1>我的點數：{this.props.coin.coin}</h1>      
      {loading && <>
        <h3>購買資料準備中....</h3>
        <Loading />
        </>}
        {details.data === '沒有購點資料' ? <>           
         <h4>沒有購點資料</h4>
         </>: <>
        <h1>購點資料</h1>
        <Table dark>
      <thead>
        <tr>
          <th>#</th>
          <th>商品名稱</th>
          <th>金額</th>
          <th>購買點數</th>
          <th>付款狀態</th>
        </tr>
      </thead>
      <tbody>                                        
        {
          details.map((detail, key) =>
              <tr key={key}>
              <th scope="row" key={detail.id}>{detail.id}</th>
              <td >{detail.productName}</td>
              <td >{detail.amount}</td>
              <td >{detail.coin}</td>
              <td >{detail.pay_succ ? '成功' : '失敗'}</td>
           </tr>
          )
        }
      </tbody>
    </Table>
        </>}
    </div>
    )
  }
}

CoinDashboard.propTypes = {
  getOrderDetail: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  stream: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth:state.auth,
  errors: state.errors,
  stream: state.stream,
  coin: state.coin
})


export default connect(mapStateToProps, { getOrderDetail })(CoinDashboard);