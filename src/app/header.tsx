import React from "react";
import Link from "next/link";
import { Button, ButtonGroup } from "@mui/material";

const Header = () => {
    return (
        <div>
            <div className="logo text-3xl">GST</div>
            <div className="nav">
                <ButtonGroup className="" variant="text" color="success" aria-label="text button group" >
                    <Button className="w-40">
                        <Link href={'/'} >Trang chủ</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/parents'} >Phụ huynh</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/tutor'} >Gia sư</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/class'} >Lớp mới</Link>
                    </Button>
                    <Button className="w-40">
                        <Link href={'/forum'} >Diễn đàn</Link>
                    </Button>

                </ButtonGroup>
            </div>
        </div>
    )
}

export default Header