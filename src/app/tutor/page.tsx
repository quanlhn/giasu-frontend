'use client'

import React, { useContext, useEffect, useState, useRef } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import UserContext from "../UserContext";
import { API_PATH } from "../CustomInterface";
import { RequestClass } from "../CustomInterface";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { convertToVNmese } from "../CustomInterface";
import { NextPage } from "next";
import TutorType from "../CustomInterface";
import Timetable from "../components/Timetable";
import RequestClassPage from "../requestClass/page";

const TutorPage: NextPage<{
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }> = ({
    params,
    searchParams,
  }) => {

    const searchParam = useSearchParams()
    const router = useRouter()
    const user = useContext(UserContext)
    const [userStatus, setUserStatus] = useState('')
    const [classes, setClasses] = useState<Array<RequestClass>>()
    const [openModal, setOpenModal] = useState(false)
    const [resultApply, setResultApply] = useState('')
    const buttonsRef = useRef<(HTMLButtonElement[])>([])
    const [fullAddress, setFullAddress] = useState<Array<String>>([])
    const [tutors, setTutors] = useState<Array<TutorType>>()

    const convertSkill = {
        'HS khá, giỏi': 'goodPupil',
        'HS yếu, trung bình': 'badPupil',
        'Ôn thi HSG': 'studentCompetition',
        'Ôn thi Đại học': 'toUniversity', 
        'Ôn thi vào 10': 'toHighSchool'
    }   

    /*----------- Get All Request Class and tutor Status -------------------- */
    useEffect(() => {
        const subjects = searchParam.get('subjects')
        const grades = searchParam.get('grades')
        const skills = searchParam.get('skills')
        
        const subjectArrays = subjects ? JSON.parse(subjects) : []
        const gradesArray = grades ? JSON.parse(grades) : []
        const t_skillsArrays = skills ? JSON.parse(skills) : []

        const skillsArrays = t_skillsArrays.map((skill: any) => {
            for (const [key, value] of Object.entries(convertSkill)) {
                if (key == skill) return value
            }
        })
        console.log({subjectArrays, gradesArray, skillsArrays})

        const allTutors = new Array<TutorType>()

    fetch(API_PATH + 'tutor/get-filtered-tutors', {
        method: 'POST',
        mode: 'cors', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subjectArrays, gradesArray, skillsArrays
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data.subjects)
        data.tutors.forEach((result: any) => {
          // t_statusChange.push({userID: result.userID, status: result.status})
          // console.log(typeof result.birth)
          
          let subjects = new Array()
          // console.log(subjects)
          const newTutor = {
            userID: result.userID,
            name: result.name,
            phone: result.phone,
            school: result.school,
            specialized: result.specialized,
            job: result.job,
            expTeach: result.expTeach,
            subjectIds: result.subjectIds,
            subjects,
            skillRange: result.skillRange.split(','),
            schedule: result.schedule.split(','),
            description: result.description,
            status: result.status,
            role: result.role,
            gender: result.gender,
            birth: !result.birth ? '' : result.birth.slice(0, 10),
            address: result.address, 
            avatar: result.avatar
          }
          allTutors.push(newTutor)
      })
      console.log(allTutors)
      // console.log(allTutors)
      setTutors(() => allTutors)
    })
        
    },[user, searchParam])

    /*------------------------------
    Check if tutor applied class
    convert Address
     -------------------- */

    // useEffect(() => {
    //     var f_address: string[] = []
    //     classes?.forEach((requestClass: any, index) => {
    //         fetch(API_PATH + 'tutor/check-applied', {
    //             method: 'POST',
    //             mode: 'cors', 
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 tutorId: user.user.userID,
    //                 classId: requestClass.requestID
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(data => {
    //             if (user.user.role == 'tutor' && userStatus == 'confirmed') {
    //                 if (data.isApplied) {
    //                     buttonsRef.current[index]['disabled'] = true
    //                 } else {
    //                     buttonsRef.current[index]['disabled'] = false
    //                 }
    //             }
    //         })
            
    //         fetch(API_PATH + 'address/get-full-address', {
    //             method: 'POST',
    //             mode: 'cors', 
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 wardCode: requestClass.address,
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(data => {
    //             const added_address = data.address[0].w_name + ', ' + data.address[0].d_name + ', ' + data.address[0].p_name
    //             f_address.push(added_address)
    //             // console.log(f_address)               
    //             if (index == classes.length - 1) {
    //                 setFullAddress(f_address)
    //             }
                
    //         })

    //     })
    // }, [classes])

    const buttonBgClass = 'bg-amber-100'
    const handleSubjectFilter = (e: any) => {
        const subjects = searchParam.get('subjects')
        const grades = searchParam.get('grades')
        const skills = searchParam.get('skills')
        if (subjects) {
            const subjectArrays = JSON.parse(subjects)
            if (!subjectArrays.includes(e.target.innerHTML)) {
                e.target.classList.add(buttonBgClass)  
                subjectArrays.push(e.target.innerHTML)
                const queryString = encodeURIComponent(JSON.stringify(subjectArrays))
                // console.log(queryString)
                router.push(`tutor?subjects=${queryString}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
            } else {
                e.target.classList.remove(buttonBgClass)
                const index = subjectArrays.indexOf(e.target.innerHTML)
                if (index !== -1) {
                    subjectArrays.splice(index, 1)
                }
                const queryString = encodeURIComponent(JSON.stringify(subjectArrays))
                router.push(`tutor?subjects=${queryString}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
            }
        } else {
            e.target.classList.add(buttonBgClass)
            const subjectArrays = [e.target.innerHTML]
            const queryString = encodeURIComponent(JSON.stringify(subjectArrays))
            router.push(`tutor?subjects=${queryString}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
        }skills
    }

    const handleGradeFilter = (e: any) => {
        const subjects = searchParam.get('subjects')
        const grades = searchParam.get('grades')
        const skills = searchParam.get('skills')
        if (grades) {
            const gradesArray = JSON.parse(grades)
            if (!gradesArray.includes(e.target.innerHTML)) {
                e.target.classList.add(buttonBgClass)  
                gradesArray.push(e.target.innerHTML)
                const queryString = encodeURIComponent(JSON.stringify(gradesArray))
                
                router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}grades=${queryString}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
            } else {
                e.target.classList.remove(buttonBgClass)
                const index = gradesArray.indexOf(e.target.innerHTML)
                if (index !== -1) {
                    gradesArray.splice(index, 1)
                }
                const queryString = encodeURIComponent(JSON.stringify(gradesArray))
                router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}grades=${queryString}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
            }
        } else {
            e.target.classList.add(buttonBgClass)
            const gradesArray = [e.target.innerHTML]
            const queryString = encodeURIComponent(JSON.stringify(gradesArray))
            router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}grades=${queryString}${skills ? '&skills=' + encodeURIComponent(JSON.stringify(JSON.parse(skills))) : ''}`)
        }
    }
    const handleSkillFilter = (e: any) => {
        const subjects = searchParam.get('subjects')
        const grades = searchParam.get('grades')
        const skills = searchParam.get('skills')
        if (skills) {
            const skillsArrays = JSON.parse(skills)
            if (!skillsArrays.includes(e.target.innerHTML)) {
                e.target.classList.add(buttonBgClass) 
                skillsArrays.push(e.target.innerHTML)
                const queryString = encodeURIComponent(JSON.stringify(skillsArrays))
                router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}skills=${queryString}`)
            } else {
                e.target.classList.remove(buttonBgClass)
                const index = skillsArrays.indexOf(e.target.innerHTML)
                if (index !== -1) {
                    skillsArrays.splice(index, 1)
                }
                const queryString = encodeURIComponent(JSON.stringify(skillsArrays))
                router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}skills=${queryString}`)

            }
        } else {
            e.target.classList.add(buttonBgClass)
            const skillsArrays = [e.target.innerHTML]
            const queryString = encodeURIComponent(JSON.stringify(skillsArrays))
            router.push(`tutor?${subjects ? 'subjects=' + encodeURIComponent(JSON.stringify(JSON.parse(subjects))) + '&' : ''}${grades ? '&grades=' + encodeURIComponent(JSON.stringify(JSON.parse(grades))) + '&' : ''}skills=${queryString}`)
        }    
    }   

    const getFullAddress = (r_class: any) => {
        
        
    }

    // const applyClass = (requestClass: any) => {
    //     fetch(API_PATH + 'tutor/apply-class', {
    //         method: 'POST',
    //         mode: 'cors', 
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             tutorId: user.user.userID,
    //             classId: requestClass.requestID
    //         })
    //     })
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data)
    //         if (data.isPassed) {
    //             setResultApply('Chúc mừng bạn đã đăng ký nhận lớp thành công. \n Kết quả sẽ được gửi tới bạn trong thời gian sớm nhất')
    //         } else {
    //             setResultApply('Chúng tôi rất tiếc vì lớp này không phù hợp với bạn. \n Hãy tìm thêm các lớp khác phù hợp với mình nhé!')
    //         }
    //         setOpenModal(true)
    //     })
    // }

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
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Vật lý</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Hóa</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Sinh</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Tiếng Anh</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Văn</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Sử</button>
                        <button onClick={(e) => handleSubjectFilter(e)} className='filterButton'>Địa</button>
                    </div>
                    <div className="size mt-10">
                        <h3 className="text-xl mb-2">Cấp học</h3>
                        <button onClick={(e) => handleGradeFilter(e)} className='filterButton'>Cấp 1</button>
                        <button onClick={(e) => handleGradeFilter(e)} className='filterButton'>Cấp 2</button>
                        <button onClick={(e) => handleGradeFilter(e)} className='filterButton'>Cấp 3</button>
                    </div>
                    <div className="size mt-10">
                        <h3 className="text-xl mb-2">Mức độ</h3>
                        <button onClick={(e) => handleSkillFilter(e)} className='filterButton'>HS khá, giỏi</button>
                        <button onClick={(e) => handleSkillFilter(e)} className='filterButton'>HS yếu, trung bình</button>
                        <button onClick={(e) => handleSkillFilter(e)} className='filterButton'>Ôn thi HSG</button>
                        <button onClick={(e) => handleSkillFilter(e)} className='filterButton'>Ôn thi Đại học</button>
                        <button onClick={(e) => handleSkillFilter(e)} className='filterButton'>Ôn thi vào 10</button>
                    </div>
                </Grid>
                <Grid xs={10}>
                    {tutors && tutors.map((tutor, index) => {
                        return <TutorCard tutor={tutor} key={index} />
                    })}
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

const TutorCard = ({tutor}: Props) => {
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
            console.log(data.subject)
        })

        // payLaterRef.current && (payLaterRef.current.checked = false)
    }, [tutor])

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
                    <div className="mt-1"><span className="italic">Gia sư môn </span>{getAllSubject()}</div>
                    <div className="mt-1"><span className="italic">Có thể dạy:</span> {tutor.skillRange.map((e: any) => convertToVNmese(e)).join(' / ')}</div>
                    <div className="mt-1"><span className="italic">Học vấn: </span>{tutor.specialized}, {tutor.school}</div>
                    <div className="mt-1"><span className="italic">Nghề nghiệp hiện nay:</span> {convertProperties(tutor.job)}</div>
                    <div className="mt-1"><span className="italic">Thông tin khác:</span> {tutor.description}</div>

                </Grid>
                <Grid xs={4} className='flex flex-col items-center justify-between pb-20' >
                    <Timetable timetable={tutor.schedule} />
                    <button onClick={() => router.push(`/requestTutor/${tutor.userID}`)} className="bg-slate-500 text-white font-semibold shadow-lg px-2.5 py-1.5 rounded-md mb-10 ">Chọn gia sư</button>
                </Grid>
                <Grid xs={1}>
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
                    <div className="w-2/3 h-full">
                        <RequestClassPage  />
                    </div>
                    <Button variant="outlined" onClick={handleCloseModal} className="my-2">Ok</Button> 
                </div>
            </Modal>
        </div>
    )
}



export default TutorPage

