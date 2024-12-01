import { useEffect } from 'react'
import { IoMdMenu } from "react-icons/io";
type HeaderProps={
    photoUrl: string; 
  }
const Header = ({photoUrl}: HeaderProps) => {
    useEffect(() => {
        console.log('photo url is',photoUrl)
    },[])
  return (
    <div className='w-full flex flex-row justify-between items-center bg-[#1D232C]  rounded-xl p-1 mb-2'>
        <div className='flex flex-row  items-center  '>
        <button className="w-full text-[17px] text-left text-[#586A84] py-4 px-4  hover:text-sky-400 hover:bg-gray-800 transition-all duration-200">
        <IoMdMenu color="[#DDE1E8]" size={27}/>
      </button>
       {/* <input type='text' placeholder='Search here.....' className='w-[200px] h-[40px] rounded-xl p-2 bg-[#3B4758]'></input> */}
        </div>
        <div className='flex flex-row gap-1 items-center  '>
        <button className="w-full text-[17px] text-left text-[#586A84] py-4 px-4  hover:text-sky-400 hover:bg-gray-800 transition-all duration-200">
       Notification
      </button>
      <button className="w-full text-[17px] text-left text-[#586A84] py-4 px-4  hover:text-sky-400 hover:bg-gray-800 transition-all duration-200">
      <IoMdMenu color="[#DDE1E8]" size={27}/>
      </button> 
      <img src={photoUrl} alt="User Avatar"  className="w-[35px] h-[35px] text-[17px] text-left text-[#586A84]   hover:text-sky-400 hover:bg-gray-800 transition-all duration-200 rounded-full bg-white">
       
      </img>
        </div>
    </div>
  )
}

export default Header
