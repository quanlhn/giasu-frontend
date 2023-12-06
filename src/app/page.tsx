'use client'

import Image from 'next/image';
import * as React from 'react';
import { useState, useEffect } from 'react';
import Button, { ButtonPropsColorOverrides } from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import Link from 'next/link';
import MarkUnreadChatAltOutlinedIcon from '@mui/icons-material/MarkUnreadChatAltOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation } from 'swiper/modules';

import TutorType from './CustomInterface';
import { Result } from 'postcss';
import { API_PATH } from './CustomInterface';






export default function Home() {

  const [tags, setTags] = useState('all')
  const [tutors, setTutors] = useState<Array<TutorType>>()
  const [tutorsSubjects, setTutorsSubjects] = useState<Array<Array<any>>>([])
  const handleChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
    setTags(value)
    
  }

  const defaultTutor = {
    userID: 0,
    name: '',
    phone: '',
    school: '',
    specialized: '',
    job: '',
    expTeach: 0,
    subjects: [{}],

    skillRange: [''],
    schedule: [''],
    description: '',
    status: '',
    role: '',
    gender: '',
    birth: '',
    address: '', 
    avatar: ''
  }

  useEffect(() => {
    const allTutors = new Array<TutorType>()

    fetch(API_PATH + 'tutor/get-confirmed-tutors')
    .then(res => res.json())
    .then(data => {
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
      // console.log(allTutors)
      setTutors(() => allTutors)
    })
  }, [])

  useEffect(() => {
    const subjects: any[] = []
    tutors?.forEach((result) => {
      fetch(API_PATH + 'tutor/getSubjectsOfTutors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: result.subjectIds
        })
      })
        .then(res => res.json())
        .then(data => {
          const c_subjects = data.subject.map((s: any) => {
            return {id: s.id ,tutorId: result.userID, name: s.name, grade: s.grade}
          })
          const count = subjects.push(c_subjects)
          if (subjects.length == tutors.length) {
            setTutorsSubjects(subjects)
          }
        })
    })
  }, [tutors])

  return (
    <div className='mt-[-12px]'>
      <div className='h-[30rem] px-12 pt-6 bg-headerbg flex justify-between rounded-b-3xl'>
        <div className='w-[75%]'>
          <div className='text-teal-700 text-5xl  font-bold leading-[75px] pt-10 ml-10 '>
            Uy tín - Tận tâm - Chuyên nghiệp <br /> Giáo dục tiến bộ,<br /> Hướng tới tương lai
          </div>
          <div className='m-10 flex items-center'>
            <button className='bg-apple w-32 px-2 py-2 rounded-md text-xl font-semibold'>Khám phá</button> 
            <div className='flex ml-5'>
              <Avatar src='/avatar.JPG' />
              <Avatar src='/avatar2.JPG' className='ml-[-15px]'/>
              <Avatar src='/avatar.JPG' className='ml-[-15px]'/>
            </div>
            <div className="div ml-3">
              <div className="stars flex">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarHalfIcon />
              </div>
              <div className='text-sm'>
                (10k+ Nhận xét)
              </div>
            </div>
          </div>
        </div>
        <div className='pr-10'>
          <img src='/HomepagePoster.png' className='h-full' alt=''></img>
        </div>
      </div>
      <div className='px-12 mt-14'>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-5xl text-apple font-bold mb-10'>Gia sư của trung tâm</div>
          <ToggleButtonGroup
            value={tags}
            exclusive
            onChange={handleChange}
            sx={{
              display: "grid",
              gridTemplateColumns: "auto auto auto auto auto auto",
              gridGap: "50px",
              padding: "10px",
              
            }}
          >
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='all' aria-label="list">Tất cả</ToggleButton>
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='math'>Toán</ToggleButton>
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='physics'>Lý</ToggleButton>
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='chemistry'>Hóa</ToggleButton>
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='english'>Tiếng Anh</ToggleButton>
              <ToggleButton sx={{boxShadow:'0.5px 0.5px 5px 0.5px #d4d4d4', width: "8rem"}} color='warning' value='advanced'>Nâng cao</ToggleButton>
            {/* <div className='flex gap-10>
            </div> */}
          </ToggleButtonGroup>
        </div>
        <div className="mt-10"> 
            {/* <div className="splide" >
              <div className="slide__track">
                <ul className='splide__list'>
                  {tutors && tutors.map((tutor, index) => (
                  <li
                    className='splide__slide'
                  >
                    <Card tutor={tutor} subjects={tutorsSubjects[index]} key={index}/>
                  </li>
                  ))}
                </ul>
              </div>
            </div> */}

            <Swiper
              slidesPerView={4}
              spaceBetween={100}
              className='mySwiper'
              loop={true}
              navigation={true}
              modules={[Navigation]}
            >
               {tutors && tutors.map((tutor, index) => (
                <SwiperSlide
                  
                >
                  <Card tutor={tutor} subjects={tutorsSubjects[index]} key={index}/>
                </SwiperSlide>
                ))}
               {tutors && tutors.map((tutor, index) => (
                <SwiperSlide
                  
                >
                  <Card tutor={tutor} subjects={tutorsSubjects[index]} key={index}/>
                </SwiperSlide>
                ))}
            </Swiper>

            {/* <Splide aria-label="My Favorite Images" 
              options={{
                perPage: 4,
                perMove: 1,
                rewind: true,
                gap: '7rem',
                type: 'loop',
                autoplay: true,
              }}
            >
              
              {tutors && tutors.map((tutor, index) => (
                <SplideSlide
                  
                >
                  <Card tutor={tutor} subjects={tutorsSubjects[index]} key={index}/>
                </SplideSlide>
              ))}                       
            </Splide> */}

        </div>
        
        <div className="group-class flex flex-col justify-center items-center mt-20">
          <div className='text-5xl text-teal-700 font-bold mb-4'>Khóa Học Nhóm</div>
          <div className="description px-44 text-lg text-center">Hình thức học thêm tại các nhóm lớp từ 10 - 15 học sinh giúp tạo môi trường học tập với bạn bè, giảm thiểu chi phí nhưng vẫn đảm bảo chất lượng. Hiện Gia Sư Tín đã mở các lớp học nhóm mọi môn học với đội ngũ giáo viên chất lượng cao</div>
          <div className="cards w-full flex gap-[6.6%] pt-14">
            <div className="card w-[20%] h-[26rem] shadow-2xl rounded-xl p-3 flex flex-col items-center relative">
              <Avatar className='w-24 h-24' src='avatar.JPG'/>
              <div className='w-full text-left mt-5 text-lg text-teal-700 font-semibold'>Lớp Toán 9, Luyện thi cấp III</div>
              <div className='w-full text-left italic'>10 - 15 HS / Lớp</div>
              <div className='w-full text-left italic'>100k / 120p / Buổi</div>
              <div className='w-full text-left pt-2'>Lớp học do thầy LHNQ dạy, ôn thi vào 10 mục tiêu 9 - 10 điểm. <br />Thầy LHNQ là giảng viên ĐHSPHN, đã có 12 năm kinh nghiệm ôn thi vào 10.</div>
              <div className='w-full text-right pb-2'><Link className='text-teal-700 italic' href={'/'}>Chi tiết &gt;&gt;&gt;</Link></div>
              <div className='absolute bottom-2'><button className='bg-teal-700 text-white px-3 py-1 rounded-lg' >Đăng ký ngay</button></div>
            </div>
            <div className="card w-[20%] h-[26rem] shadow-2xl rounded-xl p-3 flex flex-col items-center relative">
              <Avatar className='w-24 h-24' src='avatar.JPG'/>
              <div className='w-full text-left mt-5 text-lg text-teal-700 font-semibold'>Lớp Toán 9, Luyện thi cấp III</div>
              <div className='w-full text-left italic'>10 - 15 HS / Lớp</div>
              <div className='w-full text-left italic'>100k / 120p / Buổi</div>
              <div className='w-full text-left pt-2'>Lớp học do thầy LHNQ dạy, ôn thi vào 10 mục tiêu 9 - 10 điểm. <br />Thầy LHNQ là giảng viên ĐHSPHN, đã có 12 năm kinh nghiệm ôn thi vào 10.</div>
              <div className='w-full text-right pb-2'><Link className='text-teal-700 italic' href={'/'}>Chi tiết &gt;&gt;&gt;</Link></div>
              <div className='absolute bottom-2'><button className='bg-teal-700 text-white px-3 py-1 rounded-lg' >Đăng ký ngay</button></div>
            </div>
            <div className="card w-[20%] h-[26rem] shadow-2xl rounded-xl p-3 flex flex-col items-center relative">
              <Avatar className='w-24 h-24' src='avatar.JPG'/>
              <div className='w-full text-left mt-5 text-lg text-teal-700 font-semibold'>Lớp Toán 9, Luyện thi cấp III</div>
              <div className='w-full text-left italic'>10 - 15 HS / Lớp</div>
              <div className='w-full text-left italic'>100k / 120p / Buổi</div>
              <div className='w-full text-left pt-2'>Lớp học do thầy LHNQ dạy, ôn thi vào 10 mục tiêu 9 - 10 điểm. <br />Thầy LHNQ là giảng viên ĐHSPHN, đã có 12 năm kinh nghiệm ôn thi vào 10.</div>
              <div className='w-full text-right pb-2'><Link className='text-teal-700 italic' href={'/'}>Chi tiết &gt;&gt;&gt;</Link></div>
              <div className='absolute bottom-2'><button className='bg-teal-700 text-white px-3 py-1 rounded-lg' >Đăng ký ngay</button></div>
            </div>
            <div className="card w-[20%] h-[26rem] shadow-2xl rounded-xl p-3 flex flex-col items-center relative">
              <Avatar className='w-24 h-24' src='avatar.JPG'/>
              <div className='w-full text-left mt-5 text-lg text-teal-700 font-semibold'>Lớp Toán 9, Luyện thi cấp III</div>
              <div className='w-full text-left italic'>10 - 15 HS / Lớp</div>
              <div className='w-full text-left italic'>100k / 120p / Buổi</div>
              <div className='w-full text-left pt-2'>Lớp học do thầy LHNQ dạy, ôn thi vào 10 mục tiêu 9 - 10 điểm. <br />Thầy LHNQ là giảng viên ĐHSPHN, đã có 12 năm kinh nghiệm ôn thi vào 10.</div>
              <div className='w-full text-right pb-2'><Link className='text-teal-700 italic' href={'/'}>Chi tiết &gt;&gt;&gt;</Link></div>
              <div className='absolute bottom-2'><button className='bg-teal-700 text-white px-3 py-1 rounded-lg' >Đăng ký ngay</button></div>
            </div>
          </div>
          
        </div>

        <div className="flex mt-20 h-80">
          <div className="info w-[48%]">
            <div className='bg-slate-200 max-w-[6rem] px-2 py-1 text-center rounded-lg text-[#0B7077]'>Tiện ích</div>
            <div className='text-teal-700 text-5xl font-bold mt-6
            '>Tạo lớp học trực tuyến</div>
            <div className='mt-6 text-lg pr-8'>
              <div className='flex items-start'>
                <MarkUnreadChatAltOutlinedIcon className='w-8 h-8 mt-2' /> 
                <div className='ml-4'> Gia sư và học sinh hoặc phụ huynh có thể nhắn tin và trao đổi thông tin, tài liệu trực tuyến trên website </div>
              </div>
              <div className='flex items-start'>
                <ManageSearchOutlinedIcon className='w-8 h-8 mt-2' />
                <div className='ml-4'>Giúp gia sư quản lý các lớp học đã nhận dễ hơn, học sinh có thể cập nhật thông tin và thông báo sớm nhất</div>
              </div>
            </div>
          </div>
          <div className="img relative w-[45%]">
            <img src="background.jpg" alt="" className='w-full h-80 absolute top-0 opacity-30'/>
            <img src="test.png" alt="" className='absolute top-2 left-4 w-[95%] h-[19rem]'/>
          </div>
        </div>

        <div className="why-us flex mt-52 mx-14  relative h-72 bg-orange-300 rounded-2xl">
          <div className='text-text-text w-1/2 pt-4 pl-5 '>
            <div className='text-white text-5xl font-bold '>Tại sao nên chọn Gia Sư Tín</div>
            <div className='flex mt-8 ml-4'>
              <VerifiedOutlinedIcon className='text-white'/>
              <div className='text-white pl-2'>Đội ngũ giáo viên chất lượng, có nhiều kinh nghiệm dạy tại các trường lớn</div>
            </div>
            <div className='flex mt-5 ml-4'>
              <VerifiedOutlinedIcon className='text-white'/>
              <div className='text-white pl-2'>Các gia sư là sinh viên được chọn lọc kỹ càng, đảm bảo đúng chất lượng</div>
            </div>
            <div className='flex mt-5 ml-4'>
              <VerifiedOutlinedIcon className='text-white'/>
              <div className='text-white pl-2'>Không ngừng hỗ trợ gia sư và giáo viên trong quá trình giảng dạy</div>
            </div>
            <button className='text-white text-lg font-medium bg-teal-400 p-2 rounded-lg mt-8 ml-44'>Đăng ký ngay</button>
          </div>
          <div className=' '>
            <img src="whyUs.png" alt="" className='absolute bottom-0 right-10 h-[32rem]'/>     
          </div>
        </div>

      </div>
    </div>
  );
}

interface Props {
  tutor: TutorType
  subjects: any[]
}




const Card = ({tutor, subjects} : Props) => {

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
      // case "4YearStudent": 
      //   return 'Sinh viên năm nhất'
    }
  }

  const getAllSubject = () => {
    const result = new Array()
    if (subjects) {
      subjects.forEach(s => {
        if (!result.includes(s.name)) {
          result.push(s.name)
        }
      })
      return result.join(' / ')

    }
    return 0
  }

  return (
    <div className="card w-64 h-[30rem] shadow-xl rounded-xl p-3 flex flex-col items-center relative">
      <img src={tutor.avatar} alt="" className='w-full h-48 rounded-lg'/>
      <div className='max-w-[75%] text-lg font-semibold text-teal-700 bg-slate-200 px-3 py-1 mt-[-10px] text-center rounded-full '>{tutor.name}</div>
      <div className='pt-4 w-full text-left italic'>{convertProperties(tutor.job)}</div>
      <div className='w-full text-left italic'>{tutor.school}</div>
      <div className='w-full text-left font-medium line-clamp-2 text-teal-900'>Gia sư {getAllSubject()}</div>
      <div className='w-full text-left line-clamp-4'>{tutor.description}</div>
      <div className='w-full flex justify-between absolute bottom-2 px-3'>
        <div className='italic text-slate-500'>Đã dạy: 8 lớp</div>
        <Link className='text-teal-700 italic' href={'/'}>Chi tiết &gt;&gt;&gt;</Link>
      </div>
    </div>
  )
}