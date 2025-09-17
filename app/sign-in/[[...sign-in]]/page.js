import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'
export default function Page() {
  return(
      <>
      <Image src='/TaxiBanner.png' height={1050} width={1050} alt='Error'
      className='object-contain h-full w-fit'/>
        <div className='absolute top-10 right-0'>
      <SignIn />

        </div>
      </>
  ) 
}