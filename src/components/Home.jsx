import { Button,Modal,Result,Input, DatePicker,Empty,Spin} from "antd"
import { useEffect, useState } from "react";
import {DeleteFilled,EditFilled,EyeFilled,ClockCircleOutlined} from "@ant-design/icons"
import { getTime,currentDate,getCurrentWeekDays,selectedDate,getSelectedWeekDays} from "../_services/Date.tsx";

const Home=()=>{
    useEffect(()=>{
        setNowDate(currentDate())
        setDate(getCurrentWeekDays())
        fetchTodo({date:new Date().getDate(),year:new Date().getFullYear(),month:new Date().getMonth()})
      },[])

    const thisWeekDays=getCurrentWeekDays()
    const [date,setDate]=useState(thisWeekDays)
    const [nowDate,setNowDate]=useState("")
    const [choosenDate,setChoosenDate]=useState("")
    const [data,setData]=useState([])
    const [modal,setModal]=useState({open:false,success:false,error:false,view:false,edit:false,delete:false})
    const [input,setInput]=useState({title:"",time:"",titleError:false,timeError:false})
    const [error,setError]=useState({titleError:false,timeError:false,editTitleError:false,editTimeError:false})
    const [info,setInfo]=useState({creating:false,fetching:false,fetchingError:false,deleting:false,deletingError:false,editing:false,editingError:false})
    const [modalData,setModalData]=useState({view:{title:"",time:""},edit:{title:"",time:"",newTime:"",titleEnabled:false,timeEnabled:false,id:""},delete:{id:""}})

      const onDateChange = (date, dateString) => {
        setChoosenDate(dateString)
        if(dateString==""){
          setNowDate(currentDate())
          setDate(getCurrentWeekDays())
          fetchTodo({date:new Date().getDate(),year:new Date().getFullYear(),month:new Date().getMonth()})
    }
        else{
          setNowDate(selectedDate(dateString))
          setDate(getSelectedWeekDays(dateString))
          fetchTodo({date:new Date(dateString).getDate(),year:new Date(dateString).getFullYear(),month:new Date(dateString).getMonth()})
        }
      };

      const onNewDateChange=(date,dateString)=>{
      clearErrorMessages("time")
      setInput({...input,time:dateString})
      }

      const clearErrorMessages=(type)=>{
        if(type=="title")
          setError({...error,titleError:false})
        else
          setError({...error,timeError:false})
      }

      const clearEditErrorMessages=(type)=>{
        if(type=="title")
          setError({...error,editTitleError:false})
        else
          setError({...error,editTimeError:false})
      }

      const validateSubmit=(e)=>{
         if(!input.title){
          setError({...error,titleError:true})
          return false
         }

         if(!input.time){
          setError({...error,timeError:true})
          return false
         }

         return true
      }

      const validateEditSubmit=(e)=>{
        if(!modalData.edit.title){
         setError({...error,editTitleError:true})
         return false
        }

        if(modalData.edit.timeEnabled&&!modalData.edit.newTime){
          setError({...error,editTimeError:true})
          return false
        }

        return true
     }
      
      const handleChange=(e)=>{
        clearErrorMessages("title")
        const {name,value}=e.target
        setInput({
          ...input,
          [name]:value
        })
      }

      const handleEditChange=(e)=>{
        clearEditErrorMessages("title")
        setModalData({...modalData,
          edit:{...modalData.edit,title:e.target.value}})
        }

      const fetchTodo=(time)=>{
        setInfo({...info,fetching:true,fetchingError:false})
        fetch('http://localhost:3001/fetch-todo',{
            method:"post",
            body:JSON.stringify(time),
            headers:{'Content-Type':'application/json'}
        })
        .then(res=>res.json())
        .then((res)=>{
             if(res.success){
                setData(res.success)
             }else{
                console.log("error",res)
                setInfo({...info,fetchingError:true})
             }
                setInfo({...info,fetching:false})
        })
        .catch((err)=>{
            console.log("error",err)
            setInfo({...info,fetching:false,fetchingError:true})
        })
      }

      const createTodo=(e)=>{
        e.preventDefault()
        clearErrorMessages()
        if(!validateSubmit()){
          return
        }
        setInfo({...info,creating:true})
        fetch('http://localhost:3001/create-todo',{
            method:"post",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(input)
        })
        .then(res=>res.json())
        .then((res)=>{
             if(res.success){
                setModal({...modal,success:true,open:false})
                if(choosenDate!=="")
                  fetchTodo({date:new Date(choosenDate).getDate(),year:new Date(choosenDate).getFullYear(),month:new Date(choosenDate).getMonth()})
                else
                  fetchTodo({date:new Date().getDate(),year:new Date().getFullYear(),month:new Date().getMonth()})
             }else{
                console.log("error",res)
                setModal({...modal,error:true,open:false})
             }
             setInfo({...info,creating:false})
             setInput({...input,title:""})
        })
        .catch((err)=>{
            console.log("error",err)
            setModal({...modal,error:true})
            setInput({title:"",time:""})
            setInfo({...info,creating:false})
        })
      }

      const editTodo=(e)=>{
        e.preventDefault()
        if(!validateEditSubmit()){
          return
        }
        setInfo({...info,editing:true})
        fetch(`http://localhost:3001/edit-todo/${modalData.edit.id}`,{
            method:"post",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(modalData.edit)
        })
        .then(res=>res.json())
        .then((res)=>{
            if(res.success){
              if(choosenDate!=="")
               fetchTodo({date:new Date(choosenDate).getDate(),year:new Date(choosenDate).getFullYear(),month:new Date(choosenDate).getMonth()})
           else
              fetchTodo({date:new Date().getDate(),year:new Date().getFullYear(),month:new Date().getMonth()})
              setModal({...modal,edit:false})
             }else{
              console.log("error",res)
              setModal({...modal,edit:false})
              setInfo({...info,editingError:true})
             }
             setInfo({...info,editing:false})
             setModalData({...modalData,edit:{...modalData.edit,title:"",time:"",titleEnabled:false,timeEnabled:false,id:""}})
        })
        .catch((err)=>{
            console.log("error",err)
            setModal({...modal,edit:false})
            setInfo({...info,editingError:true,editing:false})
            setModalData({...modalData,edit:{title:"",time:"",titleEnabled:false,timeEnabled:false,id:""}})
        })
      }

      const deleteTodo=()=>{
        setInfo({...info,deleting:true})
        fetch(`http://localhost:3001/delete-todo/${modalData.delete.id}`)
        .then(res=>res.json())
        .then((res)=>{
          if(res.success){
            if(choosenDate!=="")
              fetchTodo({date:new Date(choosenDate).getDate(),year:new Date(choosenDate).getFullYear(),month:new Date(choosenDate).getMonth()})
          else
            fetchTodo({date:new Date().getDate(),year:new Date().getFullYear(),month:new Date().getMonth()})
            setModal({...modal,delete:false})
         }else{
            console.log("error",res)
            setModal({...modal,delete:false})
            setInfo({...info,deletingError:true})
         }
            setInfo({...info,deleting:false})
        })
        .catch((err)=>{
            console.log("error",err)
            setModal({...modal,delete:false})
            setInfo({...info,deletingError:true})
        })
      }


return(
   <div style={{width:"100%"}} className="mx-auto d-flex flex-column justify-content-center align-items-center">
    <div className='mx-auto shadow p-3 d-flex flex-column mt-3 rounded border' style={{width:"70%",minHeight:"80vh",height:"auto",background:"white"}}>
        <div className="d-flex justify-content-between align-items-center">
            <h5>{nowDate}</h5>
            <DatePicker placeholder="Change Date" onChange={onDateChange} />
        </div>
        <div className="d-flex justify-content-between rounded w-100 mt-2" style={{minHeight:"4rem",height:'auto'}}>
        {date.map((dt)=>{
            return(<div style={{width:"13%"}} className="d-flex flex-column">
                <span className={dt.selected?"border d-flex flex-column justify-content-center align-items-center bg-info text-white rounded":"border d-flex flex-column justify-content-center align-items-center justify-content-center bg-light rounded"}>
                <p className="m-0 fs-3">{dt.date}</p>
                <small>{dt.day}</small>
               </span>
               </div>
               )
        })}
        </div> 
        <div className="row p-2 rounded mx-auto w-100 mt-2 border" style={{height:"30rem",overflowY:"auto"}}>
           <div className="col-12 mt-2" style={{height:"3rem"}}>
            <Button type="primary"onClick={()=>setModal({open:true})} className="w-100" style={{height:"3rem"}}>Add Todo</Button>
            <Modal
                title={<p className='text-center fs-5 m-0'>New Todo</p>}
                open={modal.open}
                maskClosable={false}
                closable={false}
                footer={[
                  <Button key="cancel" disabled={info.creating} onClick={()=>{setModal({open:false})}} type='primary' danger>Cancel</Button>,
                  <Button key="ok" disabled={info.creating} onClick={()=>{document.getElementById('createsubmit').click()}} type='primary'>Ok</Button>,
                ]}
             >
                <form onSubmit={createTodo}>
                  <label htmlFor='title'>Title</label>
                  <Input name='title' value={input.title} onChange={handleChange} id='title' />
                  {error.titleError&&<small className="text-danger d-block">Required</small>}
                  <label htmlFor='time' className="mt-2">Date</label>
                  <DatePicker showTime showSecond={false} id="time" style={{display:"block"}} placeholder="Select Date" onChange={onNewDateChange} />
                  {error.timeError&&<small className="text-danger">Required</small>}
                  <button id='createsubmit' hidden htmltype='submit' type='primary'></button>
                </form>
             </Modal>
             <Modal
                title={<p className='text-center fs-5 m-0'>Success</p>}
                open={modal.success}
                closable={false}
                maskClosable={true}
                footer={[
                    <Button key="ok" onClick={()=>{setModal({...modal,success:false})}} type='primary'>Ok</Button>
                  ]}
             >
              <Result
                status="success"
                title="Successfully Added New Todo"
              />
             </Modal>
             <Modal
                title={<p className='text-center fs-5 m-0'>Error</p>}
                open={modal.error}
                closable={false}
                maskClosable={true}
                footer={[
                  <Button key="ok" onClick={()=>{setModal({...modal,error:false})}} type='primary'>Ok</Button>
                ]}
             >
              <Result
                status="error"
                title="Error Creating New Todo"
              />
             </Modal>
           </div>
           {info.fetching?
            <div className="col-12 mt-0"  style={{height:"3rem"}}>
              <Spin tip="Fetching Todos" size="small" style={{height:"1rem"}}>
               <div className="content" />
             </Spin>
             </div>
           :(info.fetchingError?
           <Result
             status="warning"
             title={<small>Error Fetching Todos, Please Try Again</small>}
          />
          :
           (data.length==0?
            <div className="col-12 mt-3">
            <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{ height: 60 }}
                    description={
                <span>
                 No Todo Created
               </span>
               }
                >
               <Button type="primary" onClick={()=>{setModal({open:true})}}>Create New</Button>
            </Empty>
            </div>:
            <div className="col-12 mt-0 d-flex flex-column">
                    {data.map((dt)=>{
                        return(
                          <div className="d-flex justify-content-between p-2 align-items-center" style={{height:"2.4rem"}}>
                            <p className="m-0 d-inline text-truncate" style={{width:"10rem"}}>{dt.title}</p>
                            <small className="fw-bold"><ClockCircleOutlined style={{color:"chocolate"}} />&nbsp;{getTime(dt.time)}</small>
                            <div style={{width:"3.5rem"}} className="d-flex justify-content-between align-items-center">
                              <EyeFilled onClick={()=>{setModalData({...modalData,view:{title:dt.title,time:`${new Date(dt.time).getFullYear()} ${getTime(dt.time)}`}});setModal({...modal,view:true})}} style={{cursor:"pointer",color:"green"}} />
                              <EditFilled onClick={()=>{setModalData({...modalData,edit:{title:dt.title,time:dt.time,id:dt._id}});setModal({...modal,edit:true})}} style={{cursor:"pointer",color:"brown"}}  />
                              <DeleteFilled onClick={()=>{setModalData({...modalData,delete:{id:dt._id}});setModal({...modal,delete:true})}} style={{cursor:"pointer",color:"red"}}  />
                            </div>
                          </div>
                        )
                    })
                }
            </div>
            ))
          }
            <Modal
                title={<p className='text-center fs-5 m-0'>View Todo</p>}
                open={modal.view}
                closable={false}
                maskClosable={false}
                footer={[
                <Button key="Close" onClick={()=>{setModal({...modal,view:false})}} type='primary'>Close</Button>
                ]}
            >
             <ul className="list-unstyled">
               <li><p className="fw-bold m-0 d-inline w-bold">Title : </p><p className="text-wrap text-wrap d-inline">{modalData.view.title}</p></li>
               <li><p className="fw-bold m-0 d-inline">Time : </p><p className="text-wrap m-0 d-inline">{`${nowDate} , ${modalData.view.time}`}</p></li>
              </ul>   
            </Modal>
            <Modal
              title={<p className='text-center fs-5 m-0'>Edit Todo</p>}
                open={modal.edit}
                closable={false}
                maskClosable={false}
                footer={[
                <Button key="cancel" onClick={()=>{setModal({...modal,edit:false})}} className='text-white bg-danger'>Cancel</Button>,
                <Button key="update" disabled={info.editing} onClick={()=>{document.getElementById('editsubmit').click()}} type='primary'>Update</Button>,
              ]}
            >
              <form onSubmit={editTodo}>
                  <label htmlFor='title' className="w-100">Title</label>
                  <Input style={{width:'75%'}} className="d-inline editTitle" disabled={!modalData.edit.titleEnabled} name='title' value={modalData.edit.title} onChange={handleEditChange} id='title' />
                  <Button style={{width:"20%",marginLeft:"5%"}} className="d-inline" onClick={()=>{setModalData({...modalData,edit:{...modalData.edit,titleEnabled:true}})}}>Change</Button>
                  {error.editTitleError&&<small className="text-danger d-block">Required</small>}
                  <label htmlFor='time' className="mt-2 w-100">Date</label>
                  {!modalData.edit.timeEnabled?
                  <Input value={`${nowDate} , ${new Date(modalData.edit.time).getFullYear()} ${getTime(modalData.edit.time)}`} style={{width:'75%'}} className="d-inline" disabled name='title' onChange={(e)=>{setModalData({...modalData,edit:{title:e.target.value}})}} id='title' />:
                  <DatePicker showTime showSecond={false} style={{width:"75%"}} placeholder="Select Date" onChange={(time,timeString)=>{clearEditErrorMessages("time");setModalData({...modalData,edit:{...modalData.edit,newTime:timeString}})}} />}
                  <Button style={{width:"20%",marginLeft:"5%"}} className="d-inline" onClick={()=>{setModalData({...modalData,edit:{...modalData.edit,timeEnabled:true}})}}>Change</Button>
                  {error.editTimeError&&<small className="text-danger">Required</small>}
                  <button id='editsubmit' hidden htmltype='submit' type='primary'></button>
                </form>
            </Modal>
            <Modal
                title={<p className='text-center fs-5 m-0'>Error</p>}
                open={info.editingError}
                closable={false}
                maskClosable={true}
                footer={[
                  <Button key="ok" onClick={()=>{setInfo({...info,editingError:false})}} type='primary'>Ok</Button>
                ]}
             >
              <Result
                status="error"
                title="Error Editing Todo"
              />
             </Modal>
             <Modal
                title={<p className='text-center fs-5 m-0'>Delete Todo</p>}
                open={modal.delete}
                closable={false}
                maskClosable={false}
                footer={[
                <Button key="ok" disabled={info.deleting} onClick={()=>{deleteTodo()}} className='text-white bg-danger'>Confirm</Button>,
                <Button key="cancel" disabled={info.deleting} onClick={()=>{setModal({...modal,delete:false})}} type='primary'>Cancel</Button>
                ]}
                >
                  <p className="text-center fs-5">Are You Sure To Delete This Todo?</p>
              </Modal>
              <Modal
                title={<p className='text-center fs-5 m-0'>Error</p>}
                open={info.deletingError}
                closable={false}
                maskClosable={true}
                footer={[
                  <Button key="ok" onClick={()=>{setInfo({...info,deletingError:false})}} type='primary'>Ok</Button>
                ]}
             >
              <Result
                status="error"
                title="Error Deleting Todo"
              />
             </Modal>
       </div>
    </div>
    <small className="mt-5">Developed By <a href="https://github.com/fanu-cd" target="blank" className="text-decoration-none"><b>FANUEL AMARE</b></a></small>
    </div>
)
}

export default Home