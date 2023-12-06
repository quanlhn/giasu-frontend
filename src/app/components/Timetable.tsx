import React from "react"
import { useRef, useEffect } from "react"

export interface Props {
    timetable: Array<string>
}

const Timetable = ({timetable}: Props) => {
    const sessionsRef = useRef<(HTMLDivElement)[]>([])

    useEffect(() => {
        sessionsRef.current.forEach(divElement => {            
            if (timetable.includes(divElement.id)) {
                divElement.classList.add('bg-green-400')
            }
        })
    }, [])

    const getStyle = (e: any) => {
        console.log(e.target.id)
    }
    
    return (
        <table style={{width: '100%', marginLeft: '10px', marginRight: '10px', fontSize: '10px'}}>
            <tbody>
                <tr style={{height: '25px'}}>
                    <th className="">&nbsp;</th> 
                    <th>Thứ 2</th>
                    <th>Thứ 3</th>
                    <th>Thứ 4</th>
                    <th>Thứ 5</th>
                    <th>Thứ 6</th>
                    <th>Thứ 7</th>
                    <th>Chủ Nhật</th>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Sáng</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[0] = el} id="t2_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[1] = el} id="t3_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[2] = el} id="t4_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[3] = el} id="t5_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[4] = el} id="t6_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[5] = el} id="t7_s" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[6] = el} id="t8_s" className="h-full w-full">&nbsp;</div></td>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Chiều</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[7] = el} id="t2_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[8] = el} id="t3_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[9] = el} id="t4_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[10] = el} id="t5_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[11] = el} id="t6_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[12] = el} id="t7_c" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[13] = el} id="t8_c" className="h-full w-full">&nbsp;</div></td>
                </tr>
                <tr style={{height: '25px'}}>
                    <td className="font-semibold">Tối</td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[14] = el} id="t2_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[15] = el} id="t3_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[16] = el} id="t4_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[17] = el} id="t5_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[18] = el} id="t6_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[19] = el} id="t7_t" className="h-full w-full">&nbsp;</div></td>
                    <td><div ref={(el: HTMLDivElement) => sessionsRef.current[20] = el} id="t8_t" className="h-full w-full">&nbsp;</div></td>
                </tr>

            </tbody>
        </table>
    )
}

export default Timetable