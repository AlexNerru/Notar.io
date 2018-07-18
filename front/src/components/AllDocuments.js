import React, { Component } from 'react'
import Document from "./Document"
import "../css/content.css"

import AgreementFactory from "../../abi/AgreementFactory.json"
import OneSideAgreement from "../../abi/OneSideAgreement.json"

export default class AllDocuments extends Component {

    constructor(props) {
        super(props);
        const contract = props.application.state.web3.eth.contract(AgreementFactory["abi"]);
        this.state = {
            agreementFactoryInstance : contract.at(props.application.state.agreementFactoryAddress),
            docs : []
        };
    }

    onElem = (index, adrs, inst) => {
        var array = [...this.state.docs]
        array[index].address = adrs;
        this.setState({docs : array});   
        
        inst.GetBenefitiars((err, res)=>{
            if (err) {
                console.log("Error");
            } else {
                var arr = [...this.state.docs]
                arr[index].benefitiars = res;
                this.setState({docs : arr});                                
            }
        }); 

        inst.GetNotar((err, res)=>{
            if (err) {
                console.log("Error");
            } else {
                var arr = [...this.state.docs]
                arr[index].notar = res;
                this.setState({docs : arr});                                
            }
        });

        inst.GetClient((err, res)=>{
            if (err) {
                console.log("Error");
            } else {
                var arr = [...this.state.docs]
                arr[index].client = res;
                this.setState({docs : arr});                                
            }
        }); 

        inst.GetData((err, res)=>{
            if (err) {
                console.log("Error");
            } else {
                var arr = [...this.state.docs]
                arr[index].data = res;
                this.setState({docs : arr});                                
            }
        }); 

        inst.CheckStatus((err, res)=>{
            if (err) {
                console.log("Error");
            } else {
                var arr = [...this.state.docs]
                arr[index].status = res;
                this.setState({docs : arr});                                
            }
        }); 
    }

    componentWillMount() {
        const agreement = this.props.application.state.web3.eth.contract(OneSideAgreement["abi"]);
        
        this.state.agreementFactoryInstance.GetAgreements(
            this.props.application.state.address,
            (err, res) => {
                for (var i = 0; i < res.length; i++) {
                    var inst = agreement.at(res[i]);
                                
                    this.setState({docs : [...this.state.docs, 
                    {
                        address : "...",
                        notar : "...",
                        data : "...",
                        client : "...",
                        benefitiars : [],
                        status : "...",
                        instance : inst
                    }]});

                    this.onElem(i, res[i], inst);                            
                }      
            }
        );
    }

    render() {
        var indents = [];
        for (var i = 0; i < this.state.docs.length; i++) {
            indents.push(<Document  
                                    info={this.state.docs[i]}
                                    app={this.props.application}
                            />);
        } 

        return (
            <div className="list">
                {indents}
            </div>
        );
    }
}
