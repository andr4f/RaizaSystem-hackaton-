import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../app/providers/AuthContext'
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Sprout, ShieldCheck, ChevronDown } from 'lucide-react'
import './Register.css'
import imagenLogin from '../assets/imagen-login.png'

const ROLES = [
  { value: 'PRODUCER',         label: 'Productor' },
  { value: 'TOURISM_OPERATOR', label: 'Operador de Turismo' },
  { value: 'EXPORTER',         label: 'Exportador' },
  { value: 'BUYER',            label: 'Comprador' },
]

const ROLE_DASHBOARD = {
  PRODUCER:         '/dashboard/producer',
  EXPORTER:         '/dashboard/exporter',
  TOURISM_OPERATOR: '/dashboard/tourism',
}

const Register = ({ defaultRole } = {}) => {
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    defaultValues: { role: defaultRole ?? '' },
  })

  const onSubmit = async (data) => {
    try {
      await authRegister(data)
      navigate(ROLE_DASHBOARD[data.role] ?? '/')
    } catch (err) {
      setError('root', { message: err.message })
    }
  }

  return (
    <div className="register-page">
      <section className="container-register">

        <div className="container-img-register">
          <img src={imagenLogin} alt="Raíza" />
        </div>

        <div className="container-form-register">

          <div className="register-logo">
            <Sprout size={36} />
          </div>

          <div className="container-tittle-register">
            <h2>Crear tu cuenta</h2>
            <p>Únete a la comunidad de Raíza</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">

            <div className="input-group">
              <label>Nombre completo</label>
              <div className="input-wrapper">
                <User size={17} className="input-icon" />
                <input
                  type="text"
                  placeholder="Tu nombre completo"
                  {...register('name', { required: 'El nombre es requerido' })}
                />
              </div>
              {errors.name && <span className="error-msg">{errors.name.message}</span>}
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  {...register('password', {
                    required: 'La contraseña es requerida',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
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

            {!defaultRole && (
              <div className="input-group">
                <label>¿Cuál es tu rol?</label>
                <div className="select-wrapper">
                  <select
                    {...register('role', { required: 'El rol es requerido' })}
                    defaultValue=""
                  >
                    <option value="" disabled>Selecciona tu rol</option>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={17} className="select-icon" />
                </div>
                {errors.role && <span className="error-msg">{errors.role.message}</span>}
              </div>
            )}

            {errors.root && <span className="error-msg">{errors.root.message}</span>}

            <button type="submit" className="btn-submit-register" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : <> Crear cuenta <ArrowRight size={17} /> </>}
            </button>

          </form>

          <p className="login-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>

          <div className="security-note-register">
            <ShieldCheck size={15} />
            <span>Tu información está protegida y encriptada</span>
          </div>

        </div>
      </section>
    </div>
  )
}

export default Register
