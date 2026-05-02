import { signIn, signUp } from './actions'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return <LoginForm signIn={signIn} signUp={signUp} />
}