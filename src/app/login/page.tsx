'use client'

import React from "react";
import {useState, useRef} from 'react';
import { useRouter } from 'next/navigation'

const Login = () => {

    const [type, setType] = useState("tutor");
    const formRef = useRef<HTMLDivElement>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    const changeType = (text: string) => {
        if (text !== type) {
            setType(text);
        }
        if (text == 'parents') {
            // console.log(text)
            
            formRef.current?.classList.add('translate-x-[100%]')
            overlayRef.current?.classList.remove('translate-x-[100%]')
        } else {
            // console.log(text)
            formRef.current?.classList.remove('translate-x-[100%]')
            overlayRef.current?.classList.add('translate-x-[100%]')
        }
    }

    const signupOverlay = <div className='flex flex-col h-full justify-center text-center items-center text-teal-700'>
        <h1 className='text-3xl mb-10 font-semibold'>Xin chào</h1>
        <p className='px-8 text-lg'>Để đăng nhập với trạng thái là phụ huynh, thay đổi tại đây</p>
        <button className='log-button ghost mt-16' onClick={() => changeType('parents')}>Phụ huynh đăng nhập</button>
    </div>
    const signinOverlay = <div className='flex flex-col h-full justify-center text-center items-center text-teal-700'>
        <h1 className='text-3xl mb-10 font-semibold'>Xin chào,</h1>
        <p className='px-8 text-lg'>Để đăng nhập với trạng thái là gia sư, thay đổi tại đây</p>
        <button className='log-button ghost mt-16' onClick={() => changeType('tutor')}>Gia sư đăng nhập</button>
    </div>

    return (
        <div className="login-and-signup-page text-center mt-10 ">
            <div className="container w-1/2 max-h-full h-[28rem] relative left-1/2 translate-x-[-50%] rounded-xl shadow-2xl">
                <div ref={formRef} className='absolute w-96 h-full ease-in-out duration-700'>
                    {type == "tutor" ?  
                        <LoginForm fc={() => changeType('parents')} role='tutor' />
                    :  
                        <LoginForm fc={() => changeType('tutor')} role='parents' />}
                </div>
                <div ref={overlayRef} className='overlay absolute w-96 h-full translate-x-[100%] ease-in-out duration-700'>
                    {type == "tutor" ? signupOverlay : signinOverlay}
                </div>
            </div>
        </div>
    )
}

interface Props {
    fc: (text: string) => void,
    role: string
}

const LoginForm = ({fc, role}: Props) => {

    const router = useRouter()
    const [state, setState] = React.useState({
        username: "",
        password: ""
    });

    const handleSubmit =(evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const target = evt.target
        const { username, password } = state;

        for (const key in state) {
            setState({
                ...state,
                [key]: ""
            });
        }
        // console.log(state)
        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({
                username,
                password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log(data.role)
                    console.log(data.email)
                    const userData = {
                        id: data.id,
                        name: data.name,
                        phoneNumber: data.phone,
                        email: data.email,
                        isLoggedIn: true,
                        gender: data.gender,
                        birth: data.birth,
                    }
                    // user.setUser(userData)
                    localStorage.setItem('user', JSON.stringify(userData));
                    router.back()
                } else {
                    console.log(data.message)
                }
            });
    }


    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    return (
        <div className="sign-in-container form-container w-full mt-16">
            <h1 className="font-bold text-2xl text-teal-700">{role == 'tutor' ? 'Gia sư' : 'Phụ huynh' } đăng nhập </h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group pt-6">
                    {/* <label htmlFor="name">Name</label> */}
                    <input type="text" name="username" className="form-control w-2/3 h-8 bg-grey3 p-2" onChange={handleChange} id="name" placeholder="Username" />
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="email">Email</label> */}
                    <input type="password" name="password" className="form-control w-2/3 h-8 bg-grey3 p-2" onChange={handleChange} id="password" placeholder="Password" />
                </div>
                <div className="form-group pt-6 text-xs">
                    Nếu chưa có tài khoản, đăng ký <span onClick={() => fc('signUp')} className="italic text-[#ff416c] cursor-pointer" >tại đây</span>
                </div>
                <div className="form-group absolute left-0 right-0 mx-auto bottom-16">
                    <button className="log-button">Login</button>
                </div>
            </form>
        </div>
    )
}

export default Login