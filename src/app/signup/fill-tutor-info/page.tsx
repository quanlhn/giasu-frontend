'use client'

import React, { useEffect } from "react";
import { useState, useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import SearchIcon from "@mui/icons-material/Search";
import ListSubheader from "@mui/material/ListSubheader";
import { InputAdornment } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { API_PATH } from "@/app/page";
import UserContext from "@/app/UserContext";
import Cookies from "js-cookie";

const FillTutorInfo = () => {
    const user = useContext(UserContext)
    const [file, setFile] = useState();
    const [name, setName] = useState<String>()
    const [gender, setGender] = useState('')
    const [birth, setBirth] = React.useState<Dayjs | null>(null);
    const [phone, setPhone] = useState<String>()
    const [address, setAddress] = useState('')
    const [school, setSchool] = useState('')
    const [specialized, setSpecialized] = useState('')
    const [job, setJob] = React.useState('');
    const [expTeach, setExpTeach] = useState<number>()
    const [classRange, setClassRange] = useState<Array<String>>([])
    const [subjectRange, setSubjectRange] = useState<Array<String>>([])
    const [skillRange, setSkillRange] = useState<Array<String>>([])
    const [schedule, setSchedule] = useState<Array<String>>([])

    const [provinces, setProvinces] = useState<Array<any>>([])
    const [districts, setDistricts] = useState<Array<any>>([])
    const [disableDistrict, setDisableDistrict] = useState(true)
    const [wards, setWards] = useState<Array<any>>([])
    const [disableWard, setDisableWard] = useState(true)

    const [provinceCode, setProvinceCode] = useState('')
    const [districtCode, setDistrictCode] = useState('')
    const [wardCode, setWardCode] = useState('')

    const [searchText, setSearchText] = useState("");
    const [selectedProvince, setSelectedProvince] = useState()
    const [displayProvince, setDisplayProvince] = useState<Array<any>>()

    const [subjects, setSubjects] = useState([
        {
            subject: 'Toán',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Vật lý',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Hóa',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Sinh',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Tiếng Anh',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Văn',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Lịch sử',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Địa',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Tin',
            canTeach: false,
            grade: new Array<any>()
        },
        {
            subject: 'Toán + TV',
            canTeach: false,
            grade: new Array<any>()
        }
    ])
    const [disabledSelects, setDisabledSelects] = useState([])
    const [displayedProvinces, setDisplayedProvinces] = useState<Array<any>>()
    const [displayedDistricts, setDisplayedDistricts] = useState<Array<any>>()
    const [displayedWards, setDisplayedWards] = useState<Array<any>>()

    const [openProvince, setOpenProvince] = useState(false)
    const [openDistrict, setOpenDistrict] = useState(false)
    const [openWard, setOpenWard] = useState(false)
    
    const [description, setDescription] = useState('')
    const [openModal, setOpenModal] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // setName(user.user.name)
        // setPhone(user.user.phoneNumber)
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

    const handleSelectFile = (e: any) => setFile(e.target.files[0]);

    const handleSubmit = (event: any) => {
        event.preventDefault()
 
        const convert_classRange = classRange.join(',')
        const convert_subjectRange = subjectRange.join(',')
        const convert_skillRange = skillRange.join(',')
        const convert_schedule = schedule.join(',')
        const convert_birth = dayjs(birth).format('YYYY-MM-DD')
        const cookie = Cookies.get('accessToken')

        var formData = new FormData();
        // console.log(file)
        if (file ) {
            console.log('hihi')
            formData.append("avatar", file)   
        }
        if ( user.user.userID) {
            formData.append("userID", user.user.userID.toString() )
        }
        
        fetch(API_PATH + 'upload/upload-image', {
            method: 'POST',
            body: formData,
        })
     
        fetch(API_PATH + 'tutor/tutorregister', {
            method: 'POST',
            mode: 'cors', 
            headers: {
                'Content-Type': 'application/json',
                'x_authorization': `${cookie}`,
            },
            body: JSON.stringify({
                userId: user.user.userID,
                name: name ? name : user.user.name ,
                phone: phone ? phone : user.user.phoneNumber,
                specialized,
                school,
                job,
                expTeach,
                subjectRange: convert_subjectRange,
                classRange: convert_classRange,
                skillRange: convert_skillRange,
                subjects,
                schedule: convert_schedule,
                description: description,
                role: 'tutor',
                status: 'confirming',
                gender,
                birth: convert_birth,
                address: wardCode
            })
        })
        .then(res => res.json())
        .then(data => {
                setOpenModal(true)
                // console.log(data)
                
        })
    }

    const handleGradeInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        // console.log(evt.currentTarget.name)
        if (evt.currentTarget.checked) {
            setClassRange([...classRange, evt.currentTarget.name])
        } else {
            const t_classRange = classRange.filter(c => c != evt.currentTarget.name)
            setClassRange(t_classRange)
        }
    }

    const handleSubjectInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>, index: number) => {
        // console.log(evt.currentTarget.name)
        if (evt.currentTarget.checked) {
            const nextSubjects = subjects.map((e, i) => {
                if (i == index) {
                    return {subject: e.subject, canTeach: true, grade: e.grade}
                } else {
                    return e
                }
            })
            setSubjects(nextSubjects)
            setSubjectRange([...subjectRange, evt.currentTarget.name])
        } else {
            const nextSubjects = subjects.map((e, i) => {
                if (i == index) {
                    return {subject: e.subject, canTeach: false, grade: e.grade}
                } else {
                    return e
                }
            })
            setSubjects(nextSubjects)
            const t_subjectRange = subjectRange.filter(c => c != evt.currentTarget.name)
            setSubjectRange(t_subjectRange)
        }
    }

    const handleChangeSubjects = (grades: Array<any>, index: any) => {
        const nextSubjects = subjects.map((e, i) => {
            if (i == index) {
                return {subject: e.subject, canTeach: e.canTeach, grade: grades}
            } else {
                return e
            }
        })
        setSubjects(nextSubjects)
        // console.log(subjects)
        
    }

    const handleSkillInput = (evt: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        // console.log(evt.currentTarget.name)
        if (evt.currentTarget.checked) {
            setSkillRange([...skillRange, evt.currentTarget.name])
        } else {
            const t_skillRange = skillRange.filter(c => c != evt.currentTarget.name)
            setSkillRange(t_skillRange)
        }
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
        // router.push('/class')
    }

    const changeProvince = (e: any) => {
        setDisableDistrict(false)
        // console.log(e.target.value)
        setProvinceCode(e.target.value)
        setSelectedProvince(() => {
            // console.log(provinces.filter(p => p.code == e.target.value)[0].full_name)
            return provinces.filter(p => p.code == e.target.value)[0].full_name

        })
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

    

    

    // const displayedProvinces = useMemo(
    //     () => provinces.filter((option: any) => containsText(option, searchText)),
    //             [searchText]
    // )
   

    return (
        <div className="">
            <form className="mx-10 px-6 bg-[#FAF8F8] mt-16" onSubmit={handleSubmit} >
                <div className="text-inputLabel text-3xl mx-2 pt-4">Đăng ký thông tin làm gia sư</div>
                <hr className="w-[30%] mb-5"/>
                <Grid container spacing={10} >
                    <Grid xs={4} className=''>
                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Ảnh đại diện</div>
                            <input 
                                type="file"
                                name="avatar"
                                onChange={handleSelectFile}
                                multiple={false}
                            />
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Họ và tên</div>
                            <input 
                                onChange={(event) => setName(event.target.value)} 
                                type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" 
                                required
                                defaultValue={user.user.name}
                            />
                        </div>
                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn là: </div>
                            <input onClick={(evt) => setGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="gender" id="male" />
                            <label className="text-lg leading-10 ml-2" htmlFor="male">Nam</label>
                            <br />
                            <input onClick={(evt) => setGender(evt.currentTarget.id)} className="text-lg leading-10" type="radio" name="gender" id="female" />
                            <label className="text-lg leading-10 ml-2" htmlFor="female">Nữ</label>
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Ngày sinh</div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker 
                                    value={birth} 
                                    onChange={(newValue) => setBirth(newValue)}
                                    sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                /> 
                            </LocalizationProvider>
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

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Địa chỉ hiện tại</div>
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
                                    {displayedWards && displayedWards.map((ward, index) => (
                                        <MenuItem key={index} value={ward.code}>{ward.full_name}</MenuItem>
                                    )) }
                                </Select>
                            </FormControl>


                            <input onChange={(event) => setAddress(event.target.value)} type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" placeholder="Địa chỉ cụ thể" required/>

                        </div>

                    </Grid>
                    <Grid xs={8}>
                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn học trường gì</div>
                            <input onChange={(event) => setSchool(event.target.value)} type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-[50%]" required/>
                        </div>
                        
                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Chuyên ngành</div>
                            <input onChange={(event) => setSpecialized(event.target.value)} type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-[50%]" required/>
                        </div>

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Nghề nghiệp hiện tại</div>
                            <Select
                                labelId="job-select"
                                id="demo-simple-select"
                                value={job}
                                onChange={(evt) => setJob(evt.target.value)}
                                fullWidth
                                sx={{backgroundColor: '#fff', filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));'}}
                                >
                                <MenuItem value={'1YearStudent'}>Sinh viên năm nhất</MenuItem>
                                <MenuItem value={'2YearStudent'}>Sinh viên năm hai</MenuItem>
                                <MenuItem value={'3YearStudent'}>Sinh viên năm ba</MenuItem>
                                <MenuItem value={'4YearStudent'}>Sinh viên năm bốn</MenuItem>
                                <MenuItem value={'teacher'}>Giáo viên</MenuItem>
                                <MenuItem value={'lecturer'}>Giảng viên</MenuItem>
                                <MenuItem value={'other'}>Khác</MenuItem>
                            </Select>
                        </div>

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn đã từng đi dạy chưa</div>
                            <input onClick={(event) => setExpTeach(1)} className="text-lg leading-10" type="radio" name="haveTaught" id="yes" />
                            <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Rồi</label>
                            
                            <input onClick={(event) => setExpTeach(0)} className="text-lg leading-10" type="radio" name="haveTaught" id="no" />
                            <label className="text-lg leading-10 ml-2" htmlFor="female">Chưa</label>
                        </div>

                        {/* <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn có thể dạy học sinh: </div>
                            <div className="grades flex flex-wrap" >
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade1" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 1</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade2" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 2</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade3" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 3</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade4" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 4</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade5" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 5</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade6" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 6</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade7" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 7</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade8" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 8</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade9" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 9</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade10" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 10</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade11" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 11</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleGradeInput(event)} className="text-lg leading-10" type="checkbox" name="grade12" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lớp 12</label>
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-inputLabel text-lg mr-6">Khác</div>
                                <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                            </div>
                            
                        </div> */}

                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn có thể dạy môn </div>
                            <div className="box" >
                                {subjects.map((subject, index) => {
                                    return (
                                        <div className="flex items-center" key={index}>
                                            <div className="flex items-center w-28">
                                                <input onClick={(evt) => handleSubjectInput(evt, index)} className="text-lg leading-10" type="checkbox" name="math" />
                                                <label className="text-lg leading-10 ml-2" htmlFor="male">{subject.subject}</label>
                                            </div>
                                            <MultipleSelect 
                                                isDisable = {!subjects[index].canTeach} 
                                                setGrades={(grades) => handleChangeSubjects(grades, index)} 
                                                subject={subject.subject}
                                            />
                                        </div>
                                       //grades flex flex-col flex-wrap h-96 justify-between
                                       // <Grid container spacing={1} className=" items-center" key={index} >    
                                        //     <Grid xs={3} >
                                        //         <input onClick={(evt) => handleSubjectInput(evt, index)} className="text-lg leading-10" type="checkbox" name="math" />
                                        //         <label className="text-lg leading-10 ml-2" htmlFor="male">{subject.subject}</label>
                                        //     </Grid>
                                        //     <Grid xs={9} >
                                        //         <MultipleSelect 
                                        //             isDisable = {!subjects[index].canTeach} 
                                        //             setGrades={(grades) => handleChangeSubjects(grades, index)} 
                                        //             subject={subject.subject}
                                        //         />
                                        //     </Grid>
                                        // </Grid>
                                    )
                                })}
                            </div>
                            {/* <Grid container spacing={4}>
                                <Grid xs={6}>
                                    <div className="mr-5 flex items-center" >
                                        <div>
                                            <input onClick={(evt) => handleSubjectInput(evt, 0)} className="text-lg leading-10" type="checkbox" name="math" />
                                            <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Toán</label>
                                        </div>
                                        <MultipleSelect isDisable = {!subjects[0].canTeach} setGrades={(grades) => handleChangeSubjects(grades, 0)} />
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 1)} className="text-lg leading-10" type="checkbox" name="physics" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Vật lý</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 2)} className="text-lg leading-10" type="checkbox" name="chemistry" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Hóa</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 3)} className="text-lg leading-10" type="checkbox" name="biology" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Sinh</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 4)} className="text-lg leading-10" type="checkbox" name="english" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Tiếng Anh</label>
                                    </div>
                                </Grid>
                                <Grid xs={6} >
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 5)} className="text-lg leading-10" type="checkbox" name="literature" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Văn</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 6)} className="text-lg leading-10" type="checkbox" name="history" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Lịch sử</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 7)} className="text-lg leading-10" type="checkbox" name="geography" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Địa</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 8)} className="text-lg leading-10" type="checkbox" name="it" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Tin</label>
                                    </div>
                                    <div className="mr-5" >
                                        <input onClick={(evt) => handleSubjectInput(evt, 9)} className="text-lg leading-10" type="checkbox" name="math-and-vnmese" />
                                        <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Toán + Tiếng Việt</label>
                                    </div>
                                </Grid >
                            </Grid> */}
                            <div className="flex items-center mt-5">
                                <div className="text-inputLabel text-lg mr-6">Khác</div>
                                <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                            </div>
                        </div>
                        <div className="mb-8">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Bạn có thể dạy </div>
                            <div className="grades flex flex-wrap" >
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="goodPupil" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Học sinh khá, giỏi</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="badPupil" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Học sinh yếu, trung bình</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="studentCompetition" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Thi học sinh giỏi</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="toHighSchool" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Ôn thi chuyển cấp 9 lên 10</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="toUniversity" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Ôn thi đại học</label>
                                </div>
                                <div className="mr-5" >
                                    <input onClick={(event) => handleSkillInput(event)} className="text-lg leading-10" type="checkbox" name="ielts" id="male" />
                                    <label className="text-lg leading-10 ml-2 mr-10" htmlFor="male">Thi ielts</label>
                                </div>
                            </div>
                            <div className="flex items-center mt-5">
                                <div className="text-inputLabel text-lg mr-6">Khác</div>
                                <input type="text" className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full" />
                            </div>
                        </div>

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Thời gian bạn có thể dạy</div>
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

                        <div className="mb-10">
                            <div className="label ml-3 mb-3 text-inputLabel text-xl font-semibold">Hãy mô tả thêm về kinh nghiệm và thành tích của bạn</div>
                            <textarea onChange={(event) => setDescription(event.target.value)} className="white rounded-2xl text-lg px-3 py-1.5 shadow-lg w-full h-44"/>
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Lớp 1',
  'Lớp 2',
  'Lớp 3',
  'Lớp 4',
  'Lớp 5',
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12'
];

function getStyles(name: any, personName: any, theme: any) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface Props {
    setGrades: (grades: Array<any>) => void,
    isDisable: boolean,
    subject: string
}


function MultipleSelect({setGrades, isDisable, subject} : Props) {
    const theme = useTheme();
    const [grades, setPersonName] = React.useState([]);
  
    const handleChange = (event: any) => {
        const { target: { value }, } = event;
        setPersonName(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
        setGrades(value)
    
    };
  
    return (
      <div>
        <FormControl sx={{ m: 0.5, width: 270 }}>
          <InputLabel id="demo-multiple-name-label">{subject} lớp...</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={grades}
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
            disabled={isDisable}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, grades, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }

export default FillTutorInfo


// Đại học Công nghệ - ĐHQGHN
// Đại học Ngoại ngữ - ĐHQGHN
// Đại học Kinh tế - ĐHQGHN
// Công nghệ thông tin
// Ngôn ngữ Anh
// Kinh tế đối ngoại