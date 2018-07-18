import React, { Component } from 'react'

import App from "../App"

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'


export default class Profile extends Component {
    render() {
        return(
            <main className="container">
                <div className="pure-g">
                    <div className="pure-u-1-1">
                        <h2 id="user">{this.props.application.state.user}</h2>
                        <p>Address : {this.props.application.state.address} </p>
                        <p>Amount : {this.props.application.state.amount} Eth </p>
                        <br/>
                        <p>Name : {this.props.application.state.name}</p>
                        <p>Surname : {this.props.application.state.surname}</p>
                        <p>Second name : {this.props.application.state.scndname}</p>
                        <p>Email : {this.props.application.state.email}</p>
                    </div>
                </div>
            </main>
        );
    }
}