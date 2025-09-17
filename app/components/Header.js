import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
function Header() {
    const headerMenu =[
        {
            id:1,
            name:'Ride',
            icon:'/Taxi.png'
        },
        {
            id:2,
            name:'Package',
            icon:'/box.png'
        },
        
        
    ]
  return (
    <div className='p-4 pb-3 pl-10 border-b-[4px] border-gray-100 flex items-center justify-between '>
        <div className='flex gap-[30px] items-center'>
            <Image src='/Logo1.png' width={80} height={40} alt='Logo' />
        
        <div className='flex gap-[6px] items-center -mt-px'>
            {headerMenu.map((item)=>(
                <div className='flex items-center gap-[2px]'>
                <Image src={item.icon} width={17} height={17} alt='Errpr'/>
                <h2 className='font-medium text-[14px]'>{item.name}</h2>
                </div>
            ))}

            </div>
        </div>
        <UserButton />
    </div>
  )
}

export default Header