import React, {Component} from 'react';
import {Formik} from 'formik';
import {Link} from 'react-router-dom';
import './Login.css'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as axios from 'axios';
toast.configure();


class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login: ''
    }
  }

  notify = (message, match) => {  
    if (match) {
      toast.success(message, {
        position: toast.POSITION.TOP_RIGHT, 
        autoClose: 2500
      })
    }
    else {
        toast.error(message, {
        position: toast.POSITION.TOP_RIGHT, 
        autoClose: 2500
      })
    }
  } 
  
   submit = (values, actions) => {
    axios.get("http://localhost:4000/login/", values, { headers:{'Content-Type': 'application/json'}
    }).then(res => {
        console.log(res)
        let message
        if (res) {
          message = 'Informations de connexion correctes'
        }
        else {
          message = 'Adresse mail ou mot de passe incorrect'
        }
        this.notify(message, res)
    })
  }

    render() {
        return (
            <Formik
              onSubmit={this.submit}
              initialValues={{accountNumber: '', 
                                pin: ''}}
            >
              {({ handleSubmit, handleChange, handleBlur, values, isSubmitting }) => (
                <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign In</h5>
                                <form className="form-signin" onSubmit={handleSubmit}>
                                    <div className="form-label-group"> 
                                        <input 
                                            type="text" 
                                            name='accountNumber'
                                            placeholder="Account Number" 
                                            required 
                                            value={values.accountNumber} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        /> 
                                    </div>
                                    <div className="form-label-group"> 
                                        <input type="password" 
                                            id="inputPassword" 
                                            className="form-control" 
                                            placeholder="PIN code" 
                                            required
                                            name="pin" 
                                            value={values.pin} 
                                            onChange = {handleChange} 
                                            onBlur={handleBlur} 
                                        /> 
                                    </div>
                                    <div className="mb-3"> 
                                        <label ><Link to='/signup'>Click here </Link>if don't have an account?</label> 
                                    </div> 
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                                    <hr className="my-4"/> <button className="btn btn-lg btn-google btn-block text-uppercase" type="submit"><i className="fa fa-google mr-2"></i> Sign in with Google</button> <button className="btn btn-lg btn-facebook btn-block text-uppercase" type="submit"><i className="fa fa-facebook-f mr-2"></i> Sign in with Facebook</button>
                                    <button className='btn btn-small btn-succes'></button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
              )}
            </Formik>
        )
      }
    
}
export default Login;