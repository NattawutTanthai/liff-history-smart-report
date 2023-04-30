import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
import ImageProfile from "./components/ImageProfile";
import icon from "./assets/icon.png";
import { Backdrop, CircularProgress } from '@mui/material';
import Axios from './constants/axiosConfig'

// Day.js
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import relativeTime from 'dayjs/plugin/relativeTime';
import Swal from "sweetalert2";
dayjs.locale('th');
dayjs.extend(buddhistEra);
dayjs.extend(relativeTime);

function App() {
  const [task, setTask] = useState([]);
  const [profile, setProfile] = useState({});
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const getTask = (displayName) => {
    Axios.post('/task/get/history', {
      user: displayName
    })
      .then((res) => {
        console.log("data", res.data);
        setTask(res.data);
        setOpen(false);
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    setOpen(true);
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          liff.getProfile().then((profile) => {
            setProfile(profile);
            getTask(profile.displayName)
          });
        }
      })
      .catch((e) => {
        setError(`${e}`);
      });
  }, []);

  const handleFeedback = (id) => {
    Swal.fire({
      title: '1-5 คะแนน \n โดย 1 คือ ไม่พอใจ \n5 คือ พอใจมาก',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'ส่งคะแนน',
      showLoaderOnConfirm: true,
      preConfirm: (point) => {
        console.log(point);
        if (point > 5 || point < 1) {
          return Swal.showValidationMessage(
            `กรุณาใส่คะแนน 1-5`
          )
        } else if (point == "") {
          return Swal.showValidationMessage(
            `กรุณาใส่คะแนน`
          )
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    })
      .then((result) => {
        if (result.isConfirmed) {
          Axios.put(`/task/${id}`, {
            point: parseInt(result.value)
          })
            .then((res) => {
              console.log(res.data);
              Swal.fire({
                title: `ขอบคุณสำหรับการให้คะแนน`,
                icon: 'success',
                confirmButtonText: 'ตกลง',

              })
              window.location.reload();
            })
            .catch((err) => {
              console.log(err);
            })

        }
      })
  }

  return (
    <>
      <div className="flex justify-center flex-col">
        <img src={icon} alt="icon" className="w-64 mx-auto mt-5" />
        <div className=" flex justify-center ">
          <h1 className="text-2xl text-gray-500">ประวัติการแจ้งปัญหา</h1>
        </div>
        <div className=" flex justify-center ">
          <h1 className="text-2xl text-gray-500">สถิติการแจ้งเสร็จสิ้น : {task.length} ครั้ง</h1>
        </div>
        <ImageProfile
          displayName={profile.displayName}
          pictureUrl={profile.pictureUrl}
        />
        {
          task.map((item, index) => {
            return (
              <div className="flex justify-center h-44 mt-5" key={index}>
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
                    <div className=" flex justify-between">
                      {
                        item.point >= 1
                          ?
                          <>
                            <h1 className='ml-2 mb-2 text-gray-500'>
                              <b>คะแนน: </b>{item.point} คะแนน
                            </h1>
                          </>
                          :
                          <>
                            <h1 className='ml-2 mb-2 text-gray-500'>
                              <b>คะแนน: </b>-
                            </h1>
                            <button onClick={() => handleFeedback(item._id)} className="bg-[#E17B62] mr-2 mb-2 rounded-lg border border-gray-500 p-1">
                              <h1 className="text-white px-3">ให้คะแนน</h1>
                            </button>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default App;
