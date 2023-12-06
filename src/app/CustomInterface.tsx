export default interface TutorType {
    userID: number,
    name: string,
    phone: string
    school: string,
    specialized: string,
    job: string,
    expTeach: number,
    // subjectRange: Array<string>,
    // classRange: Array<string>,
    skillRange: Array<string>,
    schedule: Array<string>,
    description: string,
    role: string,
    status: string,
    gender: string,
    birth: string,
    address: string,
    avatar: string,
    subjects: Array<Object>,
    subjectIds: string
}

export interface RequestClass {
    requestID: number,
    parentID: number,
    parentName: string,
    phone: string,
    studentGender: string,
    requiredGender: string,
    address: string,
    grade: string,
    subject: string,
    skill: string,
    studentCharacter: string,
    schedule: Array<string>,
    frequency: number,
    salary: number,
    otherRequirement: string,
    status: string
}

export const convertToVNmese = (text: string): string => {
    switch(text) {
        case 'goodPupil': {
            return 'HS khá, giỏi'
        }
        case 'badPupil': {
            return 'HS yếu, trung bình'
        }
        case 'studentCompetition': {
            return 'Ôn thi học sinh giỏi'
        }
        case 'toHighSchool': {
            return 'Ôn thi chuyển cấp 9 lên 10'
        }
        case 'toUniversity': {
            return 'Ôn thi đại học'
        }
        case 'ielts': {
            return 'Ôn thi ielts'
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
