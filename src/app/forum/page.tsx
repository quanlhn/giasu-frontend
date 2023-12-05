'use client'

import React from "react";
import { useState, useContext, useEffect, useRef } from "react";
import UserContext from "../UserContext";
import Grid from '@mui/material/Unstable_Grid2';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { API_PATH } from "../page";

const Forum = () => {
    const user = useContext(UserContext)
    const [titleValue, setTitleValue] = useState('')
    const [contentValue, setContentValue] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const [posts, setPosts] = useState<Array<any>>()

    useEffect(() => {
        fetch(API_PATH + 'post')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setPosts(data)
        })
    }, [])
    
    const handleCloseModal = () =>{
        setOpenModal(false)
        window.location.reload()
    }

    const handleContentChange = (value: any) => {
        setContentValue(value)
    }


    return (
        <div className="mt-12 mx-12">
            <Grid container spacing={3} >
                <Grid xs={9} >
                {posts 
                ?
                (posts.map((post, index) => (
                    <Post postInfo={posts[index]} key={index} />
                )))
                :
                <div>

                </div>
                }

                </Grid>
                <Grid xs={3}>
                    <div>Tạo bài viết mới <span className="italic text-sky-500 cursor-pointer" onClick={() => setOpenModal(true)}>tại đây</span></div>
                </Grid>
            </Grid>
        </div>
    )
}

interface PostProps {
    postInfo: any
}

const LIKE = 'like'
const DISLIKE = 'dislike'

const Post = ({postInfo}: PostProps) => {
    const user = useContext(UserContext)
    const [vote, setVote] = useState(0)
    const [detailPost, setDetailPost] = useState()

    useEffect(() => {
        fetch(API_PATH + `post/${postInfo.post_id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setDetailPost(data)
            setVote(data.postData[0].likeCount - data.postData[0].dislikeCount)
        })
    }, [])

    useEffect(() => {
        fetch(API_PATH + `post/${postInfo.post_id}`)
        .then(res => res.json())
        .then(data => {
            setDetailPost(data)
        })
    }, [vote])

    const createVote = (voteType: string) => {
        fetch(API_PATH + `post/${postInfo.post_id}/${voteType}`, {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.user.userID
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message == 'deleted') {
                if (voteType == DISLIKE) {
                    setVote(() => vote + 1)
                } else {
                    setVote(() => vote - 1)
                }
            } else if (data.message == 'updated') {
                if (voteType == DISLIKE) {
                    setVote(() => vote - 2)
                } else {
                    setVote(() => vote + 2)
                }
                
            } else if (data.message == 'created') {
                if (voteType == DISLIKE) {
                    setVote(() => vote - 1)
                } else {
                    setVote(() => vote + 1)
                }
            }
        })

        // if (voteType === 'like') {
        //     setVote(() => vote + 1)
        // } else {
        //     vote
        // }

    }


    return (
        <div>
            <Grid container spacing={3} >
                <Grid xs={3} className="" >
                    <div className="flex flex-col items-center justify-center pt-20">
                        <div onClick={() => createVote(LIKE)}>
                            <KeyboardArrowUpIcon className="text-5xl bg-black/20 rounded-full cursor-pointer hover:bg-black/30 active:bg-black/40 " />
                        </div>
                        <div className="text-2xl my-4 font-semibold">{vote}</div>
                        <div onClick={() => createVote(DISLIKE)}>
                            <KeyboardArrowDownIcon className="text-5xl bg-black/20 rounded-full cursor-pointer hover:bg-black/30 active:bg-black/40 " />
                        </div>
                    </div>
                </Grid>
                <Grid xs={9}>
                    <div className="">
                    <div className="mb-12">
                        <div className="title text-textcolor font-bold text-3xl">{postInfo.post_title}</div>
                        <div className="flex justify-between mt-4 items-center">
                            <div className="flex justify-center items-center">
                                <img src="avatar.JPG" className="w-[35px] h-[35px] mr-3 rounded-full" />
                                <div>{postInfo.User.name}</div>
                            </div>
                            <div><span className="text-black/50">Đăng vào ngày </span>{postInfo.createdAt}</div>
                            <div><span className="text-black/50">Chỉnh sửa ngày </span>{postInfo.updatedAt}</div>
                        </div>
                        <div className="mt-10">
                            <div dangerouslySetInnerHTML={{__html: postInfo.post_content}} />
                        </div>
                        <hr />
                    </div>
                        
                    </div>

                </Grid>
            </Grid>
        </div>
       
    )
}

const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "code"],
      ["clean"],
    ],
  };
   
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "code",
  ];
   
  interface OnChangeHandler {
    (e: any): void;
  }
   
  type Props = {
    value: string;
    placeholder: string;
    onChange: OnChangeHandler;
  };
   
  export const TextEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
    return (
      <>
        <ReactQuill
          theme="snow"
          value={value || ""}
          modules={modules}
          formats={formats}
          onChange={onChange}
          placeholder={placeholder}
          className="h-96 bg-white"
        />
      </>
    );
  };

export default Forum