import React, { Component } from 'react'
import { getUserDonateDetails } from '../actions/authActions';
import Loading from './common/Loading';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

 class DonateList extends Component {
  componentDidMount(){
    this.props.getUserDonateDetails();
  }
  render() {
    const { donateList, loading } = this.props.auth;
    if(donateList === null || loading ){
      return (
        <div className='container'>            
            <Loading />
            <h5 id='loading'>資料準備中...</h5>
        </div>
      )  
    } else {
      return (
        <div>
          <>
          <h1>Donate Details</h1>
          <Table dark>
        <thead>
          <tr>
            <th>#</th>
            <th>Donate to</th>
            <th>Dollar</th>
          </tr>
        </thead>
        <tbody>                                        
          {          
            donateList.map((detail, key) =>            
                <tr key={key}>
                <th scope="row" key={detail.id}>{detail.id}</th>
                <td >{detail.host}</td>
                <td >{detail.coin}</td>                
             </tr>
            )
          }
        </tbody>
      </Table>
          </>
        </div>
      )
    }  
  }
}
DonateList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getUserDonateDetails: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})



export default connect(mapStateToProps, {getUserDonateDetails})(DonateList);