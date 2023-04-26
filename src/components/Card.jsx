import React, { useEffect, useState } from 'react'
// import Axios from '../constants/axiosConfig'

import { Backdrop, CircularProgress } from '@mui/material';

// Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
dayjs.locale('th');
dayjs.extend(buddhistEra);
dayjs.extend(relativeTime);

export default function Card({ displayName }) {
    const [open, setOpen] = useState(false);
    const [task, setTask] = useState([]);


    useEffect(() => {
        setOpen(true);
        getTask();
        console.log(displayName);
    }, [])

    const getTask =  () => {
         axios.post('http://localhost:3333/task/get/history', {
            user: displayName
        })
            .then((res) => {
                console.log("data",res.data);
                // setTask(res.data);
                setOpen(false);
            })
            .catch((err) => {
                console.log(err)
            })
            console.log("end" + task)

    }


    return (
        <>
            {
                task.length > 0 && (
                    task.map((item, index) => {
                    return (
                        <div className="flex justify-center h-40 mt-5" key={index}>
                            <div className=" w-full mx-4 rounded-lg shadow-lg flex flex-row  border border-gray-500">
                                <div className='mx-2 flex justify-center flex-col'>
                                    <img className=" w-32 h-32 object-cover rounded-lg" src={item.imgStart} alt="avatar" />
                                </div>
                                <div className='flex flex-col justify-center'>
                                    <h1 className='ml-2 mt-2 text-gray-500'>
                                        <b>รายละเอียด: </b>{item.detail}
                                    </h1>
                                    <h1 className='ml-2 text-gray-500'>
                                        <b>สถานะ: </b> เสร็จสิ้น
                                    </h1>
                                    <h1 className='ml-2 text-gray-500'>
                                        <b>วันที่แจ้ง: </b>{dayjs().to(dayjs.unix(item.startDate_timeStamp))}
                                    </h1>
                                    <h1 className='ml-2 mb-2 text-gray-500'>
                                        <b>สถานที่: </b>{item.address}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    );
                })
                )

            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    )
}
