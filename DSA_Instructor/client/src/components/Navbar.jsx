import { Moon, User } from "lucide-react";
import React from "react";

function Navbar() {
  return (
    <div className="flex justify-between bg-[#101A26] w-full px-6 py-4">

      <div>
        <h1 className="text-xl font-bold text-[#49A3F2]">
          Coding Instructor AI
        </h1>
      </div>

      <div className="flex items-center gap-6">

        <div className="flex items-center gap-2 bg-[#0E1826] border border-white p-1 rounded-md ">
          <Moon size={20} className='text-white'/>
          <button className='text-white cursor-pointer'>Dark Mode</button>
        </div>

        <div className="flex items-center gap-2 bg-[#0E1826] border border-white p-1 rounded-md ">
          <User size={20} className='text-white' />
          <button className='text-white cursor-pointer'>Profile</button>
        </div>

      </div>

    </div>
  );
}

export default Navbar;