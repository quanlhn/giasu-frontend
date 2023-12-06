'use client'

import React from "react";
import {useState, useRef, useContext} from 'react';
import { useRouter } from 'next/navigation'
import { API_PATH } from "../CustomInterface";
import UserContext from "../UserContext";
import Cookies from "js-cookie";

const Signup = () => {

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
        <p className='px-8 text-lg'>Đăng ký với tư cách là phụ huynh tại đây</p>
        <button className='log-button ghost mt-16' onClick={() => changeType('parents')}>Phụ huynh đăng ký</button>
    </div>
    const signinOverlay = <div className='flex flex-col h-full justify-center text-center items-center text-teal-700'>
        <h1 className='text-3xl mb-10 font-semibold'>Xin chào,</h1>
        <p className='px-8 text-lg'>Đăng ký làm gia sư tại đây</p>
        <button className='log-button ghost mt-16' onClick={() => changeType('tutor')}>Gia sư đăng ký</button>
    </div>

    return (
        <div className="login-and-signup-page text-center mt-10 ">
            <div className="container w-1/2 max-h-full h-[28rem] relative left-1/2 translate-x-[-50%] rounded-xl shadow-2xl">
                <div ref={formRef} className='absolute w-96 h-full ease-in-out duration-700'>
                    {type == "tutor" ?  
                        <SignupForm fc={() => changeType('parents')} role='tutor' />
                    :  
                        <SignupForm fc={() => changeType('tutor')} role='parents' />}
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

const SignupForm = ({fc, role}: Props) => {

    const router = useRouter()
    const user = useContext(UserContext)
    const [state, setState] = React.useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        repass: ""
    });

    const errorRef = useRef<(HTMLDivElement | null)[]>([])

    const handleSubmit =(evt: any) => {
        evt.preventDefault();
        const { name, email, phone, password, repass } = state;
        if (name === "" || email === "" || phone === "" || password === "" || repass === "") {
            if (name === "") {
                errorRef.current[0]?.classList.remove('hidden')
            }
            if (email === "") {
                errorRef.current[1]?.classList.remove('hidden')
            }
            if (phone === "") {
                errorRef.current[2]?.classList.remove('hidden')
            }
            if (password === "") {
                errorRef.current[3]?.classList.remove('hidden')
            }
            if (repass === "") {
                errorRef.current[4]?.classList.remove('hidden')
            }
        } else {
            for (const key in state) {
                setState({
                    ...state,
                    [key]: ""
                });
            }
            if (password === repass) {
                fetch(API_PATH + 'auth/register', {
                    method: 'POST',
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/json'
                        
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        phone,
                        password,
                        role: role,
                        gender: '',
                        birth: null, 
                        
                    })
                })
                .then(response => {
                    if (!response.ok) throw new Error(response.statusText)
                    else return response.json()
                })
                .then(data => {
                    Cookies.set('accessToken', data.access_token, { expires: 7 })
                    const t_userdata = data.user
                    const userData = {
                        userID: t_userdata.id,
                        name: t_userdata.name,
                        phoneNumber: t_userdata.phoneNumber,
                        email: t_userdata.email,
                        role: t_userdata.role,
                        isLoggedIn: true,
                        gender: t_userdata.gender,
                        birth: t_userdata.birth,
                    }
                    console.log(userData)
                    user.setUser(userData)
                    localStorage.setItem('user', JSON.stringify(userData));
                    if (role == 'tutor') {
                        router.push('/signup/fill-tutor-info')
                    } else {
                        router.push('/')
                    }
                })
                .catch(err => {
                    console.log('error: ' + err)
                })
            } else {
                errorRef.current[5]?.classList.remove('hidden')
            }
    
        }
    }


    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;    
        if (evt.target.name === 'phone') {
            const reg = /^(\s*|\d+)$/
            if (reg.test(value)) {
                setState({...state, phone: value })
                if (!evt.target.nextElementSibling?.classList.contains('hidden')) {
                    evt.target.nextElementSibling?.classList.add('hidden')
                }
            }
        } else {
            setState({
                ...state,
                [evt.target.name]: value
            });
            if (!evt.target.nextElementSibling?.classList.contains('hidden')) {
                evt.target.nextElementSibling?.classList.add('hidden')
            }
            if (evt.target.name == 'repass' && !errorRef.current[5]?.classList.contains('hidden'))  {
                errorRef.current[5]?.classList.add('hidden')
            }
        }
        // console.log(reg.test(value))
    };

    return (
        <div className="sign-in-container form-container w-full mt-8">
            <h1 className="font-bold text-2xl text-teal-700">Đăng ký {role == 'tutor' ? 'Gia sư' : 'Phụ huynh' }</h1>
            {/* {onSubmit={() => handleSubmit}} */}
            <form >
                <div className="form-group pt-6">
                    {/* <label htmlFor="name">Name</label> */}
                    <input type="text" name="name" value={state.name} onChange={handleChange} className="p-2 form-control h-8 w-2/3 bg-grey3" id="name" placeholder="Name" />
                    <div ref={(el) => errorRef.current[0] = el} className="hidden text-[12px] mx-auto text-left w-2/3 mb-[-18px]  italic text-[#ff416c]">Vui lòng điền tên</div>
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="email">Email</label> */}
                    <input type="email" name="email" value={state.email} onChange={handleChange} className="p-2 form-control h-8 w-2/3 bg-grey3" id="email" placeholder="Email" />
                    <div ref={(el) => errorRef.current[1] = el} 
                        className="hidden text-[12px] mx-auto text-left w-2/3 mb-[-18px]  italic text-[#ff416c]">
                            Vui lòng điền email
                    </div>
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="email">Email</label> */}
                    <input type="phone" name="phone" value={state.phone} onChange={handleChange} className="p-2 form-control h-8 w-2/3 bg-grey3" id="phone" placeholder="Phone number" />
                    <div ref={(el) => errorRef.current[2] = el} 
                        className="hidden text-[12px] mx-auto text-left w-2/3 mb-[-18px]  italic text-[#ff416c]">
                            Vui lòng điền số điện thoại
                    </div>
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="password">Password</label> */}
                    <input type="password" name="password" value={state.password} onChange={handleChange} className="p-2 form-control h-8 w-2/3 bg-grey3" id="password" placeholder="Password" />
                    <div ref={(el) => errorRef.current[3] = el} 
                        className="hidden text-[12px] mx-auto text-left w-2/3 mb-[-18px]  italic text-[#ff416c]">
                            Vui lòng điền mật khẩu
                    </div>
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="confirmPassword">Confirm Password</label> */}
                    <input type="password" name="repass" value={state.repass} className="p-2 form-control h-8 w-2/3 bg-grey3" onChange={handleChange} id="confirmPassword" placeholder="Confirm Password" />
                    <div ref={(el) => errorRef.current[4] = el} 
                        className="hidden text-[12px] mx-auto text-left w-2/3 italic text-[#ff416c]">
                            Vui lòng điền lại mật khẩu
                    </div>
                </div>    
                <div className="form-group absolute left-0 right-0 mx-auto bottom-8">
                    <div ref={(el) => errorRef.current[5] = el} 
                        className="hidden text-[12px] mx-auto text-left w-2/3 italic text-[#ff416c]">
                            Nhập lại mật khẩu không đúng
                    </div>
                    <button className="log-button" onClick={handleSubmit}>Signup</button>
                </div>
            </form>
        </div>
    )
}

export default Signup