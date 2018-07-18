import React, { Component } from 'react'
import "../css/block.css"
import "../css/header.css"

export default class Document extends Component {
    constructor(props) {
        super(props);
    }

    certify = () => {
        this.props.info.instance.Certify.sendTransaction(
            {
                gas : 300000,
                from : this.props.app.state.address
            },
            (err, res) => {
                if (!err) {
                    alert("Certified");
                } else {
                    alert("Error");
                }
            }
        );
    }

    deny = () => {
        this.props.info.instance.Deny.sendTransaction(
            {
                gas : 300000,
                from : this.props.app.state.address
            },
            (err, res) => {
                if (!err) {
                    alert("Denied");
                } else {
                    alert("Error");
                }
            }
        );
    }

    render() {
        return (
            <div className="card">
                <div className="header-small">
                    <p><b>{this.props.info.address}</b></p>
                </div>
                <div className="container">
                    <div><b>Notary : </b>{this.props.info.notar}</div>
                    <div><b>Data : </b>{this.props.info.data}</div>
                    <div><b>Client : </b>{this.props.info.client}</div>
                    <div><b>Benefitiars : </b>{this.props.info.benefitiars}</div>
                    <div><b>Status : </b>{this.props.info.status}</div>
                    <br/>
                    {(this.props.app.state.user == "Notary") 
                        && (this.props.info.notar == this.props.app.state.address)
                        && (this.props.info.status == "In progress") ? 
                        <div>
                            <button onClick={this.certify}>Certify</button>
                            <button onClick={this.deny} className="cancelbtn">Deny</button>
                        </div>  
                    : null}
                </div> 
            </div> 
        );
    }
}
