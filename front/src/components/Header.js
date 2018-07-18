import React, { Component } from 'react'
import {Link} from 'react-router'
import { browserHistory } from 'react-router';

import Search from "./Search"

import "../css/navbar.css"
import "../css/header.css"

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            choose : "Contract"
        };
    }
    
    componentDidMount() {
        this.setState({choose : "Contract"});
        this.setState({navbar : document.getElementById("navbar")});
        this.setState({sticky : document.getElementById("navbar").offsetTop});
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.pageYOffset >= this.state.sticky) {
            this.state.navbar.classList.add("sticky")
        } else {
            this.state.navbar.classList.remove("sticky");
        }
    };
    
    chooseClient = () => {
        var el = document.getElementById("choose");
        this.setState({choose : "Client"});
    }

    chooseContract = () => {
        var el = document.getElementById("choose");
        this.setState({choose : "Contract"});
    }

    chooseNotary = () => {
        var el = document.getElementById("choose");
        this.setState({choose : "Notary"});
    }

    find = () => {
        this.props.app.setState({
            typeSearch : this.state.choose,
            currentAddress : document.getElementById("addressInput").value
        });
        browserHistory.push("/search");
    }

    render() {
        return(
            <div>
                <div className="header">
                    <h1 className="headerText">Notar.IO</h1>
                </div>
                <ul id="navbar">
			
                    <li>{this.props.authorized ? <Link to={"/profile"}>Profile</Link> : <Link>Profile</Link>}</li>
                    <li>{this.props.authorized ? <Link to={"/add_document"}>Add Document</Link> : <Link>Add Document</Link>}</li>
                    <li>{this.props.authorized ? <Link to={"/documents"}>Documents</Link> : <Link>Documents</Link>}</li>
                    
                    <div className="search-container">
                        <input type="text" placeholder="Search.." id="addressInput"/>
                        <button onClick={this.find} className="button-submit">Search</button>
                    </div>  

                    <li className="dropdown">
                        <a id="choose" href="#" className="dropbtn">{this.state.choose}</a>
                        <div className="dropdown-content">
                            <a  href="#" onClick={this.chooseContract}>Contract</a>
                            <a  href="#" onClick={this.chooseClient}>Client</a>
                            <a  href="#" onClick={this.chooseNotary}>Notary</a>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}