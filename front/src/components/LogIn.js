import React, { Component } from 'react'
import {Link} from 'react-router'
import { browserHistory } from 'react-router';

import "../css/signup.css";

const loginApi = "http://18.216.253.250:5000/api/v0.1/login";

class LogIn extends Component {
    login = () => {
        var xhr = new XMLHttpRequest();

        var md5 = require('md5');
        this.email = document.getElementById("email").value;
        this.psw = md5(document.getElementById("psw").value);

        var data = {
            "email": document.getElementById("email").value.toString(),
            "password": this.psw.toString()
        };   

        var buf = this;
        xhr.open('GET', loginApi + "?email=" + data.email + "&" + "password=" + data.password);
        xhr.onload = function() {
            if (this.status == 200) {
                buf.props.application.setState({authorized : true});
                var userData = JSON.parse(this.response);
                buf.props.application.setState({
                    name : userData.name,
                    scndname : userData.second_name,
                    surname : userData.surname,
                    password : data.password,
                    email : data.email,
                    token : userData.token 
                });
                browserHistory.push("/profile");
            } else {
                alert("Smth goes wrong");
            }
        }

        xhr.onerror = function() {
            alert("This user doesn't exist");
            console.log('Ошибка ' + this.status);
        }              
        xhr.send();
    }

      render() {
          return(
            <div className="sign-up">
                <div className="container">
                    <h1>Log In</h1>
                    <hr/>
                    <div>
                        <label htmlFor="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" id="email" required/>
                        <br/>
                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" id="psw" required/>    
                    </div>

                    <div className="clearfix">
                    <Link to={"/signup"}><button type="button" className="cancelbtn">Back</button></Link>
                        <button onClick={this.login} type="button" className="signupbtn">Log In</button>
                    </div>
                </div>
            </div>
          );
      }
}

export default LogIn;