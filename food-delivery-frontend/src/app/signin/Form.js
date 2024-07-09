"use client"
import React, { useState } from 'react';
import Script from "next/script";
import Script1 from './Script';
import { GoogleLogin } from '@react-oauth/google';
import "./Style.css";
import Link from "next/link";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from 'react-redux';
import { Auth_direct, Test } from '@/Redux/Action';
import { usePathname, useRouter } from 'next/navigation';
import { faL } from '@fortawesome/free-solid-svg-icons';
import SignUpForm from './Signup';
import SignInForm from './Signin';
axios.defaults.withCredentials = true;  // Ensure cookies are included in requests

const Form = () => {

    const Test1 = useSelector((state) => state.Rol);
    const route = useRouter();
    let dispatch = useDispatch();
    const [uploadProgress, setUploadProgress] = useState(0);
    let [forgot, setforgot] = useState(true);
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [verificationCodeFromAPI, setVerificationCodeFromAPI] = useState("");
    const [userVerificationCode, setUserVerificationCode] = useState("");
    let [confirmforgot,setconfirmforgot] = useState("");
    const [forgotverificationCodeSent, setforgotVerificationCodeSent] = useState(false);
    const [forgotverificationCodeFromAPI, setforgotVerificationCodeFromAPI] = useState("");
    const [forgotuserVerificationCode, setforgotUserVerificationCode] = useState("");
    let [showpasswordchange,setshowpasswordchange] = useState(true);
    let [msg,setmsg] = useState(false);
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        country: "",
        password: "",
        file: null
    });

    const [signInData, setSignInData] = useState({
        email: "",
        password: ""
    });

    const handleChangeSignin = (e) => {
        const { name, value } = e.target;
        setSignInData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        if (name === 'name' || name === 'country') {
            // Check if the value contains only characters
            if (/^[a-zA-Z\s]*$/.test(value)) {
                setSignupData({ ...signupData, [name]: value });
            }
        } else {
            // For other fields, update the state directly
            setSignupData({ ...signupData, [name]: value });
        }
    };
    
    

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        
                if (e.target.files[0]) {
                    setSignupData(prevState => ({
                        ...prevState,
                        file
                    }));
                  setUploadProgress(100);
                  setmsg(false);
                } else {
                  setUploadProgress(0);
                }
        
    };

    const handleSendVerificationCode = async (e) => {
        try {
            e.preventDefault();

            const response = await axios.post('http://localhost:8001/otp/', signupData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            console.log("hello")
            console.log(response.data)
            let  verificationCode  = response.data.otp;
            toast.success("Verification code sent successfully");
            setVerificationCodeFromAPI(verificationCode);
            setVerificationCodeSent(true);
        } catch (error) {
            console.error('Failed to send verification code:', error);
            toast.error("Failed to send verification code");
        }
    };

    const ForgothandleSendVerificationCode = async (e) => {
        try {
            e.preventDefault();

            const response = await axios.post('http://localhost:8001/otp/', signInData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              });
            console.log("hello")
            console.log(response.data)
            let  verificationCode  = response.data.otp;
            toast.success("Verification code sent successfully");
            setforgotVerificationCodeFromAPI(verificationCode);
            setforgotVerificationCodeSent(true);
        } catch (error) {
            console.error('Failed to send verification code:', error);
            toast.error("Failed to send verification code");
        }
    };

    let CkeckPin = (e)=>
    {
        e.preventDefault();
        if(forgotuserVerificationCode=="")
        {
            return;
        }
        if(forgotverificationCodeFromAPI=="")
        {
            return;
        }
        if (forgotuserVerificationCode !== forgotverificationCodeFromAPI) {
            console.log(forgotverificationCodeFromAPI);
            console.log(forgotuserVerificationCode)
            toast.error("Incorrect verification code");
            
        }
        else{
            setshowpasswordchange(false);
            setSignInData(prevState => ({
                ...prevState,
                password: "" 
            }));
            
        }
    }
    const handleSubmitSignin = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", signInData);
        try {
            const response = await axios.post(`http://localhost:8001/signin/`, signInData, {
                withCredentials: true
            });

            toast.success("sign in successful");
            setSignInData({
                email: "",
                password: ""
            });
            console.log(response)
            if (response.data.user.role == "customer") {

                await dispatch(Auth_direct("Customer"));
                console.log("hw");
                route.push("/customer/");


            }
            else if (response.data.user.role == "admin") {
                console.log(response.data.user.role);
                await dispatch(Auth_direct("Admin"));
                console.log("hw");
                route.push("admin/");
            }

        } catch (error) {
            console.error('Failed to sign in:');
            toast.error("Enter correct credentials");


        }
    };

    const handleSubmitSigninForgot = async (e) => {
        e.preventDefault();
        
        try {

            if(signInData.password!="")
        {
            const response = await axios.put(`http://localhost:8001/signinForgot/`, signInData, {
                withCredentials: true
            });

            toast.success("password change successful");
            setSignInData({
                email: "",
                password: ""
            });
            setforgot(true);
            setshowpasswordchange(true);
            setconfirmforgot(true);
            setforgotUserVerificationCode("");
            setforgotVerificationCodeFromAPI("");
            setforgotVerificationCodeSent(false);
        }
        else{
            toast.error("Enter new password");
        }
        console.log("Form submitted:", signInData);
            


        } catch (error) {
            console.error('Failed to sign in:');
            toast.error("email not exist");
        }
    };



    const handleSubmit = async (e) => {

        e.preventDefault();
        console.log(userVerificationCode, verificationCodeFromAPI);
        if (userVerificationCode !== verificationCodeFromAPI) {
            toast.error("Incorrect verification code");
        }
        else {
            const formData = new FormData();
            formData.append('username', signupData.name);
            formData.append('email', signupData.email);
            formData.append('country', signupData.country);
            formData.append('password', signupData.password);
            if (signupData.file) {
                formData.append('picture', signupData.file); // use 'picture' to match serializer field
            }
            console.log("Form submitted:", signupData);
            try {
                const response = await axios.post('http://localhost:8001/signup/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success("Register Successfully");
                setSignupData({
                    name: "",
                    email: "",
                    country: "",
                    password: "",
                    file: null
                });
                setUploadProgress(0);
                setVerificationCodeFromAPI("");
                setUserVerificationCode("");
                setVerificationCodeSent(false)

            } catch (error) {
                console.error('Failed to submit form:', error.response.data);
                toast.error("Enter correct Info");
                setVerificationCodeFromAPI("");
                setUserVerificationCode("");
                setVerificationCodeSent(false)
            }
        }

    };


    const handleGoogleLoginSuccess = async (data) => {
        const token = data.credential;
        console.log(token);

        const decodedToken = jwtDecode(token);
        console.log(decodedToken);

        try {
            const response = await axios.post(`http://localhost:8001/signingoogle/`, { token_info: decodedToken });
            
            toast.success("sign in successful");
            await dispatch(Auth_direct("Customer"));
            console.log("hw");
            route.push("/customer");
        } catch (error) {
            console.error('Failed to sign in:');
            toast.error("Enter correct credentials");

        }
    };


    const handleGoogleLoginError = (error) => {

    };


    return (
        <>
            <div className="container1" id="container1">

                <div className="form-container sign-up">
                    <SignUpForm
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        handleSendVerificationCode={handleSendVerificationCode}
                        uploadProgress={uploadProgress}
                        verificationCodeSent={verificationCodeSent}
                        signupData={signupData}
                        userVerificationCode={userVerificationCode}
                        setUserVerificationCode={setUserVerificationCode}
                        handleSubmit={handleSubmit}
                        setUploadProgress={setUploadProgress}
                        setVerificationCodeSent={setVerificationCodeSent}
                        setmsg={setmsg}
                        msg={msg}
                    />
                </div >

                <div className="form-container sign-in">
                    <SignInForm
                        handleChangeSignin={handleChangeSignin}
                        handleSubmitSignin={handleSubmitSignin}
                        forgot={forgot}
                        handleGoogleLoginSuccess={handleGoogleLoginSuccess}
                        handleGoogleLoginError={handleGoogleLoginError}
                        signInData={signInData}
                        setforgot={setforgot}
                        handleSubmitSigninForgot={handleSubmitSigninForgot}
                        forgotverificationCodeSent={forgotverificationCodeSent}
                        forgotverificationCodeFromAPI={forgotverificationCodeFromAPI}
                        forgotuserVerificationCode={forgotuserVerificationCode}
                        confirmforgot={confirmforgot}
                        setforgotVerificationCodeSent={setforgotVerificationCodeSent}
                        setforgotVerificationCodeFromAPI={setforgotVerificationCodeFromAPI}
                        setforgotUserVerificationCode={setforgotUserVerificationCode}
                        setconfirmforgot={setconfirmforgot}
                        ForgothandleSendVerificationCode={ForgothandleSendVerificationCode}
                        setshowpasswordchange = {setshowpasswordchange}
                        showpasswordchange = {showpasswordchange}
                        CkeckPin = {CkeckPin}
                    />
                </div>
                <div className="toggle-container">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all site features</p>
                            <button className="hidden" id="login">Sign In</button>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h1>Hello, User!</h1>
                            <p>Register with your personal details to use all site features</p>
                            <button className="hidden" id="register">Sign Up</button>
                        </div>
                    </div>
                </div>
                <Script1></Script1>
                <Toaster />



            </div>
        </>
    )
}

export default Form;
