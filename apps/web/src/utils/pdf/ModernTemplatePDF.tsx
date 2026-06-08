import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer'
import type { ResumeState } from '@resume-builder/types'

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTcviYwY8tdM.woff2', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Inter', fontSize: 9, color: '#111827' },
  sidebar: { width: 170, backgroundColor: '#1e3a5f', padding: 20, color: '#ffffff' },
  sidebarTitle: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 },
  sidebarText: { fontSize: 8, marginBottom: 3 },
  main: { flex: 1, padding: 20 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1e3a5f', marginBottom: 8 },
  summary: { fontSize: 9, color: '#4b5563', marginBottom: 16 },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#1e3a5f', borderBottomWidth: 2, borderBottomColor: '#1e3a5f', paddingBottom: 3, marginBottom: 8 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontWeight: 'bold', fontSize: 10 },
  entryDate: { fontSize: 8, color: '#4b5563' },
  entrySubtitle: { fontSize: 9, color: '#374151', marginBottom: 3 },
  bullet: { fontSize: 8, color: '#4b5563', marginBottom: 2, paddingLeft: 8 },
  link: { color: '#2563eb', textDecoration: 'none', fontSize: 8 },
})

interface ResumePDFProps {
  resume: ResumeState
}

export function ModernTemplatePDF({ resume }: ResumePDFProps) {
  const { personalInfo, workExperiences, educations, skills, projects, certifications } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {personalInfo.email && <Text style={styles.sidebarText}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.sidebarText}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.sidebarText}>{personalInfo.location}</Text>}
          </View>
          {skills.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.sidebarTitle}>Skills</Text>
              {skills.map((s) => (
                <Text key={s.id} style={styles.sidebarText}>{s.name}</Text>
              ))}
            </View>
          )}
          {educations.length > 0 && (
            <View>
              <Text style={styles.sidebarTitle}>Education</Text>
              {educations.map((edu) => (
                <View key={edu.id} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{edu.institution}</Text>
                  <Text style={{ fontSize: 7, opacity: 0.8 }}>{[edu.degree, edu.field].filter(Boolean).join(' in ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main */}
        <View style={styles.main}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.name}>{personalInfo.name || 'Your Name'}</Text>
            {personalInfo.summary && <Text style={styles.summary}>{personalInfo.summary}</Text>}
          </View>

          {workExperiences.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Experience</Text>
              {workExperiences.map((exp) => (
                <View key={exp.id} style={{ marginBottom: 10 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{exp.title}</Text>
                    <Text style={styles.entryDate}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{exp.company}</Text>
                  {exp.description && exp.description.split('\n').filter(Boolean).map((line, i) => (
                    <Text key={i} style={styles.bullet}>• {line.replace(/^[-•]\s*/, '')}</Text>
                  ))}
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((proj) => (
                <View key={proj.id} style={{ marginBottom: 8 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{proj.name}</Text>
                    {proj.url && <Link src={proj.url} style={styles.link}>{proj.url}</Link>}
                  </View>
                  {proj.description && <Text style={{ fontSize: 8, color: '#4b5563' }}>{proj.description}</Text>}
                </View>
              ))}
            </View>
          )}

          {certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert) => (
                <View key={cert.id} style={{ marginBottom: 4 }}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryTitle}>{cert.name}</Text>
                    <Text style={styles.entryDate}>{cert.date}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{cert.issuer}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
