import React from 'react'
import { useState } from 'react'
import AppContext from '../Context/AppContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const studentRegister = () => {
    const navigate = useNavigate();
    const {studentRegister} = useContext(AppContext);
    const [formData, setFormData] = useState({
        rollno:"",
        email: "",
        password: ""
    });
    const onChangeHandler = (e) =>{
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    }
    const {rollno,email,password} = formData;
    const submitHandler = async(e) => {
        e.preventDefault();
        const result = await studentRegister(rollno,email,password);
        if(result.success) {
            navigate('/login');
        }
        console.log(formData);
    }

    return (
        <>


            <div className='nav'>
                <div class="page">
                    <div class="container">


                        <div class="left">
                            <center><h2>Register</h2><br /></center>

                            <form id="loginForm" onSubmit={submitHandler}>

                                <input name="rollno" value={formData.rollno} onChange={onChangeHandler} type="number" id="userRoll" placeholder="Enter Roll Number" />
                                <input name="email" value={formData.email} onChange={onChangeHandler}  type="email" id="useremail" placeholder="Enter Email" />
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

export default studentRegister