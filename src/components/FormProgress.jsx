import { motion } from 'motion/react'
import { getFormProgress } from '../utils/formProgress'
import { getQuoteStepProgress } from '../utils/quoteStepper'

export default function FormProgress({ values, imageReady, activeStep }) {
  if (activeStep !== undefined) {
    const { sections, percent } = getQuoteStepProgress(activeStep)
    return <nav className="form-progress" aria-label="Pasos de la solicitud"><ol>{sections.map((section) => <li key={section.number} aria-current={section.active ? 'step' : undefined} className={section.active ? 'is-active' : section.completed ? 'has-information' : ''}><span>{section.number}</span>{section.label}<small>{section.active ? 'Paso actual' : section.completed ? 'Completado' : 'Por continuar'}</small></li>)}</ol><div className="form-progress-track" aria-hidden="true"><motion.div initial={false} animate={{ width: `${percent}%` }} transition={{ duration: .3 }} /></div><p>Paso {activeStep + 1} de 3 · La referencia es opcional.</p></nav>
  }
  const { sections, percent } = getFormProgress(values, imageReady)
  return <nav className="form-progress" aria-label="Información añadida al formulario"><ol>{sections.map((section) => <li key={section.number} className={section.filled ? 'has-information' : ''}><span>{section.number}</span>{section.label}<small>{section.filled ? 'Con información' : 'Por explorar'}</small></li>)}</ol><div className="form-progress-track" aria-hidden="true"><motion.div animate={{ width: `${percent}%` }} transition={{ duration: .3 }} /></div><p>Tu idea toma forma. La referencia es opcional.</p></nav>
}
