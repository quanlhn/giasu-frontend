'use client'

import React from "react";
import Link from "next/link";
import { Button, ButtonGroup } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import UserContext from "./UserContext";
import { API_PATH } from "./CustomInterface";
import Cookies from 'js-cookie'
import path from "path";
import NotificationAddIcon from '@mui/icons-material/NotificationAdd';
import Popover from '@mui/material/Popover';

const Header = () => {
    const [userName, setUserName] = useState('')
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>()
    const [notices, setNotices] = useState<Array<Notice>>()

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

            if (userContext.user.userID != 0) {
                fetch(API_PATH + 'notice/get-notice-by-userid', {
                    method: 'POST',
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userContext.user.userID
                    })       
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data.notices)
                    setNotices(data.notices)
                })
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

    const openPopover = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    
      const closePopover = () => {
        setAnchorEl(null);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const readNotice = (notice: any) => {
        fetch(API_PATH + 'notice/read-notice', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: notice.id
            })
        })
        .then(res => res.json())
        .then(data => {
            setNotices(() => {
                let array = new Array<Notice>()
                notices?.forEach((_notice, index) => {
                    if (_notice.id == data.notice.id) {
                        array.push(data.notice)
                    } else {
                        array.push(_notice)
                    }
                })
                return array
            })
        })
    }

    return (
        <div className="flex py-4 px-12 items-center justify-between bg-headerbg rounded-b-2xl">
            <div className="logo text-3xl">
                <div className="text-teal-700 text-3xl font-extrabold self-center my-auto">
                    <Link href={'/'}>GIA SƯ TÍN</Link>
                </div>
            </div>
            <div className="nav flex gap-16 items-center">
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
                        <Link className="text-slate-800 text-lg font-medium tracking-wide relative" href={'/forum'} >Diễn đàn</Link>
                    </div>
            </div>
            <div >
                {userName != '' ? 
                    <div className="flex items-center">
                        <div>
                            
                        </div>
                        <NotificationAddIcon onClick={(event) => openPopover(event)} className="text-teal-700 cursor-pointer mr-3" />
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={closePopover} 
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                        >
                            {notices 
                            ?
                                <ul className='w-[300px] px-2 py-1 text-base text-textcolor '>
                                    {notices.map((notice, index) => {
                                        return <li key={index} onClick={() => readNotice(notice)} className="mt-1 p-1 hover:bg-slate-200 active:bg-slate-400 rounded-md">
                                                <Link href={notice.pathto}>{notice.content}</Link>
                                                <div className="italic text-sm text-end">{notice.isRead==0 ? 'Chưa đọc' : 'Đã đọc'}</div>
                                                <hr />
                                            </li>
                                    })}
                                </ul>
                            :
                                <div className="w-[300px] px-2 py-1 text-base text-textcolor">Không có thông báo </div>
                            }
                        </Popover>
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

interface Notice {
    isRead: number;
    id: number,
    userId: number,
    content: string,
    pathto: string,
    createdAt: string,
    updatedAt: string

}

export default Header