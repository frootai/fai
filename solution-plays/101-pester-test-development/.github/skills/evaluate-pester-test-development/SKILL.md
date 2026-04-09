---
name: evaluate-pester-test-development
description: "Evaluate Pester test quality — analyze code coverage gaps, check mock completeness, detect flaky tests, verify test isolation, measure execution time, generate JaCoCo + NUnit reports"
---

# Evaluate Pester Test Suite

Analyze the quality and completeness of a Pester test suite.

## Checks
1. Run Invoke-Pester -PassThru to capture results
2. Analyze code coverage: line %, branch %, function %
3. Identify coverage gaps: which functions/lines/branches uncovered
4. Check mock completeness: every Mock has a Should -Invoke
5. Detect flaky tests: run 3x, compare results
6. Verify test isolation: no shared state between Describe blocks
7. Measure execution time: flag tests > 5 seconds
8. Generate JaCoCo XML (coverage) + NUnit XML (test results)

## Thresholds
- Line coverage: >= 90%
- Branch coverage: >= 80%
- Function coverage: 100%
- Test pass rate: 100%
- Flaky tests: 0
