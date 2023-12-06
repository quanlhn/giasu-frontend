'use client'

import React from "react";
import Link from "next/link";
import { Button, ButtonGroup } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import { API_PATH } from "./CustomInterface";
import Cookies from 'js-cookie'
import path from "path";

const Header = () => {
    const [userName, setUserName] = useState('')

    const userContext = useContext(UserContext)
    const defaultUser = {
        userID: 0,
        name: '',
        phoneNumber: '',
        email: '',
        role:'',
        gender: '',
        birth: '',
        isLoggedIn: false,
    }
    const [userStorage, setUserStorage] = useState(defaultUser)
    if (typeof window !== 'undefined') {
        useEffect(() => {
            if (typeof (Storage) !== undefined && localStorage.user) {
                const localUser = JSON.parse(localStorage.user) 
                setUserName(localUser.name)
                setUserStorage(() => JSON.parse(localStorage.user)   )
                if (!userContext.user.isLoggedIn) {
                    userContext.setUser(JSON.parse(localStorage.user))
                }
            }
        }, [localStorage['user']])
    }

    // if (typeof window !== 'undefined') {
    //     useEffect(() => {
    //         if (typeof (Storage) !== undefined && localStorage.user) {
    //             const localUser = JSON.parse(localStorage.user) 
    //             setUserName(localUser.name)
    //         }
    //     }, [localStorage['user']])
    // }

    const logOut = () => {
        console.log('hihi')
        localStorage.removeItem('user')
        setUserStorage(defaultUser)
        setUserName('')
        userContext.setUser(defaultUser)
        Cookies.remove('accessToken',)
        fetch(API_PATH + 'auth/logout', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
                
            },
        })
    }


    return (
        <div className="flex py-4 px-12 items-center justify-between bg-headerbg rounded-b-2xl">
            <div className="logo text-3xl">
                <div className="text-teal-700 text-3xl font-extrabold self-center my-auto">
                    <Link href={'/'}>GIA SƯ TÍN</Link>
                </div>
            </div>
            <div className="nav flex gap-14 items-center">
                    <div className="">
                        <Link className="text-slate-800 text-lg font-bold tracking-wide" href={'/'} >Trang chủ</Link>
                    </div>
                    <div className="nameTag-dropdown relative min-w-[10rem]">
                        <div className="w-full flex">
                            <Link className="text-slate-800 text-lg font-medium tracking-wide relative w-full text-center " href={'/parents'} >Phụ huynh</Link>

                        </div>
                        <ul className="dropdowns-category absolute right-0 bg-slate-100 p-2 rounded-md text-slate-800">
                            <li><Link href={'/parents'}><u>Phụ huynh cần biết</u></Link></li>
                            <li><Link href={'/requestClass'}><u>Đăng ký tìm gia sư</u></Link></li>
                        </ul>
                    </div>
                    <div className="">
                        <Link className="text-slate-800 text-lg font-medium tracking-wide relative" href={'/tutor'} >Gia sư</Link>
                    </div>
                    <div className="">
                        <Link className="text-slate-800 text-lg font-medium tracking-wide relative" href={'/class'} >Lớp mới</Link>
                    </div>
                    <div className="">
                        <Link className="text-slate-800 text-lg font-medium tracking-wide relative" href={'/group-learning'} >Khóa học nhóm</Link>
                    </div>
                    <div className="">
                        <Link className="text-slate-800 text-lg font-medium tracking-wide relative" href={'/forum'} >Diễn đàn</Link>
                    </div>
            </div>
            <div >
                {userName != '' ? 
                    <div className="text-teal-700 text-lg font-medium bg-white p-2 rounded-lg relative nameTag-dropdown min-w-[10rem]">
                        Xin chào, {userName}
                        <ul className='dropdowns-category absolute right-0 text-sm bg-slate-100 px-2 py-2 w-full rounded-md'>
                            {userContext.user.role == 'admin' || userContext.user.role == 'staff' 
                            ? 
                            <Link href={{pathname: "/management"}}><li><u>Quản lý</u></li></Link>
                            :
                            <li><Link href={{pathname: "/my-account"}}><u>Tài khoản của tôi</u> </Link></li>
                            }
                            <li onClick={logOut} className='cursor-pointer'><Link href={{pathname: "/"}}><u>Đăng xuất</u></Link></li>
                        </ul>
                    </div>
                :
                    <div className="flex gap-8 items-center">
                        <div className="text-teal-700 text-lg font-medium bg-white p-2 rounded-lg">
                            <Link href={'/login'} >Đăng nhập</Link>
                        </div>
                        <div className="text-white text-lg font-medium bg-teal-700 p-2 rounded-lg">
                            <Link href={'/signup'} >Đăng ký</Link>
                        </div>

                    </div>
                }

            </div>
        </div>
    )
}

export default Header