import React from 'react'
import { useState } from 'react'
import AppContext from '../src/Context/appContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const {register} = useContext(AppContext);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const onChangeHandler = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    }
    const {name,email,password} = formData;
    const submitHandler = async(e) => {
        e.preventDefault();
        const result = await register(name,email,password);
        if(result.success) {
            navigate('/');
        }
        console.log(formData);
    }

    return (
        <>
            {/* <div className="container">
                <h1 className='text-center'>User Register</h1>
                <form onSubmit={submitHandler} className='my-3'>
                    <div className="mb-3">
                        <label for="exampleInputEmail1" className="form-label">Name</label>
                        <input name="name" value={formData.name} onChange={onChangeHandler}  type="name" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                    </div>
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
                        <button type="submit" className="btn btn-primary">Register</button>
                    </div>

                </form>
            </div> */}






            <div className='nav'>
                <div class="page">
                    <div class="container">


                        <div class="left">
                            <center><h2>Register</h2><br /></center>

                            <form id="loginForm" onSubmit={submitHandler}>

                                <input name="name" value={formData.name} onChange={onChangeHandler} type="text" id="username" placeholder="Username" />
                                <input name="email" value={formData.email} onChange={onChangeHandler}  type="email" id="useremail" placeholder="UserEmail" />
                                
                                <input name="password" value={formData.password} onChange={onChangeHandler} type="password" id="password" placeholder="Password" />


                                <div class="remember">
                                    <input type="checkbox" id="rememberMe" />
                                    <label for="rememberMe">Remember Me</label>
                                </div>

                                <a href="#" class="forgot">Forgot Password?</a>

                                <button type="submit">Register</button>

                                <p class="signup-text">
                                    Already have an account? <a href="/">Login</a>
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

export default Register