
import RegisterForm from '@/components/specifics/register/RegisterForm'
import clsx from 'clsx'

function RegisterPage() {
  return (
    <div className={clsx('min-h-screen w-full flex justify-center items-center', 'bg-gray-200')}>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
