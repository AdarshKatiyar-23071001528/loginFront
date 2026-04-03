import React from 'react'
import skit  from "../src/assest/skit.jpg"
import PrayasAssosiationlogo from "../src/assest/PrayasAssosiationlogo.png";
import skitDirector from "../src/assest/skitDirector.jpeg";

const About1 = () => {
  return (

   
    <div className='bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-slate-800 p-6 flex flex-col items-center justify-center gap-4'>
        <div className='about flex justify-around items-center p-6 min-h-screen w-full  relative'>
        
        <div className='p-6 w-1/3 justify-center items-center flex h-[500px] absolute right-1/2'>
        {/* <h1 className='text-6xl font-bold text-white/90'>About Us</h1> */}
        <img src={skit} alt="Shakuntala Devi" className='h-full rounded-xl'/>
        </div>
    
        <div className='border border-white/20 w-1/2 p-4 rounded-2xl bg-white/10 backdrop-blur-lg  shadow-xl text-white/90 hover:shadow-2xl transition absolute left-3/7 bottom-1/6'>
        <h1 className='text-5xl font-bold text-white/90'>About Us</h1>
        <p>Shakuntala Devi Institute of Technology, Kanpur is a private engineering college located in Kanpur, Uttar Pradesh, India. It was established in 2008 and is affiliated with Chatrapati Sahuji Maharaj University (CSJMU),Kanpur. The college offers undergraduate and postgraduate programs in various engineering disciplines, including Computer Science, and Business Management.</p>
        <p>The institute is named after Shakuntal Devi, a social worker and philanthropist who dedicated her life to the welfare of the underprivileged. The college aims to provide quality education and foster innovation and research among its students. It has a campus equipped with modern facilities, including laboratories, libraries, and sports amenities.</p> 
        </div>
       

    </div>


    <div className=' flex justify-around items-center p-6 min-h-screen w-full  relative border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl'>
        
        <div className='p-6 w-1/3 justify-center items-center flex h-[500px] absolute right-2/4 '>
        {/* <h1 className='text-6xl font-bold text-white/90'>About Us</h1> */}
        <img src={PrayasAssosiationlogo} alt="Prayas Welfare Association" className='h-full rounded-xl'/>
        </div>
    
        <div className='  w-1/2 p-4 absolute left-2/5  text-white/90'>
        <h1 className='text-5xl font-bold text-white/90'>Prayas Welfare Assosiation</h1>
        <p>Prayas Welfare Association Society was established in 2014 by renowned educationists & Entrepreneurs. It is a nonprofit, charitable organisation registered under the Societies Registration Act of 1860.Registrartion number of Prayas Welfare Association Society is 0831.</p>
        <p>The main aim of the society is to provide opportunities for quality education to talented students, particularly those belonging to underprivileged families; to develop and implement an integrated and comprehensive programme of educational development so as to catalyze social transformation, to facilitate the attainment of national objectives of accelerating the process of modernization and economic growth, promoting equality and social justice and enhancing efficiency and productivity.</p> 
        </div>


       

    </div>


    <div className='flex justify-around items-center p-6 min-h-screen w-full  relative border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl h-full'>

    <div className='border border-white/20 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl w-1/4 h-[400px] p-4 absolute right-3/4'>
    <div className='h-[200px] w-[200px] rounded-full overflow-hidden mx-auto mb-4'>
<img src={skitDirector} alt="" className='object-cover'/>
    </div>
    <div className='px-5'>
      <h1 className='text-xl font-bold text-white/90'>Director</h1>
    <h2 className='text-lg font-semibold text-white/80'>Vivek Pratap Singh</h2>
    <h3 className='text-md font-normal text-white/70'>Asst. Professor</h3>
    </div>
    
       
    </div>

    <div className='text-white/90 absolute w-1/2'>
    <h1 className='text-5xl font-bold mb-3'>Message</h1>
    <p>It gives me great pleasure to invite you to take an initial peek into the heart that beats behind the appealing façade of Shakuntala Krishna Institute Of Technology College Code KD64. I thank you for your interest in this exceptional institution which has recorded five decades of constant development, in the course of which it has accomplished much, making it one of the colleges recognized for its excellence and therefore, much sought after by the fresh applicants.

The SKIT College tradition happily brings together sound academic achievement with an extensive, vibrant co-curricular programme that includes sports, and leadership training programmes. Our mission is to inculcate the love of knowledge in our students and, for this, we aim to develop the skills and demeanour of lifelong ‘learning,’ essential for making responsible global citizens. This will make them immensely capable of facing the future with resilience and optimism. On the deeper level, we try to instil the values of respect and trust in relationships that are the foundation of real success.

At SKIT Campus then, we believe that ‘education’ is a wholesome, holistic exercise and as such we strive to give a whole new meaning to the word. Coupling this basic premise with the idea of a sense of belonging to one family—the SKIT family—we look at ourselves as ‘care-givers.’ We care for the mind—ours is a sterling academic institution; we care for the person—the accent is on the all-round development of personality. I wish you the best in the process of seeking to become a part of this family.</p>
    </div>

    </div>
   </div> 
   
    



  )
}

export default About1