export interface UtilityData {
  energy_usage?: {
    total: number
    unit: string
  }
  water_usage?: {
    total: number
    unit: string
  }
  waste_management?: {
    total: number
    unit: string
  }
}

export interface Rule {
  id: string
  jurisdiction: string
  metric: keyof UtilityData
  threshold: number
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  severity: 'high' | 'medium' | 'low'
  message: string
}

export interface RuleResult {
  rule_id: string
  is_compliant: boolean
  severity: string
  message: string
  actual_value: number
  threshold: number
}

export class RuleEngine {
  private rules: Rule[]

  constructor(rules: Rule[]) {
    this.rules = rules
  }

  private evaluateRule(rule: Rule, data: UtilityData): RuleResult {
    const metricData = data[rule.metric]
    if (!metricData) {
      return {
        rule_id: rule.id,
        is_compliant: false,
        severity: rule.severity,
        message: `Missing ${rule.metric} data`,
        actual_value: 0,
        threshold: rule.threshold,
      }
    }

    const value = metricData.total
    let isCompliant = false

    switch (rule.operator) {
      case 'gt':
        isCompliant = value > rule.threshold
        break
      case 'lt':
        isCompliant = value < rule.threshold
        break
      case 'eq':
        isCompliant = value === rule.threshold
        break
      case 'gte':
        isCompliant = value >= rule.threshold
        break
      case 'lte':
        isCompliant = value <= rule.threshold
        break
    }

    return {
      rule_id: rule.id,
      is_compliant: isCompliant,
      severity: rule.severity,
      message: isCompliant ? 'Compliant' : rule.message,
      actual_value: value,
      threshold: rule.threshold,
    }
  }

  public evaluateRules(data: UtilityData, jurisdiction: string): RuleResult[] {
    const jurisdictionRules = this.rules.filter(rule => rule.jurisdiction === jurisdiction)
    return jurisdictionRules.map(rule => this.evaluateRule(rule, data))
  }

  public getOverallCompliance(results: RuleResult[]): boolean {
    return results.every(result => result.is_compliant)
  }

  public getHighestSeverity(results: RuleResult[]): string {
    if (results.length === 0) {
      return 'low' // Default to low severity for no results
    }
    const severityOrder = { high: 3, medium: 2, low: 1 }
    return results.reduce((highest, current) => {
      return severityOrder[current.severity as keyof typeof severityOrder] >
        severityOrder[highest.severity as keyof typeof severityOrder]
        ? current
        : highest
    }).severity
  }
} 