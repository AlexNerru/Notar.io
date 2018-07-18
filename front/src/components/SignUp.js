import React, { Component } from 'react'
import {Link} from 'react-router'
import { browserHistory } from 'react-router';
import "../css/signup.css"; 

const signupApi = "http://18.216.253.250:5000/api/v0.1/clients";

export default class SignUp extends Component {

    signup = () => {

        var xhr = new XMLHttpRequest();

        var md5 = require('md5');

        this.psw = md5(document.getElementById("psw").value);
        this.psw_repeat = md5(document.getElementById("psw-repeat").value);

        var buf = this;
        
        var data = {
            "address": buf.props.application.state.address.toString(),
            "name" : document.getElementById("name").value.toString(),
            "second_name": document.getElementById("scnd_name").value.toString(),
            "surname": document.getElementById("surname").value.toString(),
            "email": document.getElementById("email").value.toString(),
            "password": this.psw.toString()
        };

        if (this.psw != this.psw_repeat) {
            alert("Passwords do not match");
        } else {
            xhr.open('POST', signupApi);
            xhr.onload = function() {
                if (this.status == 201) {
                    buf.props.application.setState({authorized : true});
                    buf.props.application.setState({
                        name : data.name,
                        scndname : data.second_name,
                        email : data.email,
                        password : data.password,
                        surname : data.surname
                    });
                    browserHistory.push("/profile");
                } else {
                    alert("Smth goes wrong");
                }
            }
            xhr.onerror = function() {    
                console.log('Ошибка ' + this.status);
            }              
            xhr.send(JSON.stringify(data));
        }
    }

    render() {
          return(
            <div className="sign-up">
                <div className="container">
                    <h1>Sign Up or <Link to="/login">Login</Link></h1>
                    <p>Please fill in this form to create an account.</p>
                    <hr/>
                    <div>

                        <br/>
                        <label htmlFor="name"><b>Name</b></label>
                        <input type="text" placeholder="Enter Name" id="name"  required/>    

                        <br/>
                        <label htmlFor="scnd_name"><b>Second Name</b></label>
                        <input type="text" placeholder="Enter Second Name" id="scnd_name"  required/>    

                        <br/>
                        <label htmlFor="surname"><b>Surname</b></label>
                        <input type="text" placeholder="Enter Surname" id="surname"  required/>    


                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" id="email"  required/>
                        
                        <br/>
                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" id="psw"  required/>    
                        
                        <br/>
                        <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                        <input type="password" placeholder="Repeat Password" id="psw-repeat"  required/>    
                    
                    </div>

                    <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>

                    <div className="clearfix">
                        <button onClick={this.signup} type="button" className="signupbtn">Sign Up</button>
                    </div>
                </div>
            </div>
          );
      }
}