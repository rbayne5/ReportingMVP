import { RuleEngine } from '@/lib/ruleEngine'
import type { Rule } from '@/lib/ruleEngine'

describe('RuleEngine', () => {
  const mockRules: Rule[] = [
    {
      id: '1',
      jurisdiction: 'CA',
      metric: 'energy_usage',
      threshold: 1000,
      operator: 'lte',
      severity: 'high',
      message: 'Energy usage exceeds threshold',
    },
    {
      id: '2',
      jurisdiction: 'CA',
      metric: 'water_usage',
      threshold: 500,
      operator: 'lte',
      severity: 'medium',
      message: 'Water usage exceeds threshold',
    },
    {
      id: '3',
      jurisdiction: 'NY',
      metric: 'waste_management',
      threshold: 200,
      operator: 'lte',
      severity: 'low',
      message: 'Waste management exceeds threshold',
    },
  ]

  const mockData = {
    energy_usage: {
      total: 1200,
      unit: 'kWh',
    },
    water_usage: {
      total: 400,
      unit: 'm³',
    },
    waste_management: {
      total: 150,
      unit: 'kg',
    },
  }

  let ruleEngine: RuleEngine

  beforeEach(() => {
    ruleEngine = new RuleEngine(mockRules)
  })

  describe('evaluateRules', () => {
    it('should evaluate rules for a specific jurisdiction', () => {
      const results = ruleEngine.evaluateRules(mockData, 'CA')
      expect(results).toHaveLength(2)
      expect(results[0].rule_id).toBe('1')
      expect(results[1].rule_id).toBe('2')
    })

    it('should handle missing metric data', () => {
      const incompleteData = {
        energy_usage: {
          total: 1200,
          unit: 'kWh',
        },
      }
      const results = ruleEngine.evaluateRules(incompleteData, 'CA')
      expect(results[1].is_compliant).toBe(false)
      expect(results[1].message).toContain('Missing')
    })

    it('should correctly evaluate compliance based on operators', () => {
      const results = ruleEngine.evaluateRules(mockData, 'CA')
      expect(results[0].is_compliant).toBe(false) // 1200 > 1000
      expect(results[1].is_compliant).toBe(true) // 400 < 500
    })
  })

  describe('getOverallCompliance', () => {
    it('should return true when all rules are compliant', () => {
      const compliantData = {
        energy_usage: { total: 800, unit: 'kWh' },
        water_usage: { total: 400, unit: 'm³' },
      }
      const results = ruleEngine.evaluateRules(compliantData, 'CA')
      expect(ruleEngine.getOverallCompliance(results)).toBe(true)
    })

    it('should return false when any rule is non-compliant', () => {
      const results = ruleEngine.evaluateRules(mockData, 'CA')
      expect(ruleEngine.getOverallCompliance(results)).toBe(false)
    })
  })

  describe('getHighestSeverity', () => {
    it('should return the highest severity from results', () => {
      const results = ruleEngine.evaluateRules(mockData, 'CA')
      expect(ruleEngine.getHighestSeverity(results)).toBe('high')
    })

    it('should handle empty results', () => {
      const results = ruleEngine.evaluateRules(mockData, 'TX')
      expect(ruleEngine.getHighestSeverity(results)).toBe('low')
    })
  })
}) 