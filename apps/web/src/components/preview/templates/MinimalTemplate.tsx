import type { ResumeState } from '@resume-builder/types'

interface TemplateProps {
  resume: ResumeState
  scale?: number
}

export function MinimalTemplate({ resume, scale = 1 }: TemplateProps) {
  const { personalInfo, workExperiences, educations, skills, projects, certifications } = resume

  return (
    <div
      className="bg-white text-gray-900"
      style={{
        width: `${210 * scale}mm`,
        minHeight: `${297 * scale}mm`,
        padding: `${25 * scale}mm`,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: `${10 * scale}pt`,
        lineHeight: 1.6,
        color: '#2d3748',
      }}
    >
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-light tracking-tight text-gray-900">
          {personalInfo.name || 'Your Name'}
        </h1>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.location && <span>· {personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedinUrl || personalInfo.portfolioUrl) && (
          <div className="mt-1 text-sm text-gray-500">
            {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
            {personalInfo.linkedinUrl && personalInfo.portfolioUrl && <span> · </span>}
            {personalInfo.portfolioUrl && <span>{personalInfo.portfolioUrl}</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <p className="text-center text-base leading-relaxed text-gray-600">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-medium text-gray-900">{exp.title || 'Position'}</h3>
                <span className="text-sm text-gray-500">
                  {exp.startDate}
                  {exp.endDate ? ` – ${exp.endDate}` : exp.isCurrent ? ' – Present' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600">{exp.company}{exp.location && `, ${exp.location}`}</div>
              {exp.description && (
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Education
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-medium text-gray-900">{edu.institution || 'Institution'}</h3>
                <span className="text-sm text-gray-500">
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : edu.isCurrent ? ' – Present' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                {edu.gpa && ` · GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Skills
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {skills.map((skill) => (
              <span key={skill.id} className="text-sm text-gray-600">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-base font-medium text-gray-900">{proj.name || 'Project'}</h3>
                {proj.url && <span className="text-sm text-gray-500">{proj.url}</span>}
              </div>
              {proj.description && <p className="mt-2 text-sm text-gray-600">{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div className="mt-1 text-xs text-gray-400">{proj.techStack.join(' · ')}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-gray-400">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2 flex items-baseline justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900">{cert.name || 'Certification'}</h3>
                <div className="text-sm text-gray-600">{cert.issuer}</div>
              </div>
              <span className="text-sm text-gray-500">{cert.date}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
