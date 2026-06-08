import type { ResumeState } from '@resume-builder/types'

interface TemplateProps {
  resume: ResumeState
  scale?: number
}

export function ModernTemplate({ resume, scale = 1 }: TemplateProps) {
  const { personalInfo, workExperiences, educations, skills, projects, certifications } = resume

  return (
    <div
      className="bg-white text-gray-900"
      style={{
        width: `${210 * scale}mm`,
        minHeight: `${297 * scale}mm`,
        display: 'flex',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: `${9 * scale}pt`,
        lineHeight: 1.5,
      }}
    >
      {/* Sidebar */}
      <aside
        className="p-6 text-white"
        style={{
          width: `${65 * scale}mm`,
          backgroundColor: '#1e3a5f',
        }}
      >
        {/* Contact */}
        <div className="mb-6">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider opacity-80">Contact</h3>
          <div className="space-y-1 text-xs">
            {personalInfo.email && <div>{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedinUrl && <div className="truncate">{personalInfo.linkedinUrl}</div>}
            {personalInfo.portfolioUrl && <div className="truncate">{personalInfo.portfolioUrl}</div>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider opacity-80">Skills</h3>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="mb-1 text-xs">{skill.name}</div>
                  <div className="h-1.5 rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white/80"
                      style={{
                        width: skill.level === 'expert' ? '100%' : skill.level === 'intermediate' ? '66%' : '33%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <div>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider opacity-80">Education</h3>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id}>
                  <div className="font-semibold text-xs">{edu.institution}</div>
                  <div className="text-xs opacity-80">
                    {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  </div>
                  <div className="text-xs opacity-60">
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6" style={{ width: `${145 * scale}mm` }}>
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#1e3a5f' }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.summary && (
            <p className="mt-2 text-sm text-gray-600">{personalInfo.summary}</p>
          )}
        </header>

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-4 text-sm font-bold uppercase tracking-wider"
              style={{ color: '#1e3a5f', borderBottom: `2px solid #1e3a5f`, paddingBottom: `${4 * scale}mm` }}
            >
              Work Experience
            </h2>
            {workExperiences.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">{exp.title || 'Position'}</h3>
                  <span className="text-xs text-gray-600">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.endDate}` : exp.isCurrent ? ' – Present' : ''}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-700">{exp.company}</div>
                {exp.description && (
                  <ul className="mt-1 list-disc pl-4 text-xs text-gray-600">
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-6">
            <h2
              className="mb-4 text-sm font-bold uppercase tracking-wider"
              style={{ color: '#1e3a5f', borderBottom: `2px solid #1e3a5f`, paddingBottom: `${4 * scale}mm` }}
            >
              Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">{proj.name || 'Project'}</h3>
                  {proj.url && <span className="text-xs text-blue-600">{proj.url}</span>}
                </div>
                {proj.description && <p className="mt-1 text-xs text-gray-600">{proj.description}</p>}
                {proj.techStack.length > 0 && (
                  <div className="mt-1 text-xs text-gray-500">Tech: {proj.techStack.join(', ')}</div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h2
              className="mb-4 text-sm font-bold uppercase tracking-wider"
              style={{ color: '#1e3a5f', borderBottom: `2px solid #1e3a5f`, paddingBottom: `${4 * scale}mm` }}
            >
              Certifications
            </h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">{cert.name || 'Certification'}</h3>
                  <span className="text-xs text-gray-600">{cert.date}</span>
                </div>
                <div className="text-xs text-gray-600">{cert.issuer}</div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
