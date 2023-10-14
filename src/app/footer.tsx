import React from "react";
import Link from "next/link";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const Footer = () => {
    return (
        <div className="h-[150px] bg-headerbg mt-24  py-2 flex gap-80 justify-center w-full ">
            <div>
                <h2 className="text-2xl"><strong>Gia Sư Tín</strong></h2>
                <div className="mt-2"><BusinessOutlinedIcon />Địa chỉ: 144 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội</div>
                <div className="mt-2"><LocalPhoneIcon /> Số điện thoại: 0986910JQK</div>
                <div className="mt-2"><MailOutlineIcon /> Email: gst@gmail.com</div>
            </div>
            <div className="flex flex-col gap-4">
                <div><strong>Links</strong></div>
                <Link href={'/about-us'} >About Us</Link>
                <Link href={'/blog'} >Blog</Link>
            </div>
        </div>
    )
}

export default Footer