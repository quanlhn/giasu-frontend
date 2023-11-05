'use client'

import React from "react";
import { useContext, useState, useEffect } from 'react'
import UserContext from "../UserContext";
import Grid from '@mui/material/Unstable_Grid2';
import { API_PATH } from "../page";
import Cookies from 'js-cookie'
import { convertToVNmese } from "../class/page";
import { Timetable } from "../class/page";
import { useRouter } from 'next/navigation'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const MyAccount = () => {
    const user = useContext(UserContext)
    const [requestClasses, setRequestClasses] = useState<Array<any>>()
    const [shownTutors, setShownTutors] = useState<Array<any>>()
    const [currentClass, setCurrentClass] = useState<any>()

    useEffect(() => {
        const cookie = Cookies.get('accessToken')
        fetch(API_PATH + 'parents/get-requestClass-of-parents', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'x_authorization': `${cookie}`,
            },
            body: JSON.stringify({
                parentID: user.user.userID
            })
        })
        .then(res => res.json())
        .then(data => {
            setRequestClasses(data.classes)
        })
    }, [user])

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const showTutors = (requestClass: any) => {
        // console.log(requestClass)
        setCurrentClass(requestClass)
        fetch(API_PATH + 'class/getTutorsByRequestClassId', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: requestClass.reqId
            })
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data.tutors)
            setShownTutors(data.tutors)
        })
    }
    
    return (
        <div className="pt-16 mx-10">
            <Grid container spacing={10}>
                <Grid xs={2}>
                    <div className="nameTag-dropdown relative ">
                        <div className="w-full font-semibold">Lớp chờ nhận gia sư</div>
                        <ul className=" absolute right-5">
                            {requestClasses && requestClasses.map((r_class, index) => (
                                <li className="text-sm text-right cursor-pointer" onClick={(e) => showTutors(r_class)} key={index}>
                                    {convertToVNmese(r_class.studentGender)}, {r_class.name} {r_class.grade} 
                                </li>
                            ))}
                        </ul>
                    </div>
                </Grid>
                <Grid xs={10}>
                    {shownTutors && shownTutors.map((tutor, index) => (
                        <TutorCard tutor={tutor} parents={user.user} requestclass={currentClass} key={index}  />
                    ))}
                </Grid>
            </Grid>
        </div>
    )
}

interface Props {
    tutor: any,
    parents: any,
    requestclass: any
}

const convertProperties = (text: string) => {
    switch (text) {
      case "1YearStudent": 
        return 'Sinh viên năm nhất'
      case "2YearStudent": 
        return 'Sinh viên năm nhất'
      case "3YearStudent": 
        return 'Sinh viên năm nhất'
      case "4YearStudent": 
        return 'Sinh viên năm nhất'
      case "teacher": 
        return 'Giáo viên'
      case "lecturer": 
        return 'Giảng viên'
    }
}

const TutorCard = ({tutor, parents, requestclass}: Props) => {
    const router = useRouter()
    const [fullAddress, setFullAddress] = useState<String>()
    const [subjects, setSubjects] = useState<Array<any>>()
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        
        fetch(API_PATH + 'address/get-full-address', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wardCode: tutor.address,
            })
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data.address)
            // console.log(data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name)
            setFullAddress(data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name)
        })

        fetch(API_PATH + 'tutor/getSubjectsOfTutors', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: tutor.subjectIds,
            })
        })
        .then(res => res.json())
        .then(data => {
            setSubjects(data.subject)
        })
    }, [])

    const getAllSubject = () => {
        const result = new Array()
        if (subjects) {
          subjects.forEach((s: any) => {
            if (!result.includes(s.name)) {
              result.push(s.name)
            }
          })
          return result.join(' / ')
    
        }
        return 0
    }

    const choosetutor = () => {
        fetch(API_PATH + 'class/create-class', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent_id: requestclass.parentID,
                tutor_id: tutor.userID,
                request_class_id: requestclass.reqId,
                address: fullAddress,
                detail_address: '',
                price: requestclass.salary,
                frequency: requestclass.frequency,
            })
        })
        .then(res => res.json())
        .then(data => console.log(data))

        fetch(API_PATH + 'class/update-requestClass-status', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: requestclass.reqId
            })
        })
        .then(res => res.json())
        .then(data => {
            setOpenModal(true)
        })
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        window.location.reload()
    }


    return (
        <div>
            <Grid container spacing={4} >
                <Grid xs={3} className='flex flex-col items-start' >
                    <div className="mt-1"><img src={tutor.avatar} alt="" className="w-full" /></div>
                    <div className="mt-1"><span className="italic"> Họ tên: </span>{tutor.name}</div>
                    <div className="mt-1"><span className="italic">Giới tính: </span>{convertToVNmese(tutor.gender)}. <span className="italic" >Ngày sinh: </span>{tutor.birth.slice(0, 10)}</div>
                    <div className="mt-1"><span className="italic">Địa chỉ: </span>{fullAddress}</div>

                </Grid>
                <Grid xs={5}>
                    <div className="mt-1"><span className="italic">Gia sư môn </span>{getAllSubject()}</div>
                    <div className="mt-1"><span className="italic">Có thể dạy:</span> {tutor.skillRange.split(',').map((e: any) => convertToVNmese(e)).join(' / ')}</div>
                    <div className="mt-1"><span className="italic">Học vấn: </span>{tutor.specialized}, {tutor.school}</div>
                    <div className="mt-1"><span className="italic">Nghề nghiệp hiện nay:</span> {convertProperties(tutor.job)}</div>
                    <div className="mt-1"><span className="italic">Thông tin khác:</span> {tutor.description}</div>

                </Grid>
                <Grid xs={4} className='flex flex-col items-center justify-between ' >
                    <Timetable timetable={tutor.schedule} />
                    <button onClick={choosetutor} className="bg-slate-500 text-white font-semibold shadow-lg px-2.5 py-1.5 rounded-md mb-10 ">Chọn gia sư</button>
                </Grid>
                <Grid xs={1}>
                </Grid>
            </Grid>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white w-max px-6 py-4 translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 absolute rounded-xl">
                    Chọn gia sư thành công
                    <Button variant="outlined" onClick={handleCloseModal} className="my-2">Ok</Button> 
                </div>
            </Modal>
        </div>
    )
}

export default MyAccount