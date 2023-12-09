import React, { useContext, useEffect, useState, useRef } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import UserContext from "../UserContext";
import { API_PATH } from "../CustomInterface";
import { useRouter } from "next/navigation";
import { convertToVNmese } from "../CustomInterface";
import TutorType from "../CustomInterface";
import Timetable from "./Timetable";



interface Props {
    tutor: any,   
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

const TutorInfoCard = ({tutor}: Props) => {
    const router = useRouter()
    const [fullAddress, setFullAddress] = useState<String>()
    const [classFullAddress, setClassFullAddress] = useState<String>()
    const [subjects, setSubjects] = useState<string>()
    const [openModal, setOpenModal] = useState(false)
    const agreementRef = useRef<HTMLInputElement>(null)
    const payLaterRef = useRef<HTMLInputElement>(null)
    const payImmediateRef = useRef<HTMLInputElement>(null)
    const confirmButtonRef = useRef<HTMLButtonElement>(null)
    const [paid, setPaid] = useState(false)
    const [checkingPayment, setCheckingPayment] = useState(false)

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
            setSubjects(() => {
                const result = new Array()
                data.subject[0].forEach((s: any) => {
                    if (!result.includes(s.name)) {
                      result.push(s.name)
                    }
                  })
                  return result.join(' / ')        
            })
            // console.log(data.subject)
        })

        // payLaterRef.current && (payLaterRef.current.checked = false)
    }, [tutor])

    // const getAllSubject = () => {
    //     const result = new Array()
    //     if (subjects) {
    //       subjects.forEach((s: any) => {
    //         if (!result.includes(s.name)) {
    //           result.push(s.name)
    //         }
    //       })
    //       return result.join(' / ')
    
    //     }
    //     return 0
    // }

    const choosetutor = () => {
        
    }

    const test = () => {
        console.log('hihihoho')
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        // window.location.reload()
    }

    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));

    return (
        <div className="mt-10">
            <Grid container spacing={3} >
                <Grid xs={3} className='flex flex-col items-start' >
                    <div className="mt-1"><img src={tutor.avatar} alt="" className="w-full" /></div>
                    <div className="mt-1"><span className="italic">Họ tên: </span>{tutor.name}</div>
                    <div className="mt-1"><span className="italic">Giới tính: </span>{convertToVNmese(tutor.gender)}. <span className="italic" >Ngày sinh: </span>{tutor.birth.slice(0, 10)}</div>
                    <div className="mt-1"><span className="italic">Địa chỉ: </span>{fullAddress}</div>

                </Grid>
                <Grid xs={5}>
                    <div className="mt-1"><span className="italic">Gia sư môn </span>{subjects}</div>
                    <div className="mt-1"><span className="italic">Có thể dạy:</span> {tutor.skillRange.map((e: any) => convertToVNmese(e)).join(' / ')}</div>
                    <div className="mt-1"><span className="italic">Học vấn: </span>{tutor.specialized}, {tutor.school}</div>
                    <div className="mt-1"><span className="italic">Nghề nghiệp hiện nay:</span> {convertProperties(tutor.job)}</div>
                    <div className="mt-1"><span className="italic">Thông tin khác:</span> {tutor.description}</div>

                </Grid>
                <Grid xs={4} className='flex items-center pb-20' >
                    <div className="w-full">
                        <div className="mb-4 ml-4">Thời gian có thể dạy</div>
                        <Timetable timetable={tutor.schedule} />
                    </div>
                </Grid>
                <Grid xs={1}>
                </Grid>
            </Grid>
            <hr />
        </div>
    )
}

export default TutorInfoCard