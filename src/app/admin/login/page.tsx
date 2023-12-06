'use client'

import React from "react";
import { useContext} from 'react'
import UserContext from "../../UserContext";
import { useRouter } from 'next/navigation'
import { API_PATH } from "@/app/CustomInterface";
import Link from "next/link";
import Cookies from 'js-cookie'


const Parents = () => {
    const user = useContext(UserContext)
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

        fetch(API_PATH + 'auth/login', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({
                email: username,
                password
            })
        })
        .then(response => {
            if (!response.ok) {
                console.log('not ok')
                throw new Error(response.statusText)
            }
            else return response.json()
        })
        .then(data => {
            const t_userdata = data.user
            const userData = {
                userID: t_userdata.userID,
                name: t_userdata.name,
                phoneNumber: t_userdata.phone,
                email: t_userdata.email,
                role: t_userdata.role,
                isLoggedIn: true,
                gender: t_userdata.gender,
                birth: t_userdata.birth,
            }
                console.log(userData)
                user.setUser(userData)
                localStorage.setItem('user', JSON.stringify(userData));
                Cookies.set('accessToken', data.access_token, { expires: 7 })
                router.push('/admin')
        })
        .catch(err => {
            console.log('error: ' + err)
        })
    }

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setState({
            ...state,
            [evt.target.name]: value
        });
    };

    return (
        <div className="sign-in-container form-container w-full mt-16  flex flex-col items-center">
            <h1 className="font-bold text-2xl text-teal-700">Nhân viên đăng nhập </h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group pt-6">
                    {/* <label htmlFor="name">Name</label> */}
                    <input type="text" name="username" className="form-control w-56 h-8 bg-grey3 p-2" onChange={handleChange} id="name" placeholder="Username" />
                </div>
                <div className="form-group pt-6">
                    {/* <label htmlFor="email">Email</label> */}
                    <input type="password" name="password" className="form-control w-56 h-8 bg-grey3 p-2" onChange={handleChange} id="password" placeholder="Password" />
                </div>
                <div className="form-group flex justify-center mt-12">
                    <button className="log-button">Login</button>
                </div>
                
            </form>
        </div>
    )
}

export default Parents