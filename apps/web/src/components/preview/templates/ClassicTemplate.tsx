import type { ResumeState } from '@resume-builder/types'

interface TemplateProps {
  resume: ResumeState
  scale?: number
}

export function ClassicTemplate({ resume, scale = 1 }: TemplateProps) {
  const { personalInfo, workExperiences, educations, skills, projects, certifications } = resume

  return (
    <div
      className="bg-white text-gray-900"
      style={{
        width: `${210 * scale}mm`,
        minHeight: `${297 * scale}mm`,
        padding: `${20 * scale}mm`,
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: `${10 * scale}pt`,
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <header className="mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name || 'Your Name'}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.location && <span>· {personalInfo.location}</span>}
        </div>
        {(personalInfo.linkedinUrl || personalInfo.portfolioUrl) && (
          <div className="mt-1 text-sm text-gray-600">
            {personalInfo.linkedinUrl && <span>{personalInfo.linkedinUrl}</span>}
            {personalInfo.linkedinUrl && personalInfo.portfolioUrl && <span> · </span>}
            {personalInfo.portfolioUrl && <span>{personalInfo.portfolioUrl}</span>}
          </div>
        )}
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-gray-800">Professional Summary</h2>
          <p className="text-sm text-gray-700">{personalInfo.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-800">
            Work Experience
          </h2>
          {workExperiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-gray-900">{exp.title || 'Position'}</h3>
                <span className="text-sm text-gray-600">
                  {exp.startDate}
                  {exp.endDate ? ` – ${exp.endDate}` : exp.isCurrent ? ' – Present' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-700">{exp.company}{exp.location && `, ${exp.location}`}</div>
              {exp.description && (
                <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
                  {exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-800">
            Education
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-gray-900">{edu.institution || 'Institution'}</h3>
                <span className="text-sm text-gray-600">
                  {edu.startDate}
                  {edu.endDate ? ` – ${edu.endDate}` : edu.isCurrent ? ' – Present' : ''}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                {edu.gpa && ` · GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-800">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded bg-gray-100 px-2 py-0.5 text-sm text-gray-700"
              >
                {skill.name}
                {skill.category && ` (${skill.category})`}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-800">
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-gray-900">{proj.name || 'Project'}</h3>
                {proj.url && <span className="text-sm text-blue-600">{proj.url}</span>}
              </div>
              {proj.description && <p className="mt-1 text-sm text-gray-700">{proj.description}</p>}
              {proj.techStack.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  Tech: {proj.techStack.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-3 border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-800">
            Certifications
          </h2>
          {certifications.map((cert) => (
            <div key={cert.id} className="mb-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-semibold text-gray-900">{cert.name || 'Certification'}</h3>
                <span className="text-sm text-gray-600">{cert.date}</span>
              </div>
              <div className="text-sm text-gray-700">{cert.issuer}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
