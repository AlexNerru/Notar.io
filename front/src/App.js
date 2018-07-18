import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'

import AllDocuments from "./components/AllDocuments"
import Shell from "./components/Shell" 
import Profile from "./components/Profile"
import SignUp from "./components/SignUp"
import LogIn from "./components/LogIn"
import AddDocument from "./components/AddDocument"
import Search from "./components/Search"

import {Router, Route, browserHistory, IndexRoute} from "react-router";

import NotarHelpers from "../abi/NotarHelpers.json"

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

export default class App extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      address : "...",
      amount : "0",
      name : "...",
      surname : "...",
      scndname : "...",
      email : "...",
      password : "...",
      token : "...",
      
      storageValue: 0,
      
      currentPage : SignUp,
      authorized : false,

      web3: null,
      agreementFactoryAddress : "0x7d79811a6de6eed4e9d21034c3a93fbf6b611ffd",
      notarHelperAddress : "0x9aaf1f1cff945694865bf7b2d3a50df5f0f78cc2" 
    };  
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      this.getClientInfo();
    })
    .catch((e) => {
      console.log(e.toString());
    })
  }

  getClientInfo() {
    var el = this;
    this.setState({address : this.state.web3.eth.accounts[0]});
    this.state.web3.eth.getBalance(this.state.address, function(err, wei) {
      var eth = el.state.web3.fromWei(wei, 'ether');
      el.setState({amount : eth.toString()});
    });
    
    var notarHelper = this.state.web3.eth.contract(NotarHelpers["abi"]); 
    var notarHelperInstance = notarHelper.at(this.state.notarHelperAddress)
    
    notarHelperInstance.AmINotar(
      {
        from : this.state.address
      },
      (err, res) => {
        if (res) {
          el.setState({user : "Notary"});
        } else {
          el.setState({user : "Client"});
        }
    });
  }

  withProps(Component, props) {
    return function(matchProps) {
      return <Component {...props} {...matchProps}/>
    }
  }

  render() {
    const app = {application : this};
    return (
      <div>
        <Router history={browserHistory}>
          <Router path={"/"} component={this.withProps(Shell, app)}>
            <IndexRoute component={this.withProps(SignUp, app)}/> 

            <Route path={"signup"} component={this.withProps(SignUp, app)}/> 
            <Route path={"login"} component={this.withProps(LogIn, app)}/>             
            <Route path={"profile"} component={this.withProps(Profile, app)}/>
            <Route path={"add_document"} component={this.withProps(AddDocument, app)}/>
            <Route path={"documents"} component={this.withProps(AllDocuments, app)}/>
            <Route path={"search"} component={this.withProps(Search, app)}/>
          </Router>
        </Router>
      </div>
    );
  }
}