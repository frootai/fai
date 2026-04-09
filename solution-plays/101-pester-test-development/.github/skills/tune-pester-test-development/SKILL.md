---
name: tune-pester-test-development
description: "Tune, fix, optimize Pester tests — improve code coverage, eliminate flaky tests, fix failing tests, optimize mock setup, configure parallel execution, set up CI/CD coverage gates"
---

# Tune Pester Test Suite

Optimize a Pester test suite for maximum coverage and reliability.

## Steps
1. Analyze coverage report — identify uncovered lines/branches
2. Generate targeted tests for coverage gaps
3. Fix flaky tests — replace timing-dependent assertions with mocks
4. Optimize test performance — share mocks in BeforeAll, reduce file I/O
5. Configure parallel execution for CI pipelines
6. Set up coverage trending — compare against baseline
7. Eliminate false positives — ensure tests can actually fail
8. Configure Pester settings: verbosity, timeout, exit behavior
