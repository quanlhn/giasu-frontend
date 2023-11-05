'use client'

import React, { useContext, useEffect, useState, useRef } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import UserContext from "../UserContext";
import { API_PATH } from "../page";
import { RequestClass } from "../CustomInterface";

export const convertToVNmese = (text: string) => {
    switch(text) {
        case 'goodPupil': {
            return 'HS khá, giỏi'
        }
        case 'badPupil': {
            return 'HS yếu, trung bình'
        }
        case 'studentCompetition': {
            return 'ôn thi học sinh giỏi'
        }
        case 'toHighSchool': {
            return 'ôn thi chuyển cấp 9 lên 10'
        }
        case 'toUniversity': {
            return 'ôn thi đại học'
        }
        case 'ielts': {
            return 'ôn thi ielts'
        }
        case 'hard-working': {
            return 'học sinh chăm chỉ'
        }
        case 'lazy': {
            return 'học sinh lười học'
        }
        case 'like-game': {
            return 'học sinh ham game, mạng xã hội'
        }
        case 'male': {
            return 'nam'
        }
        case 'female': {
            return 'nữ'
        }
        // case 'female': {
        //     return 'nữ'
        // }
        // case 'female': {
        //     return 'nữ'
        // }
        // case 'female': {
        //     return 'nữ'
        // }
        // case 'female': {
        //     return 'nữ'
        // }
        default: {
            return 'default'
        }
    }
}

const Class = () => {

    const user = useContext(UserContext)
    const [userStatus, setUserStatus] = useState('')
    const [classes, setClasses] = useState<Array<RequestClass>>()
    const [openModal, setOpenModal] = useState(false)
    const [resultApply, setResultApply] = useState('')
    const buttonsRef = useRef<(HTMLButtonElement[])>([])
    const [fullAddress, setFullAddress] = useState<Array<String>>([])
    
    useEffect(() => {
        var allClasses = new Array<RequestClass>()
        fetch(API_PATH + 'class/get-requestClasses')
        .then(res => res.json())
        .then(data => {
            data.classes.forEach((result: any) => {
                allClasses.push({
                    requestID: result.id,
                    parentID: result.parentID,
                    parentName: result.parentName,
                    phone: result.phone,
                    studentGender: result.studentGender,
                    requiredGender: result.requiredGender,
                    address: result.address,
                    grade: result.grade,
                    subject: result.subject,
                    skill: result.skill,
                    studentCharacter: result.studentCharacter,
                    schedule: result.schedule.split(','),
                    frequency: result.frequency,
                    salary: result.salary,
                    otherRequirement: result.otherRequirement,
                    status: result.status
                })
            })
            setClasses(allClasses)
            // console.log(data.classes)
        })
        // console.log(user.user.role)
        if (user.user.role == 'tutor') {
            // console.log('???')
            fetch (API_PATH + 'tutor/get-tutor', {
                method: 'POST',
                mode: 'cors', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: user.user.userID
                })
            })
            .then(res => res.json())
            .then(data => {
                setUserStatus(data.tutor.status)
                // console.log(data.tutor.status)
            })
        }

        
    },[user])

    useEffect(() => {
        classes?.forEach((requestClass: any, index) => {
            fetch(API_PATH + 'tutor/check-applied', {
                method: 'POST',
                mode: 'cors', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tutorId: user.user.userID,
                    classId: requestClass.requestID
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.isApplied) {
                    buttonsRef.current[index]['disabled'] = true
                } else {
                    buttonsRef.current[index]['disabled'] = false
                }
            })
            console.log(requestClass.address)
            fetch(API_PATH + 'address/get-full-address', {
                method: 'POST',
                mode: 'cors', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wardCode: requestClass.address,
                })
            })
            .then(res => res.json())
            .then(data => {
                setFullAddress([...fullAddress, data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name])
            })
        })
    }, [classes])

    const handleSubjectFilter = (e: any) => {

    }

    const getFullAddress = (r_class: any) => {

        
    }

    const applyClass = (requestClass: any) => {
        fetch(API_PATH + 'tutor/apply-class', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tutorId: user.user.userID,
                classId: requestClass.requestID
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.isPassed) {
                setResultApply('Chúc mừng bạn đã đăng ký nhận lớp thành công. \n Kết quả sẽ được gửi tới bạn trong thời gian sớm nhất')
            } else {
                setResultApply('Chúng tôi rất tiếc vì lớp này không phù hợp với bạn. \n Hãy tìm thêm các lớp khác phù hợp với mình nhé!')
            }
            setOpenModal(true)
        })
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    return (
        <div className="mt-10 mx-10">
            <div className="text-2xl font-semibold">Danh sách lớp mới</div>
            <Grid container spacing={10}>
                <Grid xs={2}>
                    <div className="size mt-10">
                        <h3 className="text-xl mb-2">Môn học</h3>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Toán</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Lý</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Hóa</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Sinh</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Tiếng Anh</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Văn</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Sử</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Địa</button>
                    </div>
                    <div className="size mt-10">
                        <h3 className="text-xl mb-2">Cấp học</h3>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Cấp 1</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Cấp 2</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Cấp 3</button>
                    </div>
                    <div className="size mt-10">
                        <h3 className="text-xl mb-2">Mức độ</h3>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>HS khá, giỏi</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>HS yếu, trung bình</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Ôn thi HSG</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Ôn thi Đại học</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Ôn thi vào 10</button>
                    </div>
                </Grid>
                <Grid xs={10}>
                    <div className="mt-10">
                        {classes?.map((element, index) => (
                            <Grid 
                                container
                                spacing={3}
                                className="mt-10 items-center bg-slate-100 rounded-md px-5 py-2 drop-shadow" 
                                key={index}
                            >
                                <Grid xs={6}>
                                    <div>Lớp số {element.requestID} / {fullAddress[index]}</div>
                                    <div>Học sinh {element.studentGender == 'male' ? 'Nam' : 'Nữ'} học lớp {element.grade[element.grade.length-1]}. {convertToVNmese(element.skill)}, {convertToVNmese(element.studentCharacter)} </div>
                                    <div>Yêu cầu tìm gia sư {convertToVNmese(element.requiredGender)} có kinh nghiệm, {element.otherRequirement}</div>
                                    <div>{element.frequency} buổi / tuần, {element.salary.toLocaleString("de-DE")}đ / buổi </div>
                                    <hr />
                                </Grid>
                                <Grid xs={4} >
                                    <Timetable timetable={element.schedule} />
                                </Grid>
                                <Grid xs={2}>
                                    {user.user.role == 'tutor' && userStatus == 'confirmed'  
                                    ?
                                        <div  className="flex items-center justify-center">
                                            <button 
                                                className=" p-3 bg-blue-300 rounded-lg font-semibold active:bg-blue-500 " 
                                                onClick={() => applyClass(element)} 
                                                ref={(el: HTMLButtonElement) => buttonsRef.current[index] = el}
                                            >
                                                Đăng ký
                                            </button>
                                        </div>
                                    :
                                        <div></div>
                                    }
                                </Grid>
                                
                            </Grid>
                        ))}
                    </div>
                </Grid>
            </Grid>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white w-max px-6 py-4 translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 absolute rounded-xl">
                    <div className="text-2xl">Cảm ơn bạn đã đăng ký gia sư trên <span className="text-teal-700 font-semibold">Gia Sư Tín</span></div>
                    <h4>{resultApply}</h4>
                    <Button variant="outlined" onClick={handleCloseModal} className="my-2">Ok</Button> 
                </div>
            </Modal>
        </div>
    )
}

export default Class

export interface Props {
    timetable: Array<string>
}

export const Timetable = ({timetable}: Props) => {
    const sessionsRef = useRef<(HTMLDivElement)[]>([])

    useEffect(() => {
        sessionsRef.current.forEach(divElement => {            
            if (timetable.includes(divElement.id)) {
                divElement.classList.add('bg-green-400')
            }
        })
    }, [])

    const getStyle = (e: any) => {
        console.log(e.target.id)
    }
    
    return (
        <table style={{width: '100%', marginLeft: '10px', marginRight: '10px', fontSize: '10px'}}>
            <tbody>
                <tr style={{height: '25px'}}>
                    <th className="">&nbsp;</th> 
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                    <th>Chủ Nhật</th>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Sáng</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[0] = el} id="t2_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[1] = el} id="t3_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[2] = el} id="t4_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[3] = el} id="t5_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[4] = el} id="t6_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[5] = el} id="t7_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[6] = el} id="t8_s" className="h-full w-full">&nbsp;</div></td>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Chiều</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[7] = el} id="t2_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[8] = el} id="t3_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[9] = el} id="t4_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[10] = el} id="t5_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[11] = el} id="t6_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[12] = el} id="t7_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[13] = el} id="t8_c" className="h-full w-full">&nbsp;</div></td>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Tối</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[14] = el} id="t2_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[15] = el} id="t3_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[16] = el} id="t4_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[17] = el} id="t5_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[18] = el} id="t6_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[19] = el} id="t7_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[20] = el} id="t8_t" className="h-full w-full">&nbsp;</div></td>
                </tr>

            </tbody>
        </table>
    )
}

