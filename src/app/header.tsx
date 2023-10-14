'use client'

import React from "react";
import Link from "next/link";
import { Button, ButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";

const Header = () => {
    const [userName, setUserName] = useState('')

    if (typeof window !== 'undefined') {
        useEffect(() => {
            if (typeof (Storage) !== undefined && localStorage.user) {
                setUserName(localStorage.user.name)
            }
            // if (userStorage.isLoggedIn && !userContext.user.isLoggedIn) {
            //     userContext.setUser(userStorage)
            // }
            // console.log(userStorage.isLoggedIn)
        }, [localStorage['user']])
    }


    return (
        <div className="flex py-4 px-12 items-center justify-between bg-headerbg">
            <div className="logo text-3xl">
                <div className="text-teal-700 text-3xl font-extrabold self-center my-auto">
                    <Link href={'/'}>GIA SƯ TÍN</Link>
                </div>
            </div>
            <div className="nav flex gap-14 items-center">
                    <div className="text-orange-500 text-lg font-bold tracking-wide">
                        <Link href={'/'} >Trang chủ</Link>
                    </div>
                    <div className="text-slate-800 text-lg font-medium tracking-wide">
                        <Link href={'/parents'} >Phụ huynh</Link>
                    </div>
                    <div className="text-slate-800 text-lg font-medium tracking-wide">
                        <Link href={'/tutor'} >Gia sư</Link>
                    </div>
                    <div className="text-slate-800 text-lg font-medium tracking-wide">
                        <Link href={'/class'} >Lớp mới</Link>
                    </div>
                    <div className="text-slate-800 text-lg font-medium tracking-wide">
                        <Link href={'/group-learning'} >Khóa học nhóm</Link>
                    </div>
                    <div className="text-slate-800 text-lg font-medium tracking-wide">
                        <Link href={'/forum'} >Diễn đàn</Link>
                    </div>
                {/* <ButtonGroup className="" variant="text" color="success" aria-label="text button group" >
                    <Button className="w-40">
                        <Link href={'/'} >Trang chủ</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/parents'} >Phụ huynh</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/tutor'} >Gia sư</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/class'} >Lớp mới</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/forum'} >Diễn đàn</Link>
                    </Button>

                </ButtonGroup> */}
            </div>
            <div className="flex gap-8 items-center">
                <div className="text-teal-700 text-lg font-medium bg-white p-2 rounded-lg">
                    <Link href={'/login'} >Đăng nhập</Link>
                </div>
                <div className="text-white text-lg font-medium bg-teal-700 p-2 rounded-lg">
                    <Link href={'/signup'} >Đăng ký</Link>
                </div>
            </div>
        </div>
    )
}

export default Header