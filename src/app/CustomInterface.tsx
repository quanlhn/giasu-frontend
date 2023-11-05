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