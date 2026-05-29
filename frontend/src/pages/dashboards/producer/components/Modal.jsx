import { useEffect } from 'react'
import { X } from 'lucide-react'
import './Modal.css'

const Modal = ({ title, subtitle, onClose, children, width = 520 }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="rz-modal-overlay" onMouseDown={onClose}>
      <div
        className="rz-modal"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="rz-modal-head">
          <div>
            <h2 className="rz-modal-title">{title}</h2>
            {subtitle && <p className="rz-modal-sub">{subtitle}</p>}
          </div>
          <button className="rz-modal-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="rz-modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
