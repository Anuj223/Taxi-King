import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return(
   

   <>
         <Image src='/TaxiBanner.png' height={1050} width={1050} alt='Error'
         className='object-contain h-full w-fit'/>
           <div className='absolute top-10 right-0'>
         <SignUp />
   
           </div>
         </>)
}