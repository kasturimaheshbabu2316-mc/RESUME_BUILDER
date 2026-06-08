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
  page: { padding: 50, fontFamily: 'Inter', fontSize: 10, lineHeight: 1.6, color: '#2d3748' },
  header: { textAlign: 'center', marginBottom: 24 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, fontSize: 9, color: '#6b7280' },
  summary: { textAlign: 'center', fontSize: 10, color: '#4b5563', marginBottom: 24, lineHeight: 1.7 },
  section: { marginBottom: 24 },
  sectionTitle: { textAlign: 'center', fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, color: '#9ca3af', marginBottom: 12 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontSize: 11, fontWeight: 'bold', color: '#111827' },
  entryDate: { fontSize: 9, color: '#6b7280' },
  entrySubtitle: { fontSize: 10, color: '#4b5563', marginBottom: 4 },
  text: { fontSize: 9, color: '#4b5563', lineHeight: 1.7 },
  link: { color: '#2563eb', textDecoration: 'none', fontSize: 9 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  skill: { fontSize: 10, color: '#4b5563' },
})

interface ResumePDFProps {
  resume: ResumeState
}

export function MinimalTemplatePDF({ resume }: ResumePDFProps) {
  const { personalInfo, workExperiences, skills, projects, certifications } = resume

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name || 'Your Name'}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>· {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>· {personalInfo.location}</Text>}
          </View>
        </View>

        {personalInfo.summary && <Text style={styles.summary}>{personalInfo.summary}</Text>}

        {workExperiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {workExperiences.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 16 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{exp.title}</Text>
                  <Text style={styles.entryDate}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{exp.company}{exp.location && `, ${exp.location}`}</Text>
                {exp.description && <Text style={styles.text}>{exp.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsRow}>
              {skills.map((s) => <Text key={s.id} style={styles.skill}>{s.name}</Text>)}
            </View>
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 12 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.name}</Text>
                  {proj.url && <Link src={proj.url} style={styles.link}>{proj.url}</Link>}
                </View>
                {proj.description && <Text style={styles.text}>{proj.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: 6 }}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{cert.name}</Text>
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
