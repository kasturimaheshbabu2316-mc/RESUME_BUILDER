import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer'
import type { ResumeState } from '@resume-builder/types'

// Register Inter font
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTcviYwY8tdM.woff2', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#111827',
  },
  header: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#1f2937',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#4b5563',
    marginBottom: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    color: '#374151',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  entryTitle: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  entryDate: {
    fontSize: 9,
    color: '#4b5563',
  },
  entrySubtitle: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
  },
  bulletList: {
    paddingLeft: 12,
    fontSize: 9,
    color: '#374151',
  },
  bullet: {
    marginBottom: 2,
  },
  skillTag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 9,
    color: '#374151',
    marginRight: 4,
    marginBottom: 4,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: 9,
  },
  summary: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.6,
  },
})

interface ResumePDFProps {
  resume: ResumeState
}

export function ClassicTemplatePDF({ resume }: ResumePDFProps) {
  const { personalInfo, workExperiences, educations, skills, projects, certifications } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name || 'Your Name'}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>· {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>· {personalInfo.location}</Text>}
          </View>
          {(personalInfo.linkedinUrl || personalInfo.portfolioUrl) && (
            <View style={styles.contactRow}>
              {personalInfo.linkedinUrl && (
                <Link src={personalInfo.linkedinUrl} style={styles.link}>
                  {personalInfo.linkedinUrl}
                </Link>
              )}
              {personalInfo.linkedinUrl && personalInfo.portfolioUrl && <Text> · </Text>}
              {personalInfo.portfolioUrl && (
                <Link src={personalInfo.portfolioUrl} style={styles.link}>
                  {personalInfo.portfolioUrl}
                </Link>
              )}
            </View>
          )}
        </View>

        {/* Summary */}
        {personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{personalInfo.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {workExperiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 12 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.title || 'Position'}</Text>
                  <Text style={styles.entryDate}>
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.endDate}` : exp.isCurrent ? ' – Present' : ''}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}{exp.location && `, ${exp.location}`}</Text>
                {exp.description && (
                  <View style={styles.bulletList}>
                    {exp.description.split('\n').filter(Boolean).map((line, i) => (
                      <Text key={i} style={styles.bullet}>
                        • {line.replace(/^[-•]\s*/, '')}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {educations.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{edu.institution || 'Institution'}</Text>
                  <Text style={styles.entryDate}>
                    {edu.startDate}
                    {edu.endDate ? ` – ${edu.endDate}` : edu.isCurrent ? ' – Present' : ''}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                  {edu.gpa && ` · GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {skills.map((skill) => (
                <Text key={skill.id} style={styles.skillTag}>
                  {skill.name}
                  {skill.category && ` (${skill.category})`}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 8 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.name || 'Project'}</Text>
                  {proj.url && (
                    <Link src={proj.url} style={styles.link}>
                      {proj.url}
                    </Link>
                  )}
                </View>
                {proj.description && <Text style={{ fontSize: 9, color: '#374151', marginTop: 2 }}>{proj.description}</Text>}
                {proj.techStack.length > 0 && (
                  <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 2 }}>Tech: {proj.techStack.join(', ')}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{cert.name || 'Certification'}</Text>
                  <Text style={styles.entryDate}>{cert.date}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  )
}
