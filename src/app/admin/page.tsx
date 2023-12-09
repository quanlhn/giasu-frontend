'use client'

import React from "react";
import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserContext from "../UserContext";
import { API_PATH } from "../CustomInterface";
import TutorType from "../CustomInterface";
import Grid from '@mui/material/Unstable_Grid2';
import Cookies from 'js-cookie'

const Admin = () => {
    
    const user = useContext(UserContext)
    const [confirmingTutor, setComfirmingTutor] = useState()
    const [tutors, setTutors] = useState<Array<TutorType>>()
    const [tutorShown, setTutorShown] = useState(false)
    const [statusChange, setStatusChange] = useState([{
        userID: 0,
        status: ''
    }])
    const [reload, setReload] = useState(0)

    useEffect(() => {
        const allTutors = new Array<TutorType>()
        var t_tutors: any[] = []
        var t_statusChange: { userID: any; status: any; }[] = []
        const cookie = Cookies.get('accessToken')
        fetch(API_PATH + 'admin/get-confirming-tutor', {
            method: 'GET',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'x_authorization': `${cookie}`,
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.tutors)
            data.tutors.forEach((result: any) => {
                t_statusChange.push({userID: result.userID, status: result.status})
                // console.log(typeof result.birth)
                const newTutor = {
                    userID: result.userID,
                    name: result.name,
                    phone: result.phone,
                    school: result.school,
                    specialized: result.specialized,
                    job: result.job,
                    expTeach: result.expTeach,
                    // subjectRange: result.subjectRange.split(','),
                    // classRange: result.classRange.split(','),
                    skillRange: result.skillRange.split(','),
                    schedule: result.schedule.split(','),
                    description: result.description,
                    status: result.status,
                    role: result.role,
                    gender: result.gender,
                    birth: !result.birth ? '' : result.birth.slice(0, 10),
                    address: result.address, 
                    avatar: result.avatar,
                    subjects: [{}],
                    subjectIds: result.subjectIds
                }
                allTutors.push(newTutor)
            })
            setTutors(() => allTutors)
            setStatusChange(t_statusChange)
        }) 
    }, [])

    const showTutors = () => {
        setTutorShown(true)
    }

    const changeStatus = (event: any, userID: number) => {
        console.log(event.target.value)
        var t_statusChange = statusChange
        t_statusChange.forEach((status) => {
            if (status.userID == userID) {
                status.status = event.target.value
            }
        })
        console.log(t_statusChange)
        setStatusChange(t_statusChange)
    }

    const saveChange = () => {
        statusChange.forEach(element => {
            if (element.status == 'confirmed') {
                const cookie = Cookies.get('accessToken')
                fetch(API_PATH + 'admin/update-tutor-status', {
                    method: 'POST',
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/json',
                        'x_authorization': `${cookie}`,
                    },
                    body: JSON.stringify({
                        userID: element.userID,
                        status: element.status
                    })
                })

                fetch(API_PATH + 'notice/create-notice', {
                    method: 'POST',
                    mode: 'cors', 
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: element.userID,
                        content: `Thông tin gia sư của bạn đã được xác nhận thành công`,
                        pathto: '/class'
                    })
                })

                setTutors(() => tutors?.filter(tutor => tutor.userID != element.userID))
            }
            
        })
        alert('Lưu thành công')
        
    }

    return (
        <div>

            {user.user.role == 'admin' 
            ?
                <div className="pt-16 mx-10">
                    <Grid container spacing={10}>
                        <Grid xs={2}>
                            <button onClick={showTutors}>Quản lý Gia sư</button>
                        </Grid>
                        <Grid xs={10}>
                            
                            {tutorShown 
                            ?
                                <div>
                                    <button className="mb-5 p-3 bg-blue-300 rounded-lg font-semibold hover:bg-blue-500 " onClick={saveChange}>
                                        Lưu thay đổi
                                    </button>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <th>User ID</th>
                                                <th>Thông tin cá nhân</th>
                                                <th>Học vấn</th>
                                                <th>Kinh nghiệm gia sư</th>
                                                <th>Thời gian rảnh</th>
                                                <th>Action</th>
                                            </tr>
                                            {tutors?.map((tutor: TutorType, index) => (
                                                <tr key={index}>
                                                    <td className='p-2'>
                                                        <div>{tutor.userID}</div>
                                                    </td>
                                                    <td className='p-2'>
                                                        <div>{tutor.name}</div>
                                                        <div>{tutor.gender} / {tutor.address}</div>
                                                        <div>{tutor.birth}</div>
                                                    </td>
                                                    <td className='p-2'>
                                                        <div>{tutor.specialized} - {tutor.school}</div>
                                                        <div>{tutor.job}</div>
                                                    </td>
                                                    <td className='p-2'>
                                                        <div>{tutor.expTeach == 1 ? 'Đã' : 'Chưa'} từng đi dạy</div>
                                                        {/* <div>{tutor.classRange.join(', ')}</div>
                                                        <div>{tutor.subjectRange.join(', ')}</div> */}
                                                        <div>{tutor.skillRange.join(', ')}</div>
                                                    </td>
                                                    <td className='p-2'>
                                                        <div>{tutor.schedule.join(', ')}</div>
                                                    </td>
                                                    <td className='p-2'>
                                                        <select name="action" id="action" defaultValue={tutor.status} onChange={(event) => changeStatus(event, tutor.userID)}>
                                                            <option value="confirming">Chờ xác nhận</option>                                   
                                                            <option value="confirmed">Đã xác nhận</option>                                         
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            :
                                <div>

                                </div>
                            }
                        </Grid>
                    </Grid>
                </div>  
            :
                <div className="text-2xl text-inputLabel">
                    404 not found
                </div>
            }
        </div>
    )
}

export default Admin