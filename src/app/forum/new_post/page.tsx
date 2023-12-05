'use client'

import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import UserContext from "../../UserContext";
import Grid from '@mui/material/Unstable_Grid2';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { TextEditor } from "../page";
import { API_PATH } from "@/app/page";

const NewPost = () => {
    const user = useContext(UserContext)
    const [titleValue, setTitleValue] = useState('')
    const [contentValue, setContentValue] = useState('')
    const [openModal, setOpenModal] = useState(false)

    const handleContentChange = (value: any) => {
        setContentValue(value)
    }

    const createPost = () => {
        console.log(titleValue)
        console.log(contentValue)
        fetch(API_PATH + 'post/create', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post_title: titleValue,
                post_content: contentValue, 
                user_id: user.user.userID
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.status)
        })
    }

    return (
        <div className="mt-6 w-1/2 flex flex-col justify-center m-auto">
            <div className="flex justify-between">
                <div className="text-3xl font-semibold mb-10">Tạo bài viết mới</div>
                <button 
                    className="bg-slate-500 hover:bg-slate-600 active:bg-slate-800 text-white font-semibold shadow-lg px-2.5 py-1.5 rounded-md mb-10 "
                    onClick={createPost}
                    >
                    Xác nhận
                </button>
            </div>
            <div className="text-xl font-semibold mb-5 ">Tiêu đề: </div>
            <input 
                type="text" 
                value={titleValue} 
                onChange={(e) => setTitleValue(e.target.value)} 
                className="text-textcolor font-bold text-2xl w-full px-3 py-2.5 h-max border rounded mb-5 "
                placeholder="Tiêu đề..."
                />
            <div className=" mb-5 text-xl font-semibold">Nội dung: </div>
            <TextEditor value={contentValue} placeholder={'Nhập nội dung...'} onChange={(value) => handleContentChange(value)} />
        </div>
    )
}

export default NewPost