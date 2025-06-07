import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { ReportWithData, Property } from '@/types/report'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricBox: {
    width: '30%',
    padding: 10,
    border: '1px solid #ddd',
    borderRadius: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  metricValue: {
    fontSize: 16,
    color: '#333',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 10,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    color: '#333',
  },
  status: {
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 4,
    marginRight: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
})

interface ReportPDFProps {
  report: ReportWithData
  property: Property
}

export const ReportPDF = ({ report, property }: ReportPDFProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#059669'
      case 'in_progress':
        return '#D97706'
      case 'failed':
        return '#DC2626'
      default:
        return '#6B7280'
    }
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ESG Report</Text>
          <Text style={styles.subtitle}>
            {property.name} - {new Date(report.period_start).toLocaleDateString()} to{' '}
            {new Date(report.period_end).toLocaleDateString()}
          </Text>
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.status,
                { backgroundColor: getStatusColor(report.status) + '20', color: getStatusColor(report.status) },
              ]}
            >
              {report.status.replace('_', ' ')}
            </Text>
            <Text
              style={[
                styles.status,
                {
                  backgroundColor: getStatusColor(report.compliance_status) + '20',
                  color: getStatusColor(report.compliance_status),
                },
              ]}
            >
              {report.compliance_status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricTitle}>Energy Usage</Text>
              <Text style={styles.metricValue}>
                {report.report_data?.energy_usage?.total || 0} {report.report_data?.energy_usage?.unit || 'kWh'}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricTitle}>Water Usage</Text>
              <Text style={styles.metricValue}>
                {report.report_data?.water_usage?.total || 0} {report.report_data?.water_usage?.unit || 'm³'}
              </Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricTitle}>Waste Management</Text>
              <Text style={styles.metricValue}>
                {report.report_data?.waste_management?.total || 0} {report.report_data?.waste_management?.unit || 'kg'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Property</Text>
              <Text style={styles.infoValue}>{property.name}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{property.address}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Jurisdiction</Text>
              <Text style={styles.infoValue}>{property.jurisdiction}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Created At</Text>
              <Text style={styles.infoValue}>{new Date(report.created_at).toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
} 