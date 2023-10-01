import { Carousel, Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useRef, useState } from "react";
import todo from '../assets/todo.svg'
import task from '../assets/task.svg'
import collaborate from '../assets/collaborate.svg'
export default function WelcomPage() {

    const carouselRef = useRef(null);
    const [lastSlide,setLastSlide]=useState(false)
    const handleNext = () => {
          if(!lastSlide)
            carouselRef.current.next();
    };

    const handleCarouselChange=(currentSlide)=>{
        if(currentSlide===2){
           setLastSlide(true)
     }
    }
    
    return (
        <div className='mx-auto bg-white d-flex flex-column mt-3 rounded border' style={{width:"70%",minHeight:"80vh",height:"auto"}}>
        <Carousel afterChange={handleCarouselChange} ref={carouselRef} dots={false}>
        <div className='d-flex flex-column align-items-center'>
           <img src={todo} style={{width:"90%",height:"30rem"}} alt='Todo' />
           <h3 className='mt-3'>Welcome to <p className='m-0 d-inline text-primary'>Todo Trek</p></h3>
           <p>Create tasks, stay organized, and boost your productivity.</p>
        </div>
        <div className='d-flex flex-column align-items-center'>
           <img src={task} style={{width:"90%",height:"30rem"}} alt='Todo' />
           <h3>Stay on Top of Your Tasks</h3>
           <p>Effortlessly manage your to-do items, set priorities, and track progress.</p>
        </div>
        <div className='d-flex flex-column align-items-center'>
          <img src={collaborate} style={{width:"90%",height:"30rem"}} alt='Todo' />
          <h3>Collaborate and Share</h3>
          <p>Invite others to collaborate, delegate tasks, and achieve goals together.</p>
        </div>
       </Carousel>
       {
        lastSlide?
        <Button
        className=" text-decoration-none ms-auto m-3"
        type="primary"
        onClick={handleNext}
        href='/home'
      >{lastSlide&&<p>Get Started</p>}</Button>
        :
        <Button
        className="ms-auto m-3"
        type="primary"
        shape="circle"
        icon={<RightOutlined />}
        onClick={handleNext}
      />
       }
      </div>
    );
  }