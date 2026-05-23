import { memo } from 'react'
import type { FormEventHandler, ReactNode } from 'react'
import type { UseFormRegister, FieldValues, FormState } from 'react-hook-form'
import { InputField, Button } from '../common/index.ts'
import logoImage from '../../assets/Logo.png'

interface FieldConfig {
  name: string
  label: string
  type: string
  placeholder: string
  icon?: ReactNode
}

interface AuthFormProps<T extends FieldValues> {
  title: string
  subtitle: string
  fields: FieldConfig[]
  onSubmit: FormEventHandler<HTMLFormElement>
  register: UseFormRegister<T>
  errors: FormState<T>['errors']
  isLoading: boolean
  buttonText: string
  footerText: ReactNode
}

const AuthFormComponent = <T extends FieldValues>({
  title,
  subtitle,
  fields,
  onSubmit,
  register,
  errors,
  isLoading,
  buttonText,
  footerText,
}: AuthFormProps<T>) => {
  return (
    <>
      <div className="auth-header">
        <div className="auth-header-title">
          <img src={logoImage} alt="SIMS PPOB Logo" className="auth-header-logo" />
          <h1>{title}</h1>
        </div>
        <h2>{subtitle}</h2>
      </div>

      <form onSubmit={onSubmit}>
        {fields.map((field) => {
          const fieldName = field.name as any
          return (
            <InputField
              key={field.name}
              type={field.type}
              placeholder={field.placeholder}
              icon={field.icon}
              {...register(fieldName)}
              error={(errors[fieldName]?.message as string) || undefined}
            />
          )
        })}

        <Button type="submit" isLoading={isLoading}>
          {buttonText}
        </Button>
      </form>

      <p className="auth-footer">{footerText}</p>
    </>
  )
}

export const AuthForm = memo(AuthFormComponent) as typeof AuthFormComponent
