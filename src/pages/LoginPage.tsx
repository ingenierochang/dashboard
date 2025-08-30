import LoginForm from '@/components/specifics/login/LoginForm'
import clsx from 'clsx'

function LoginPage() {
  return (
    <div className={clsx('min-h-screen w-full flex justify-center items-center', 'bg-gray-200')}>
      <LoginForm />
    </div>
  )
}

export default LoginPage
