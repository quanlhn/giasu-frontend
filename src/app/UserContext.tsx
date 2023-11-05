'use client'

import React, { createContext, useState} from "react";

type UserType = {
  userID : number,
  name: string,
  phoneNumber: string,
  email: string,
  role: string,
  isLoggedIn: boolean,
  gender: string,
  birth: string,
}

interface User {
  user: UserType
  setUser : React.Dispatch<React.SetStateAction<UserType>>;
}

const UserContext = createContext({} as User)

export const UserProvider = ({
    children,
  }: {
    children: React.ReactNode
  }) => {
    // const [id, setID] = useState('')
    // const [name, setName] = useState('')
    // const [phoneNumber, setPhoneNumber] = useState('')
    // const [email, setEmail] = useState('')
    // const [isLoggedIn, setIsLoggedIn] = useState(false)
    // const [cartDrawer, setCartDrawer] = useState<Array<Object>>([])

    const [user, setUser] = useState({
      userID: 0,
      name: '',
      phoneNumber: '',
      email: '',
      role:'',
      gender: '',
      birth: '',
      isLoggedIn: false,
  })
    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider> 
    )
}

export default UserContext
