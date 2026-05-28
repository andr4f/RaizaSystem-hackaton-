import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../app/providers/AuthContext'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sprout, ShieldCheck } from 'lucide-react'
import './Login.css'
import imagenLogin from '../assets/imagen-login.png'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm()

  const onSubmit = async (data) => {
    try {
      await login(data)
      navigate('/')
    } catch (err) {
      setError('root', { message: err.message })
    }
  }

  return (
    <div className="login-page">
      <section className="contianer-login">

        <div className="container-img-login">
          <img src={imagenLogin} alt="Raíza" />
        </div>

        <div className="container-form-login">

          <div className="login-logo">
            <Sprout size={36} />
          </div>

          <div className="container-tittle">
            <h2>Bienvenido de nuevo</h2>
            <p>Inicia sesión para continuar en Raíza</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="container-form">

            <div className="input-group">
              <label>Correo electrónico</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  placeholder="ejemplo@correo.com"
                  {...register('email', { required: 'El email es requerido' })}
                />
              </div>
              {errors.email && <span className="error-msg">{errors.email.message}</span>}
            </div>

            <div className="input-group">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'La contraseña es requerida' })}
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="error-msg">{errors.password.message}</span>}
            </div>

            <div className="remember-row">
              <label className="remember-label">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#">¿Olvidaste tu contraseña?</a>
            </div>

            {errors.root && <span className="error-msg">{errors.root.message}</span>}

            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : <> Iniciar sesión <ArrowRight size={17} /> </>}
            </button>

          </form>

          <p className="register-link">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>

          <div className="divider">
            <span>o continuar con</span>
          </div>

          <button type="button" className="btn-google">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="security-note">
            <ShieldCheck size={15} />
            <span>Tu información está protegida y encriptada</span>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Login
