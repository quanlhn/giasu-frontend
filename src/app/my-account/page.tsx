'use client'

import React from "react";
import { useContext, useState, useEffect, useRef } from 'react'
import UserContext from "../UserContext";
import Grid from '@mui/material/Unstable_Grid2';
import { API_PATH } from "../CustomInterface";
import Cookies from 'js-cookie'
import { convertToVNmese } from "../CustomInterface";
import Timetable from "../components/Timetable";
import { useRouter } from 'next/navigation'
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ClassIcon from '@mui/icons-material/Class';
import { userAgent } from "next/server";


const MyAccount = () => {
    const user = useContext(UserContext)
    return (
        <div>
            {user 
            ?
            <div>
                {
                    user.user.role == "tutor"
                    ?
                    <div>
                        <TutorAccount />
                    </div>
                    :
                    <div>
                        <ParentAccount />
                    </div>
                }
            </div>
            :
            <div>
                Please signin
            </div>
            }
        </div>
    )
}


const TutorAccount = () => {

    const APPLIED_CLASS_STATUS = 'appliedClass'
    const TEACHING_CLASS_STATUS = 'teachingClass'

    const user = useContext(UserContext)
    const appliedClass = useRef<HTMLDivElement>(null);
    const teachingClass = useRef<HTMLDivElement>(null);
    const [currentTab, setCurrentTab] = useState(APPLIED_CLASS_STATUS)
    const [classes, setClasses] = useState<Array<any>>()

    const switchTab = (event: any) => {
        if (event.currentTarget == appliedClass.current) {
            teachingClass.current?.classList.remove("text-apple")
            appliedClass.current?.classList.add("text-apple")
            setCurrentTab(APPLIED_CLASS_STATUS)
        } else {
            appliedClass.current?.classList.remove("text-apple")
            teachingClass.current?.classList.add("text-apple")
            setCurrentTab(TEACHING_CLASS_STATUS)
        }
    }

    useEffect(() => {
        fetch(API_PATH + 'tutor/get-applied-class-of-tutor', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tutorId: user.user.userID
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.classes)
            setClasses(data.classes)
        })
    }, [user])
    


    return(
        <div className="pt-16 mx-6">
            <Grid container spacing={10}>
                <Grid xs={2}>
                    <div className="nameTag-dropdown relative">
                        <div>
                            <div className="w-full font-semibold hover:cursor-pointer text-apple" ref={appliedClass} onClick={(event) => switchTab(event)}>Lớp đã đăng ký</div>
                        </div>
                        
                        <div>
                            <div className="w-full font-semibold hover:cursor-pointer" ref={teachingClass} onClick={(event) => switchTab(event)}>Lớp đang dạy</div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={10}>
                    {classes && 
                        (currentTab==APPLIED_CLASS_STATUS ?
                        (classes.map((t_class, index) => {
                            if (t_class.status == "confirming") {
                                return <ClassOfTutor key={index} classOfTutor={t_class} />
                            }
                        }))
                        :
                        (classes.map((t_class, index) => {
                            if (t_class.status == "confirmed") {
                                return <ClassOfTutor key={index} classOfTutor={t_class} />
                            }
                        }))
                        )
                    }
                </Grid>
            </Grid>
        </div>
    )
}

interface ClassOfTutorProps {
    classOfTutor: any,
}

const ClassOfTutor = ({classOfTutor}: ClassOfTutorProps) => {
    const user = useContext(UserContext)
    const [fullAddress, setFullAddress] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()
    
    
    useEffect(() => {
        fetch(API_PATH + 'address/get-full-address', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wardCode: classOfTutor.address,
            })
        })
        .then(res => res.json())
        .then(data => {
            setFullAddress(data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name)
        })
    }, [])

    const cancelClass = () => {
        fetch(API_PATH + 'tutor/cancel-request-class', {
            method: 'DELETE',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: classOfTutor.t_r_c_id
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.status)
        })
        setOpenModal(true)
    }

    const handleCloseModal = () =>{
        setOpenModal(false)
        window.location.reload()
    }

    return (
        <div className="mt-10">
            <Grid container spacing={3} className='mt-10 items-center bg-slate-100 rounded-md px-5 py-2 drop-shadow' >
                <Grid xs={6}>
                    <div className="flex">
                        <div className="mr-1">Học sinh {convertToVNmese(classOfTutor.studentGender)}, </div>
                        <div>{convertToVNmese(classOfTutor.skill)}</div>
                    </div>
                    <div><span className="font-semibold">Yêu cầu:</span> Gia sư {convertToVNmese(classOfTutor.requiredGender)}</div>
                    <div><span className="font-semibold">Môn học:</span> {classOfTutor.subject} {classOfTutor.grade}</div>
                    <div><span className="font-semibold">Địa chỉ: </span>{classOfTutor.detailAddress} {fullAddress}</div>
                    <div><span className="font-semibold">Học phí: </span> {classOfTutor.salary.toLocaleString("de-DE")}đ/buổi  -  {classOfTutor.frequency}buổi/tuần</div>
                    <div><span className="font-semibold">Tính cách học sinh: </span>{convertToVNmese(classOfTutor.studentCharacter)}</div>
                    <div><span className="font-semibold">Yêu cầu khác:</span> {classOfTutor.otherRequirement}</div>
                </Grid>
                <Grid xs={4} >
                    <div className="mb-4">Thời gian dạy:</div>
                    <Timetable timetable={classOfTutor.schedule}  />
                </Grid>
                <Grid xs={2} >
                    <div className="w-full h-full items-center justify-center flex">
                        {classOfTutor.status=='confirming' 
                        ? 
                        <div>
                            <button onClick={cancelClass} className="bg-slate-500 text-white font-semibold shadow-lg px-2.5 py-1.5 rounded-md mb-10 ">Hủy đăng ký</button>

                        </div>
                        :
                        <div></div>
                        }
                    </div>
                </Grid>
            </Grid>
            <hr />
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white w-max px-6 py-4 translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 absolute rounded-xl">
                    {/* <div className="text-2xl">Cảm ơn bạn đã lựa chọn <span className="text-teal-700 font-semibold">Gia Sư Tín</span></div> */}
                    <h4>Hủy đăng ký thành công</h4>
                    <Button variant="outlined" onClick={handleCloseModal} className="my-2">Ok</Button> 
                </div>
            </Modal>
        </div>
    )
}


const ParentAccount = () => {
    const user = useContext(UserContext)
    const [requestClasses, setRequestClasses] = useState<Array<any>>()
    const [confirmedClasses, setConfirmedClasses] = useState<Array<any>>()

    const [shownTutors, setShownTutors] = useState<Array<any>>()
    const [currentClass, setCurrentClass] = useState<any>()
    const listRef = useRef<(HTMLLIElement[])>([])
    const classRef = useRef<(HTMLDivElement)>(null)

    const [showRequestClass, setShowRequestClass] = useState(true)

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
            console.log(data.classes)
            setRequestClasses(data.classes)
        })

        fetch(API_PATH + 'parents/get-class-by-id', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'x_authorization': `${cookie}`,
            },
            body: JSON.stringify({
                id: user.user.userID
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.classes)
            setConfirmedClasses(data.classes)
        })
    

    }, [user])

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const showClassInfo = () => {
        const cookie = Cookies.get('accessToken')
        listRef.current && listRef.current.forEach(ref => {
            if (ref.classList.contains('text-apple')) {
                ref.classList.remove('text-apple');
                ref.classList.remove('font-semibold')
            }
        })
        classRef.current?.classList.add('text-apple');
        classRef.current?.classList.add('font-semibold');
        setShowRequestClass(false)

    }

    const showTutors = (requestClass: any, index: number) => {
        setShowRequestClass(true)
        listRef.current.forEach(ref => {
            if (ref.classList.contains('text-apple')) {
                ref.classList.remove('text-apple');
                ref.classList.remove('font-semibold')
            }
        })
        
        classRef.current?.classList.remove('text-apple');
        classRef.current?.classList.remove('font-semibold');

        listRef.current[index].classList.add('text-apple');
        listRef.current[index].classList.add('font-semibold');


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
        <div className="pt-16 mx-6">
            <Grid container spacing={10}>
                <Grid xs={2}>
                    <div className="nameTag-dropdown relative ">
                        <div>
                            <div className="w-full font-semibold">Lớp chờ nhận gia sư</div>
                            <ul className="flex flex-col items-end ">
                                {requestClasses && requestClasses.map((r_class, index) => (
                                    <li 
                                        className="text-sm text-right cursor-pointer m-3 border-b-2 flex items-center" 
                                        onClick={(e) => showTutors(r_class, index)} 
                                        ref={(el: HTMLLIElement) => listRef.current[index] = el}
                                        key={index}
                                        >
                                        <ClassIcon className="text-base mr-1"></ClassIcon>
                                        <div className="">{capitalizeFirstLetter(convertToVNmese(r_class.studentGender))}, {r_class.name} {r_class.grade} </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <div className="w-full font-semibold hover:cursor-pointer" ref={classRef} onClick={showClassInfo} >Lớp đang học</div>
                        </div>
                    </div>
                </Grid>
                <Grid xs={10}>
                
                    {
                        showRequestClass 
                        ?
                        (shownTutors && shownTutors.map((tutor, index) => (
                            <TutorCard tutor={tutor} parents={user.user} requestclass={currentClass} key={index}  />
                        )))
                        :
                        (confirmedClasses?.map((confirmedClass, index) => (
                            <ClassInfoCard confirmedClass={confirmedClass} />
                        )))
                    }
                </Grid>
            </Grid>
        </div>
    )
}

interface ClassInfoProps {
    confirmedClass: any
}

const ClassInfoCard = ({confirmedClass}: ClassInfoProps) => {
    const [tutor, setTutor] = useState<any>()
    const [requestClass, setRequestClass] = useState<any>()

    useEffect(() => {
        fetch(API_PATH + 'tutor/get-tutor', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: confirmedClass.tutor_id
            })            
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.tutor)
            setTutor(data.tutor)
        })

        fetch(API_PATH + 'class/get-requestClass-by-requestId', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: confirmedClass.request_class_id
            })            
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.requestClass)
            setRequestClass(data.requestClass)
        })

    }, [])

    return (
        <div>
            {tutor && requestClass
            ? 
            <Grid container spacing={3} >
                <Grid xs={3} className='flex flex-col items-start' >
                    <div className="mt-1"><img src={tutor['avatar']} alt="" className="w-full" /></div>
                    <div className="mt-1"><span className="italic">Họ tên: </span>{tutor.name}</div>
                    <div className="mt-1"><span className="italic">Giới tính: </span>{convertToVNmese(tutor.gender)}. <span className="italic" >Ngày sinh: </span>{tutor.birth.slice(0, 10)}</div>
                    <div className="mt-1"><span className="italic">Địa chỉ: </span>{}</div>

                </Grid>
                <Grid xs={5}>
                    <div className="mt-1"><span className="italic">Gia sư môn </span></div>
                    <div className="mt-1"><span className="italic">Có thể dạy:</span> {tutor.skillRange.split(',').map((e: any) => convertToVNmese(e)).join(' / ')}</div>
                    <div className="mt-1"><span className="italic">Học vấn: </span>{tutor.specialized}, {tutor.school}</div>
                    <div className="mt-1"><span className="italic">Nghề nghiệp hiện nay:</span> {convertProperties(tutor.job)}</div>
                    <div className="mt-1"><span className="italic">Thông tin khác:</span> {tutor.description}</div>

                </Grid>
                <Grid xs={4}>
                    <div className="mt-6">
                        <div className="text-xl text-textcolor font-semibold">Thông tin lớp học:</div>
                        <Grid container spacing={2}>
                            <Grid xs={5}>
                                <div className="mt-2">
                                    Học sinh {convertToVNmese(requestClass.studentGender)}. 
                                </div>
                                <div className="mt-2">Lớp: {requestClass.grade} </div>
                                <div className="mt-2">Thời gian học: {requestClass.frequency}/tuần. </div>
                            </Grid>
                            <Grid xs={5}>
                                <div className="mt-2">Môn học: {requestClass.name} </div>
                                <div className="mt-2">SĐT: {requestClass.phone}</div>
                                <div className="mt-2">Học phí {requestClass.salary.toLocaleString("de-DE")}đ/buổi</div>
                            </Grid>
                        </Grid>
                        <div className="mt-2">Địa chỉ: {requestClass.detailAddress}</div>
                    </div>
                </Grid>
            </Grid>
            :
            <div>Không có lớp thỏa mãn</div>
            }
        </div>
    )
}

interface Props {
    tutor: any,
    parents: any,
    requestclass: any,
    
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
    const [classFullAddress, setClassFullAddress] = useState<String>()
    const [subjects, setSubjects] = useState<Array<any>>()
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

        fetch(API_PATH + 'address/get-full-address', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wardCode: requestclass.address,
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(tutor.address)
            console.log(requestclass.address)
            setClassFullAddress(data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name)
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

        // payLaterRef.current && (payLaterRef.current.checked = false)
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
        console.log('hihi')
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
                detail_address: requestclass.detailAddress,
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
            handleCloseModal1()
        })

        getContract()
    }

    const test = () => {
        console.log('hihihoho')
    }

    const getContract = () => {
        const _tutor = {
            name: tutor.name,
            phone: tutor.phone,
            address: fullAddress,
            job: convertToVNmese(tutor.job)
        }
        const _parent = {
            name: requestclass.parentName,
            phone: requestclass.phone,
            address: `${requestclass.detailAddress}, ${classFullAddress}`,
        }
        const _classInfo = {
            subject: requestclass.name,
            schedule: `${requestclass.frequency}b/tuần`,
            price: `${requestclass.salary.toLocaleString("de-DE")}đ/buổi`,
            time_per_day: '2h/buổi'
        }

        fetch(API_PATH + 'class/get_contract', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tutor: _tutor,
                parent: _parent,
                classInfo: _classInfo
            })
        }).then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]))
            const link = document.createElement('a')
            link.href = url
            link.download = 'contract.pdf'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        })  
        .catch((err) => {
            console.log('Error downloading PDF: ' + err)
        })
        
    }

    const handleCloseModal1 = () => {
        setOpenModal(false)
        // window.location.reload()
    }

    const agreementRefChange = () => {
        if (agreementRef.current?.checked) {
            if (confirmButtonRef.current) {
                confirmButtonRef.current.disabled = false
            }
        } else {
            confirmButtonRef.current && (confirmButtonRef.current.disabled = true)
        }
    }

    const payLaterRefChange = () => {
        if (payLaterRef.current?.checked) {
            payImmediateRef.current && (payImmediateRef.current.checked = false)
        } else {
            payImmediateRef.current && (payImmediateRef.current.checked = true)
        }
    }

    const payImmediateRefChange = () => {
        if (payImmediateRef.current?.checked) {
            payLaterRef.current && (payLaterRef.current.checked = false)
        } else {
            payLaterRef.current && (payLaterRef.current.checked = true)
        }
    }

    const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));


    return (
        <div>
            <Grid container spacing={3} >
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
                    <button onClick={() => setOpenModal(true)} className="bg-slate-500 text-white font-semibold shadow-lg px-2.5 py-1.5 rounded-md mb-10 ">Chọn gia sư</button>
                </Grid>
                <Grid xs={1}>
                </Grid>
            </Grid>
            <Modal
                open={openModal}
                onClose={handleCloseModal1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                
            >
                <div className="bg-white w-[64rem] h-max px-4 py-4 translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 absolute rounded-xl">
                    <div className="text-3xl text-textcolor">Xác nhận thông tin và thanh toán</div>
                    <Grid container spacing={8}>
                         <Grid xs={6} >
                            <div className="mt-6 text-textcolor text-xl font-semibold">Các điều khoản trong hợp đồng:</div>
                            <div className="overflow-auto w-full h-[32rem] ml-4 mt-3 px-3 py-2 border text-justify">
                                <div className="rule1">
                                    <div className="font-bold">1. Mức phí nhận lớp</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Bên B phải thanh toán cho Bên A 40% số lương một tháng đủ khi nhận lớp
                                                dạy với số tiền là: {(requestclass.frequency * 4 * requestclass.salary * 40 / 100).toLocaleString("de-DE")}đ
                                            </li>
                                            <li>
                                                Tổng số tiền bên B đã nộp là: 0đ. Hẹn đến ngày 32/12/2023 nộp hết!
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="rule2">
                                    <div className="font-bold">2. Nghĩa vụ của Gia sư Tín</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Cung cấp cho bên Phụ huynh thông tin chính xác: Họ tên, số điện thoại, địa chỉ
                                                Gia sư và hẹn lịch dạy cho Phụ huynh trong thời gian tối đa 10 ngày kể từ
                                                ngày Ký hợp đồng.
                                            </li>
                                            <li>
                                                Đảm bảo quyền lợi của bên Phụ huynh nếu phát sinh các vấn đề liên quan đến việc
                                                hủy lớp (chi tiết tại điều 5) trong thời gian có hiệu lực của hợp đồng.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="rule3">
                                    <div className="font-bold">3. Nghĩa vụ của bên Phụ huynh</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Thanh toán tiền phí cho bên Gia sư Tín đầy đủ và đúng hạn.
                                            </li>
                                            <li>
                                                Đảm bảo giờ học cho Gia sư đúng lịch. (Nếu vì một lý do nào đó mà
                                                phải nghỉ học phải điện thoại báo trước cho Gia sư ít nhất là 3 giờ).
                                            </li>
                                            <li>
                                                Giữ bí mật về những thông tin của gia cảnh Gia sư
                                            </li>
                                            <li>
                                                Trường hợp học phí và số lượng buổi học (tăng/giảm) được Gia sư và Phụ
                                                huynh trao đổi lại với nhau sau khi nhận lớp. Bên Phụ huynh phải thông báo lại cho
                                                Trung tâm (muộn nhất sau 48h). Để Trung tâm tiến hành xác minh và tính lại mức phí
                                                nhận lớp. Sau 48h có thông tin mà Bên Phụ huynh không thông báo, Bên Trung tâm sẽ áp dụng
                                                mức tính phí nhận lớp như ban đầu.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="rule4">
                                    <div className="font-bold">4. Các vấn đề liên quan đến hủy lớp</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Nếu Gia sư dạy không đạt (về cả kiến thức và kỹ năng), Học sinh không
                                                tiếp thu được hoặc Gia sư chuẩn bị bài không tốt trong 1 hoặc 2 buổi dạy
                                                thử thì Bên Trung tâm sẽ hoàn phí 100%.
                                            </li>
                                            <li>
                                                Nếu bên gia sư dạy chưa đủ 100% tổng số buổi/tháng. Phụ huynh yêu cầu ngừng
                                                dạy và vẫn thanh toán tiền lương. Bên A sẽ xác minh và dựa vào mức học phí
                                                Phụ huynh thanh toán với Gia sư, để tiến hành tính lại Phí nhận lớp của
                                                Gia sư.
                                                <div>(Mức tính Phí: 40% lương một tháng)</div>
                                            </li>
                                            <li>
                                                Nếu bên Gia sư đã dạy được số buổi lớn hơn tổng số buổi/tháng (lớn hơn từ 1
                                                - 2 buổi) mà bên Phụ huynh yêu cầu ngừng dạy và vẫn thanh toán đầy đủ tiền
                                                lương. Bên Trung tâm sẽ xác minh và giảm 5% mức phí nhận lớp tại lần thứ 2:
                                                <ul className="pl-6">
                                                    <li>Tương đương với 35% lương một tháng</li>
                                                    <li>
                                                        Trường hợp này sẽ không tính lại Phí ở điều 2 và áp dụng cho cả Sinh
                                                        viên và Giáo viên.
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Những trường hợp không hoàn lại phí: Những lý do cá nhân Bên B tự ý bỏ lớp.
                                            </li>
                                            
                                        </ul>
                                    </div>
                                </div>
                                <div className="rule5">
                                    <div className="font-bold">5. Hoàn trả phí nhận lớp</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Dựa theo các khoản mục của điều 5, Bên A sẽ giải quyết Hoàn phí vào tất cả
                                                các buổi chiều trong tuần. Trường hợp ngày giải quyết Hợp đồng trùng với
                                                ngày nghỉ, ngày lễ Bên Trung tâm sẽ giải quyết vào ngày làm việc kế tiếp. Khi đến
                                                giải quyết hợp đồng Bên Gia sư cần mang theo Hợp đồng, Phiếu thu liên 2 để làm
                                                căn cứ trong việc hoàn lại phí nhận lớp.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="rule6">
                                    <div className="font-bold">6. Thời gian có hiệu lực của hợp đồng</div>
                                    <div className="px-3">
                                        <ul className="list-disc">
                                            <li>
                                                Hợp đồng có hiệu lực kể từ ngày ký và có hiệu lực trong 60 ngày, được lập
                                                thành hai bản, mỗi bên giữ một bản để theo dõi thực hiện.
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-6 mt-3 italic">Hợp đồng chi tiết sẽ tự động tải về sau khi bấm 'Hoàn tất'
                            <div className="ml-1 mt-3 flex">
                                <input type="checkbox" className="mr-4" ref={agreementRef} onChange={agreementRefChange} />
                                <div>Tôi đồng ý với các điều khoản trên</div>
                            </div>
                                {/* <span onClick={getContract} className="italic text-sky-600 cursor-pointer"> tại đây</span> */}
                            </div>
                         </Grid>
                         <Grid xs={6} >
                            <div className="mt-6">
                                <div className="text-xl text-textcolor font-semibold">Thông tin lớp học:</div>
                                <Grid container spacing={2}>
                                    <Grid xs={5}>
                                        <div className="mt-2">
                                            Học sinh {convertToVNmese(requestclass.studentGender)}. 
                                        </div>
                                        <div className="mt-2">Lớp: {requestclass.grade} </div>
                                        <div className="mt-2">Thời gian học: {requestclass.frequency}/tuần. </div>
                                    </Grid>
                                    <Grid xs={5}>
                                        <div className="mt-2">Môn học: {requestclass.name} </div>
                                        <div className="mt-2">SĐT: {requestclass.phone}</div>
                                        <div className="mt-2">Học phí {requestclass.salary.toLocaleString("de-DE")}đ/buổi</div>
                                    </Grid>
                                </Grid>
                                <div className="mt-2">Địa chỉ: {requestclass.detailAddress}, {classFullAddress}</div>
                            </div>
                            <div className="mt-6">
                                <div className="text-xl text-textcolor font-semibold mb-2">Thông tin Gia sư:</div>
                                <Grid container spacing={0}>
                                    <Grid xs={5}>
                                        <div className="">Họ và tên: {tutor.name}</div> 
                                        <div className="mt-2">Giới tính: {tutor.birth.slice(0, 10)}</div>
                                        <div className="mt-2">Học vấn: {tutor.school} </div>

                                    </Grid>
                                    <Grid xs={5}>
                                        <div>Giới tính: {convertToVNmese(tutor.gender)}</div>
                                        <div className="mt-2">Gia sư môn: {getAllSubject()}</div>
                                        <div className="mt-2">Nghề nghiệp: {convertToVNmese(tutor.job)} </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="text-xl text-textcolor font-semibold mt-3">Thời gian thanh toán</div> 
                            <div className="mt-2 flex">
                                <input type="checkbox" className="mr-4" ref={payLaterRef}  onChange={payLaterRefChange} />
                                <div>Thanh toán trong vòng 30 ngày</div>
                            </div>
                            <div className="flex">
                                <input type="checkbox" className="mr-4" ref={payImmediateRef} onChange={payImmediateRefChange} />
                                <div>Thanh toán ngay</div>
                            </div>
                            <div >
                                <div className="text-lg text-textcolor font-semibold mt-3">Quét mã QR dưới đây và thanh toán:</div>
                                <div className="flex justify-between items-center">
                                    <img src="qr-test.jpg" alt="" className="w-36 mt-2" />
                                    <div className="">
                                        <button 
                                            className="bg-indigo-400 h-max w-max rounded-lg text-white font-bold hover:bg-indigo-300 duration-[500ms,800ms] mr-16"
                                            onClick={async (event) => {
                                                event.currentTarget.disabled = true
                                                event.currentTarget.classList.add('hover:cursor-not-allowed')
                                                setPaid(true)
                                                await sleep(5000)
                                                console.log('wake up')
                                                setCheckingPayment(true)
                                            }}
                                            >
                                                {paid 
                                                ?
                                                (
                                                    !checkingPayment 
                                                    ?
                                                    <div className="flex items-center justify-center m-[10px]"> 
                                                        <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                                                        <div className="ml-2"> Đang xử lý... </div>
                                                    </div>
                                                    : 
                                                    <div className="m-[10px]">Thanh toán thành công</div>
                                                )
                                                :
                                                <div className="m-[10px]">Đã thanh toán</div>
                                                }

                                        </button>
                                    </div>
                                </div>
                            </div>
                         </Grid>
                    </Grid>
                    <div className="flex justify-center">
                        <button disabled={checkingPayment} onClick={() => setOpenModal(false)} className="my-2 mx-3 px-3 py-2 rounded-md bg-neutral-300 border-neutral-600">Hủy bỏ</button>
                        <button 
                            onClick={choosetutor} 
                            className="my-2 mx-3 px-3 py-2 rounded-md bg-headerbg border-green-400 " 
                            ref={confirmButtonRef} 
                                                
                            >
                                Hoàn tất
                            </button> 
                    </div>
                </div>
            </Modal>
        </div>
    )
}



export default MyAccount