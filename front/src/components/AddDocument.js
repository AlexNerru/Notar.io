import React, { Component } from 'react'

import "../css/adddoc.css";

import CryptoJS from "crypto-js";

import AgreementFactory from "../../abi/AgreementFactory.json"

const loadFileApi = "http://18.216.253.250:5000/api/v0.1/files/";
    
import sha256 from 'crypto-js/sha256';

export default class AddDocument extends Component {

    constructor(props) {
        super(props);
        const contract = props.application.state.web3.eth.contract(AgreementFactory["abi"]);
        this.state = {    
            contractInstance : contract.at(props.application.state.agreementFactoryAddress)
        };
        
    }

    componentDidMount() {
        var fileInput  = document.getElementById( "my-file" );
        var the_return = document.getElementById("file-return");
        var button = document.getElementById("label");
        button.addEventListener( "keydown", function( event ) {  
            if ( event.keyCode == 13 || event.keyCode == 32 ) {  
                fileInput.focus();  
            }  
        });
        button.addEventListener( "click", function( event ) {
           fileInput.focus();
           return false;
        });  
        fileInput.addEventListener( "change", function( event ) {  
            the_return.innerHTML = this.value;  
        });
    }

    whenTransactionMined = (tx, callback) => {
        var check = setInterval(
            () => {
                this.props.application.state.web3.eth.getTransaction(tx, (err, res) => {
                    if (res.blockHash != 0)
                    {
                        clearInterval(check);
                        callback();
                    }
                })
            },
            2000
        );
    };

    loadFile = () => {
        var loader = document.getElementById("my-file");
        var benefitiars = document.getElementById("benefitiars");
        var buf = this;
      
        if (loader.files.length > 0) {
            alert("Start uploading file");
            
      

            this.data = {
                _notar : document.getElementById("notar").value,
                _data : CryptoJS.MD5(loader.files[0]).toString(),
                _benefitiars : benefitiars.value.split("\n")
            };
            console.log(loader.files.length);
            try {
                this.state.contractInstance.CreateAgreement.sendTransaction(
                    this.data._notar,
                    this.data._data,
                    this.data._benefitiars, 
                    {
                        gas : 3000000,
                        from : this.props.application.state.address.toString()
                    },
                    (err, res) => {
                        this.whenTransactionMined(res, () => {
                            this.state.contractInstance.GetAgreements(
                                this.props.application.state.address,
                                (err, res) => {
                                    alert("Deployed");
                                    console.log(res[res.length - 1]);
                                    
                                    var adr = res[res.length - 1];
                                    
                                    var xhr = new XMLHttpRequest();
                                    var file = loader.files[0];
                                        
                                    xhr.open('POST', loadFileApi + adr.toString());
                                    xhr.setRequestHeader('Authorization', "Bearer " + buf.props.application.state.token.toString());
                                    
                                    xhr.onload = function() {
                                        alert("Success");
                                    }

                                    xhr.onerror = function() {
                                        alert("Error");
                                        console.log('Ошибка ' + this.status);
                                    }             
                                    xhr.send(loader.files[0]);
                                }
                            );   
                        });
                    }
                );
            } catch(e) {
                console.log(e);
            }
        } else {
            alert("Choose file, please");
        }
    }

    render() {
        return(
            <div className="add-doc">
                <main className="container">
                    <div className="pure-g">
                        <div className="pure-u-1-1">
                            <h2>Load File</h2> 
                            
                            <form action="#">
                                <div className="input-file-container">  
                                    <input className="input-file" id="my-file" type="file"/>
                                    <label className="input-file-trigger" id="label">Select a file...</label>
                                </div>
                                <p className="file-return" id ="file-return">...</p>
                            </form>
                            
                            <br/>
                            <label htmlFor="notar"><b>Адрес нотариуса</b></label>
                            <input type="text" placeholder="Введите адрес" id="notar" required/>

                            <br/>
                            <label htmlFor="benefitiars"><b>Адреса заинтересованных лиц</b></label>
                            <textarea type="text" placeholder="Введите адреса" id="benefitiars" required/>

                            <br/>
                            <button className="add-doc-button" onClick={this.loadFile}>Upload</button>
                            
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}