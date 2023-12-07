'use client'

import React, { useContext, useEffect, useState, useRef } from "react";
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import UserContext from "../../UserContext";
import { API_PATH } from "../../CustomInterface";
import { RequestClass } from "../../CustomInterface";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import { convertToVNmese } from "../../CustomInterface";
import { NextPage } from "next";
import TutorType from "../../CustomInterface";
import Timetable from "../../components/Timetable";

import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SearchIcon from "@mui/icons-material/Search";
import ListSubheader from "@mui/material/ListSubheader";
import { InputAdornment } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import Cookies from 'js-cookie'

const RequestTutorId = () => {
    const [tutorId, setTutorId] = useState<string>()
    const [tutor, setTutor] = useState<TutorType>()
    
    useEffect(() => {
        if (window) {
            setTutorId(window.location.pathname.split('/')[2])
            const id = window.location.pathname.split('/')[2]
            fetch(API_PATH + 'tutor/get-tutor', {
                method: 'POST',
                mode: 'cors', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: id
                })
            })
            .then(res => res.json())
            .then(data => {
                const result = data.tutor
                const newTutor = {
                    userID: result.userID,
                    name: result.name,
                    phone: result.phone,
                    school: result.school,
                    specialized: result.specialized,
                    job: result.job,
                    expTeach: result.expTeach,
                    subjectIds: result.subjectIds,
                    subjects: new Array(),
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
                setTutor(newTutor)
            })
        }
    }, [])


    return (
        <div className="mx-14">
            {tutor && 
            <div>
                <TutorCard tutor={tutor} />
                <RequestClassPage tutor={tutor} />
            </div>
            }
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

const RequestClassPage = ({tutor}: Props) => {
    const user = useContext(UserContext)

    const [name, setName] = useState(user.user.name)
    const [studentGender, setStudentGender] = useState('')
    const [requiredGender, setRequiredGender] = useState('')
    const [phone, setPhone] = useState(user.user.phoneNumber)
    const [address, setAddress] = useState('')
    const [school, setSchool] = useState('')
    const [grade, setGrade] = useState<string>()
    const [subject, setSubject] = useState<string>()
    const [skill, setSkill] = useState<string>()
    const [character, setCharacter] = useState('')
    const [schedule, setSchedule] = useState<Array<String>>([])
    const [frequency, setFrequency] = useState<string>()
    const [salary, setSalary] = useState<string>()
    const [otherRequirement, setOtherRequirement] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()

    // --------- address control ---------------

    const [provinces, setProvinces] = useState<Array<any>>([])
    const [districts, setDistricts] = useState<Array<any>>([])
    const [disableDistrict, setDisableDistrict] = useState(true)
    const [wards, setWards] = useState<Array<any>>([])
    const [disableWard, setDisableWard] = useState(true)

    const [provinceCode, setProvinceCode] = useState('')
    const [districtCode, setDistrictCode] = useState('')
    const [wardCode, setWardCode] = useState('')

    const [searchText, setSearchText] = useState("");

    const [displayedProvinces, setDisplayedProvinces] = useState<Array<any>>()
    const [displayedDistricts, setDisplayedDistricts] = useState<Array<any>>()
    const [displayedWards, setDisplayedWards] = useState<Array<any>>()

    const [openProvince, setOpenProvince] = useState(false)
    const [openDistrict, setOpenDistrict] = useState(false)
    const [openWard, setOpenWard] = useState(false)

    useEffect(() => {
        fetch(API_PATH + 'address/get-provinces')
        .then(res => res.json())
        .then(data => {
            setProvinces(data.provinces)
            setDisplayedProvinces(data.provinces)
            
        })
    }, [])

    const containsText = (text: any, searchText: any) => text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
    useEffect(() => {
        if(openProvince) {
            setDisplayedProvinces(() => provinces.filter((el) => containsText(el.full_name, searchText)))
        }
        if (openDistrict) {
            setDisplayedDistricts(() => districts.filter((el) => containsText(el.full_name, searchText)))
        }
        if (openWard) {
            setDisplayedWards(() => wards.filter((el) => containsText(el.full_name, searchText)))
        }
        
    }, [searchText])

    const changeProvince = (e: any) => {
        setDisableDistrict(false)
        setProvinceCode(e.target.value)
        fetch(API_PATH + 'address/get-districts', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({
                provinceCode: e.target.value
            })
        }) 
            .then((response) => response.json())
            .then((data) => {
                setDistricts(data.districts)
                setDisplayedDistricts(data.districts)
            })
    }

    const changeDistrict = (e: any) => {
        // setProvinceAddress(e)
        setDisableWard(false)
        setDistrictCode(e.target.value)
        // console.log(provinceCode)
        
        fetch(API_PATH + 'address/get-wards', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({
                districtCode: e.target.value
            })
        }) 
            .then((response) => response.json())
            .then((data) => {
                setWards(data.wards)
                setDisplayedWards(data.wards)
            })
    }

    //  ----------------------------------------

    const handleSubmit = (event: any) => {
        event.preventDefault()
        const convert_schedule = schedule.join(',')
        const cookie = Cookies.get('accessToken')
        fetch(API_PATH + 'parents/requestClass', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'x_authorization': `${cookie}`,
                
            },
            body: JSON.stringify({
                parentID: user.user.userID,    
                parentName: name,
                phone,
                studentGender,
                requiredGender,
                address: wardCode,
                detailAddress: address,
                grade,
                subject,
                skill,
                studentCharacter: character,
                schedule: convert_schedule,
                frequency,
                salary,
                otherRequirement,
                status: 'wait-for-tutor',
                requestTutorId: tutor.userID
            })
        })
        .then(res => res.json())
        .then(data => {
                setOpenModal(true)
                
        })
    }

    const handleGradeInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        console.log(evt.currentTarget.id)
        setGrade(evt.currentTarget.id)
    }

    const handleSubjectInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        console.log(evt.currentTarget.nextElementSibling?.innerHTML)
        setSubject(evt.currentTarget.nextElementSibling?.innerHTML)
    }

    const handleSkillInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        setSkill(evt.currentTarget.id)
    }

    const selectTeachingTime = (event: any) => {
        if ([...event.currentTarget.classList].includes('bg-green-400')) {
            event.currentTarget.classList.remove('bg-green-400')
            const t_schedule = schedule.filter(c => c != event.currentTarget.id)
            setSchedule(t_schedule)
        } else {
            event.currentTarget.classList.add('bg-green-400')
            setSchedule([...schedule, event.currentTarget.id])   
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        router.push('/class')
    }

    return (
        <div className="">
            <form className="mx-10 px-6 bg-[#FAF8F8] mt-16" onSubmit={handleSubmit} >
                <div className="text-inputLabel text-3xl mx-2 pt-4">Yêu cầu gia sư</div>
                <hr className="w-[30%] mb-5"/>
                <Grid container spacing={10} >
                    <Grid xs={4} className=''>
                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Họ và tên phụ huynh hoặc học sinh</div>
                            <input 
                                onChange={(event) => setName(event.target.value)} 
                                type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" 
                                required
                                defaultValue={user.user.name}
                            />
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Số điện thoại</div>
                            <input 
                                onChange={(event) => setPhone(event.target.value)} 
                                type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-[75%]" 
                                required
                                defaultValue={user.user.phoneNumber}
                            />
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Học sinh là: </div>
                            <input onClick={(evt) => setStudentGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="student-gender" id="male" />
                            <label className="text-lg leading-10 ml-2" htmlFor="male">Nam</label>
                            <br />
                            <input onClick={(evt) => setStudentGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="student-gender" id="female" />
                            <label className="text-lg leading-10 ml-2" htmlFor="female">Nữ</label>
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Yêu cầu gia sư là: </div>
                            <input onClick={(evt) => setRequiredGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="required-gender" id="male" />
                            <label className="text-lg leading-10 ml-2" htmlFor="male">Nam</label>
                            <br />
                            <input onClick={(evt) => setRequiredGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="required-gender" id="female" />
                            <label className="text-lg leading-10 ml-2" htmlFor="female">Nữ</label>
                            <br />
                            <input onClick={(evt) => setRequiredGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="gender" id="no" />
                            <label className="text-lg leading-10 ml-2" htmlFor="female">Không yêu cầu</label>
                        </div>

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Địa chỉ</div>

                            <FormControl fullWidth >

                                <InputLabel id="select-province">Tỉnh thành</InputLabel>
                                <Select
                                    labelId="select-province"
                                    id="select-province"
                                    MenuProps={{ autoFocus: false }}
                                    onChange={(e) => changeProvince(e)}
                                    onOpen={() => setOpenProvince(true)}
                                    onClose={() => {setOpenProvince(false); setSearchText("")}}
                                    fullWidth
                                    value={provinceCode || ''}
                                    defaultValue=""
                                    className="rounded-lg mb-6 "
                                    // renderValue={() => selectedProvince}
                                    sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                >
                                    <ListSubheader>
                                        <TextField
                                        size="small"
                                        // Autofocus on textfield
                                        autoFocus
                                        placeholder="Type to search..."
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                            )
                                        }}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key !== "Escape") {
                                            // Prevents autoselecting item while typing (default Select behaviour)
                                            e.stopPropagation();
                                            }
                                        }}
                                        />
                                    </ListSubheader>
                                    {displayedProvinces && displayedProvinces.map((province, index) => (
                                        <MenuItem key={index} value={province.code}>{province.full_name}</MenuItem>
                                    )) }
                                </Select>

                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="select-district">Quận, huyện</InputLabel>
                                <Select
                                    labelId="select-district"
                                    id="select-district"
                                    MenuProps={{ autoFocus: false }}
                                    onChange={(e) => changeDistrict(e)}
                                    onOpen={() => setOpenDistrict(true)}
                                    onClose={() => {setOpenDistrict(false); setSearchText("")}}
                                    fullWidth
                                    value={districtCode || ''}
                                    className="rounded-lg mb-6"
                                    disabled={disableDistrict}
                                    sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                >
                                    <ListSubheader>
                                        <TextField
                                        size="small"
                                        // Autofocus on textfield
                                        autoFocus
                                        placeholder="Type to search..."
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                            )
                                        }}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key !== "Escape") {
                                            // Prevents autoselecting item while typing (default Select behaviour)
                                            e.stopPropagation();
                                            }
                                        }}
                                        />
                                    </ListSubheader>
                                    {displayedDistricts && displayedDistricts.map((district, index) => (
                                        <MenuItem key={index} value={district.code}>{district.full_name}</MenuItem>
                                    )) }
                                </Select>

                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="select-district">Xã, phường, thị trấn</InputLabel>
                                <Select
                                    labelId="select-ward"
                                    id="select-ward"
                                    MenuProps={{ autoFocus: false }}
                                    onChange={(e) => setWardCode(e.target.value)}
                                    onOpen={() => setOpenWard(true)}
                                    onClose={() => {setOpenWard(false); setSearchText("")}}
                                    fullWidth
                                    value={wardCode || ''}
                                    className="rounded-lg mb-6"
                                    disabled={disableWard}
                                    sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                >
                                    <ListSubheader>
                                        <TextField
                                        size="small"
                                        // Autofocus on textfield
                                        autoFocus = {true}
                                        placeholder="Type to search..."
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                            )
                                        }}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key !== "Escape") {
                                            // Prevents autoselecting item while typing (default Select behaviour)
                                            e.stopPropagation();
                                            }
                                        }}
                                        />
                                    </ListSubheader>
                                    {displayedWards && displayedWards.map((ward, index) => (
                                        <MenuItem key={index} value={ward.code}>{ward.full_name}</MenuItem>
                                    )) }
                                </Select>
                            </FormControl>

                            <input onChange={(event) => setAddress(event.target.value)} type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" placeholder="Địa chỉ cụ thể" required/>
                        </div>

                    </Grid>
                    <Grid xs={8}>

                        <div className="mb-8">
                                <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Học sinh học lớp </div>
                                <div className="grades flex flex-wrap" >
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 1" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade1">Lớp 1</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 2" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade2">Lớp 2</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 3" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade3">Lớp 3</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 4" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade4">Lớp 4</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 5" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade5">Lớp 5</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 6" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade6">Lớp 6</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 7" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade7">Lớp 7</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 8" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade8">Lớp 8</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 9" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade9">Lớp 9</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 10" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade10">Lớp 10</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 11" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade11">Lớp 11</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="radio" id="Lớp 12" name='grade' />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="grade12">Lớp 12</label>
                                    </div>
                                </div>
                                <div className="flex items-center mt-5">
                                    <div className="text-inputLabel text-lg mr-6">Khác</div>
                                    <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                                </div>
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Môn học đăng ký </div>
                            <div className="grades flex flex-wrap" >
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="math" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="math">Toán</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="physics" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="physics">Vật lý</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="chemistry" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="chemistry">Hóa</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="biology" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="biology">Sinh</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="english" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="english">Tiếng Anh</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="literature" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="literature">Văn</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="history" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="history">Lịch sử</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="geography" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="geography">Địa</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="it" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="it">Tin</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(evt) => handleSubjectInput(evt)} className="text-lg leading-10" type="radio" name='subject' id="math-and-vnmese" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="math-and-vnmese">Toán + Tiếng Việt</label>
                                </div>
                                
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-inputLabel text-lg mr-6">Khác</div>
                                <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Học sinh là </div>
                            <div className="grades flex flex-wrap" >
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="goodPupil" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Học sinh khá, giỏi</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="badPupil" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Học sinh yếu, trung bình</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="studentCompetition" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Thi học sinh giỏi</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="toHighSchool" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Ôn thi chuyển cấp 9 lên 10</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="toUniversity" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Ôn thi đại học</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="radio" name='skill' id="ielts" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Thi ielts</label>
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-inputLabel text-lg mr-6">Khác</div>
                                <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                            </div>
                        </div>    

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Đặc điểm tính cách của học sinh</div>
                            <Select
                                labelId="job-select"
                                id="demo-simple-select"
                                value={character}
                                onChange={(evt) => setCharacter(evt.target.value)}
                                fullWidth
                                sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                >
                                <MenuItem value={'hard-working'}>Chăm chỉ</MenuItem>
                                <MenuItem value={'normal'}>Bình thường</MenuItem>
                                <MenuItem value={'lazy'}>Lười</MenuItem>
                                <MenuItem value={'like-game'}>Ham game, mạng xã hội</MenuItem>
                            </Select>
                        </div>

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Thời gian có thể học</div>
                            <table style={{width: '100%'}}>
                                <tbody>
                                    <tr>
                                        <th className="">&nbsp;</th> 
                                        <th>Thứ 2</th>
                                        <th>Thứ 3</th>
                                        <th>Thứ 4</th>
                                        <th>Thứ 5</th>
                                        <th>Thứ 6</th>
                                        <th>Thứ 7</th>
                                        <th>Chủ Nhật</th>
                                    </tr>
                                    <tr >
                                        <td className="font-semibold">Sáng</td>
                                        <td><div id="t2_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t3_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t4_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t5_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t6_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t7_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t8_s" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Chiều</td> 
                                        <td><div id="t2_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t3_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t4_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t5_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t6_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t7_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t8_c" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Tối</td>
                                        <td><div id="t2_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t3_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t4_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t5_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t6_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t7_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                        <td><div id="t8_t" onClick={(event) => selectTeachingTime(event)} className="h-full w-full">&nbsp;</div></td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                        <div className="mb-10 flex">
                            <div className="w-full">
                                <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Số buổi học trong tuần</div>
                                <input 
                                    onChange={(event) => setFrequency(event.target.value)} 
                                    type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-1/2" 
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Mức lương / buổi</div>
                                <input 
                                    onChange={(event) => setSalary(event.target.value)} 
                                    type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-1/2" 
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Yêu cầu khác về gia sư và lớp học</div>
                            <textarea onChange={(event) => setOtherRequirement(event.target.value)} className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full h-44"/>
                        </div>


                    </Grid>
                </Grid>
                <div className="w-full flex justify-center">
                    <input type="submit" className="log-button mb-10 mt-5 cursor-pointer" value='Xác nhận' />

                </div>
            </form>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="bg-white w-max px-6 py-4 translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2 absolute rounded-xl">
                    <div className="text-2xl">Cảm ơn bạn đã lựa chọn <span className="text-teal-700 font-semibold">Gia Sư Tín</span></div>
                    <h4>Thông tin của bạn đã được ghi nhận và đang đợi phê duyệt</h4>
                    <Button variant="outlined" onClick={handleCloseModal} className="my-2">Ok</Button> 
                </div>
            </Modal>
        </div>
    )
}


export default RequestTutorId