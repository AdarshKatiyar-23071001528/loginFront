import React from 'react'
import { useState } from 'react'
import AppContext from '../src/Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const {login} = useContext(AppContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const onChangeHandler = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    }
    const {email,password} = formData;
    const submitHandler = async(e) => {
        e.preventDefault();
        const result = await login(email,password);
        if(result.success) {
            navigate('/');
        }

    }

    return (
        <>
            {/* <div className="container my-5 p-5" style={{ width: '600px', border: "2px solid yellow", borderRadius: "10px" }}>
                <h1 className='text-center'>User Login</h1>
                <form onSubmit={submitHandler} className='my-3'>
                    
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Email address</label>
                        <input name="email" value={formData.email} onChange={onChangeHandler}   type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label for="exampleInputPassword1" className="form-label">Password</label>
                        <input name="password" value={formData.password} onChange={onChangeHandler}  type="password" className="form-control" id="exampleInputPassword1" />
                    </div>
                    <div className='d-grid col-6 mx-auto my-3'>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>

                </form>
            </div> */}

            <div className='nav'>
                <div class="page">
                    <div class="container">


                        <div class="left">
                            <center><h2>Login</h2><br /></center>

                            <form id="loginForm" onSubmit={submitHandler}>

                                <input name="email" value={formData.email} onChange={onChangeHandler} type="email" id="useremail" placeholder="UserEmail" />
                                <input name="password" value={formData.password} onChange={onChangeHandler} type="password" id="password" placeholder="Password" />


                                <div class="remember">
                                    <input type="checkbox" id="rememberMe" />
                                    <label for="rememberMe">Remember Me</label>
                                </div>

                                <a href="#" class="forgot">Forgot Password?</a>

                                <button type="submit">Login</button>

                                <p class="signup-text">
                                    Don’t have an account? <a href="/register">Sign up</a>
                                </p>



                            </form>
                        </div>

                        <div class="right">
                            <h1>Welcome to <span>SKIT</span></h1>
                            <p class="tagline">Dreams Come True Here!</p>


                            <img src="./s1.jpg"
                                alt="Student Login Illustration"
                                class="illustration" />
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Login