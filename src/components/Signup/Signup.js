import React, {Component} from 'react';
import {Formik} from 'formik';
import {Link, withRouter} from 'react-router-dom';
import './Signup.css'
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as axios from 'axios';
toast.configure();

class Signup extends Component{
  constructor(props) {
    super(props);
    this.state = {
      login: '',
      credentials: []
    }
  }
  submit = (values, actions) => {
    axios.post("http://localhost:4000/create/", values, { headers:{'Content-Type': 'application/json'}
    }).then(res => {
        console.log(res)
        if (res)
        {
            this.setState({
              credentials: res.data
            })
            console.log('Cred', this.state.credentials)
        }
    })
    this.notify();
    console.log('Cred2', this.state.credentials)
  }
  notify = () => {  
    toast.success('Enregistrée avec succès', {
      position: toast.POSITION.TOP_RIGHT, 
      autoClose: 2500
    })
  } 
    render() {
        return (
            <Formik
              onSubmit={this.submit}
              initialValues={{
                              email: '', 
                              nom: '',
                              prenom:'',
                              birth:'',
                              civility: ''
                            }}
            >
              {({ handleSubmit, handleChange, handleBlur, values, isSubmitting }) => (
                <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body">
                                <h5 className="card-title text-center">Sign Up</h5>
                                <form className="form-signin" onSubmit={handleSubmit} encType="multipart/form-data" method="POST">
                                    <div className="form-label-group"> 
                                        <input 
                                            type="text" 
                                            id="inputEmail" 
                                            name='prenom'
                                            placeholder="First Name" 
                                            required 
                                            value={values.prenom} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        /> 
                                    </div>
                                    <div className="form-label-group"> 
                                        <input 
                                            type="text" 
                                            id="inputEmail" 
                                            name='nom'
                                            placeholder="Name" 
                                            required 
                                            value={values.nom} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        /> 
                                    </div>
                                    <div className="form-label-group"> 
                                        <select 
                                            type="text" 
                                            name='civility'
                                            placeholder="Name" 
                                            required  
                                            value={values.civility} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        > 
                                          <option value="M.">M.</option>
                                          <option value="Mme">Mme</option>
                                        </select>
                                    </div>
                                    <div className="form-label-group"> 
                                        <input 
                                            type="email" 
                                            id="inputEmail" 
                                            name='email'
                                            placeholder="Email address" 
                                            required  
                                            value={values.email} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        /> 
                                    </div>
                                    <div className="form-label-group"> 
                                        <input 
                                            type="date" 
                                            id="inputEmail" 
                                            name='birth'
                                            placeholder="Date de naissance" 
                                            required  
                                            value={values.birth} 
                                            className="form-control"
                                            onChange = {handleChange} 
                                            onBlur={handleBlur}  
                                        /> 
                                    </div>
                                    <div className="mb-3"> 
                                        <label ><Link to='/login'>Click here </Link>if you have already an account?</label> 
                                        { this.state.credentials.length !== 0 ? <div style={{color: 'green'}}><label >Numéro de compte : {this.state.credentials.accountnumber}</label> 
                                        <br/><label >Code PIN: {this.state.credentials.pin}</label></div> : null }
                                    </div>
                                    <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign up</button>
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
export default withRouter(Signup);