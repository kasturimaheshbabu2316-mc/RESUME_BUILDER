import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { personalInfoSchema, type PersonalInfoFormData } from '@/schemas/resumeSchemas'
import { useResumeStore } from '@/hooks/useResumeStore'
import { Input, Textarea, Card } from '@/components/ui'

export function PersonalInfo() {
  const { currentResume, updatePersonalInfo } = useResumeStore()
  const personalInfo = currentResume?.personalInfo

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: personalInfo?.name ?? '',
      email: personalInfo?.email ?? '',
      phone: personalInfo?.phone ?? '',
      location: personalInfo?.location ?? '',
      linkedinUrl: personalInfo?.linkedinUrl ?? '',
      portfolioUrl: personalInfo?.portfolioUrl ?? '',
      summary: personalInfo?.summary ?? '',
    },
  })

  const summaryValue = watch('summary') ?? ''

  // Sync form when store data loads
  useEffect(() => {
    if (personalInfo) {
      reset({
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        linkedinUrl: personalInfo.linkedinUrl,
        portfolioUrl: personalInfo.portfolioUrl,
        summary: personalInfo.summary,
      })
    }
  }, [personalInfo, reset])

  const onValid = (data: PersonalInfoFormData) => {
    updatePersonalInfo(data)
  }

  return (
    <Card title="Personal Information">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Full Name *"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Location"
            placeholder="New York, NY"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/johndoe"
            error={errors.linkedinUrl?.message}
            {...register('linkedinUrl')}
          />
          <Input
            label="Portfolio URL"
            placeholder="https://johndoe.dev"
            error={errors.portfolioUrl?.message}
            {...register('portfolioUrl')}
          />
        </div>

        <Textarea
          label="Professional Summary"
          placeholder="A brief summary of your professional background and key strengths..."
          error={errors.summary?.message}
          helperText={`${summaryValue.length}/2000 characters`}
          rows={4}
          {...register('summary')}
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty}
            className="btn-primary rounded-md disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Card>
  )
}
