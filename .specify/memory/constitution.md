<!--
Sync Impact Report:
- Version Change: [UNVERSIONED] → 1.0.0
- Constitution Type: Initial Ratification
- Modified Principles: N/A (new constitution)
- Added Sections:
  * Core Principles (5 principles: Code Quality First, Test-Driven Development, User Experience Consistency, Performance by Design, Maintainability & Documentation)
  * Quality Gates
  * Development Workflow
  * Governance
- Removed Sections: N/A
- Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section already references constitution file
  ✅ spec-template.md - Requirements section aligns with quality and testing principles
  ✅ tasks-template.md - Task structure supports test-first workflow and quality gates
- Follow-up TODOs: None - all placeholders resolved
-->

# Spec-Kit Example Project Constitution

## Core Principles

### I. Code Quality First

All code MUST meet the following non-negotiable standards before merge:

- **Zero Tolerance**: No warnings, linting errors, or formatting violations
- **Type Safety**: Strong typing enforced where language supports it; duck typing only when unavoidable
- **Readability**: Code is written for humans first, machines second—prefer clarity over cleverness
- **Single Responsibility**: Each function, class, or module does one thing well
- **DRY with Judgment**: Eliminate duplication, but not at the cost of coupling unrelated concerns

**Rationale**: Technical debt compounds exponentially. Prevention is orders of magnitude cheaper than remediation.

### II. Test-Driven Development (NON-NEGOTIABLE)

Testing is not optional. The development workflow MUST follow this sequence:

1. **Write tests first** based on acceptance criteria from spec.md
2. **Obtain user approval** of test scenarios before implementation
3. **Verify tests fail** (Red phase)
4. **Implement minimal code** to pass tests (Green phase)
5. **Refactor** with confidence (Refactor phase)

**Test Coverage Requirements**:
- **Contract Tests**: REQUIRED for all public APIs, CLI interfaces, and inter-service boundaries
- **Integration Tests**: REQUIRED for user journeys spanning multiple components
- **Unit Tests**: Encouraged for complex business logic; mandatory for critical paths

**Rationale**: Tests are living documentation and safety nets. Writing them first ensures we build what's specified, not what we assume.

### III. User Experience Consistency

User-facing interfaces MUST provide a coherent, predictable experience:

- **Interface Contracts**: APIs return consistent structures; errors follow standardized formats (e.g., RFC 7807 Problem Details)
- **CLI Standards**: All CLI tools follow POSIX conventions—text in/out via stdin/stdout, errors to stderr, exit codes signal success/failure
- **Human-Readable Output**: Support both machine-parseable (JSON, CSV) and human-friendly formats
- **Progressive Disclosure**: Simple tasks stay simple; advanced features don't clutter common workflows
- **Accessibility**: Interfaces respect WCAG 2.1 AA standards where applicable; CLI tools support screen readers via semantic output

**Rationale**: Users build mental models. Breaking expectations erodes trust and productivity.

### IV. Performance by Design

Performance is a feature, not an afterthought. All implementations MUST define and meet:

- **Measurable Targets**: Every feature specifies latency (p50, p95, p99) and throughput requirements in plan.md
- **Resource Constraints**: Memory, CPU, disk, and network usage limits documented and enforced
- **Scalability Profile**: Linear, logarithmic, or constant complexity—document algorithm choices and justify quadratic-or-worse with profiling data
- **Graceful Degradation**: Systems slow down predictably under load; they do not crash or hang

**Gates**:
- Blocking operations over 100ms MUST be async or clearly documented as synchronous
- Database queries MUST use indexes for production-scale data
- API responses MUST remain under p95 latency targets even at 2× expected load

**Rationale**: Performance problems are hard to fix after launch. Measure early, optimize intentionally.

### V. Maintainability & Documentation

Code survives longer than memory. Future maintainers (including yourself in six months) MUST be able to:

- **Understand Intent**: Comments explain "why," not "what"—code already shows what
- **Navigate Quickly**: Consistent naming, directory structure per plan-template.md, and clear module boundaries
- **Reproduce Locally**: README or docs/quickstart.md enables new developers to run tests and build within 15 minutes
- **Trace Decisions**: Architectural choices documented in plan.md or research.md; breaking changes logged in CHANGELOG.md

**Documentation Standards**:
- Public APIs: Required (function signatures, parameters, return types, errors, examples)
- Internal modules: Recommended (file headers describing purpose and main exports)
- Inline comments: Use sparingly—refactor unclear code instead

**Rationale**: Undocumented systems become black boxes. Maintenance costs exceed initial development. Invest early to save later.

## Quality Gates

All features MUST pass these gates before merging:

### Gate 1: Specification Review (Pre-Development)
- [ ] spec.md defines user stories with acceptance criteria
- [ ] plan.md documents technical approach, structure, and performance targets
- [ ] All "NEEDS CLARIFICATION" markers resolved

### Gate 2: Test Approval (Pre-Implementation)
- [ ] Tests written for all acceptance criteria
- [ ] User has reviewed and approved test scenarios
- [ ] Tests fail (Red phase confirmed)

### Gate 3: Implementation Review (Pre-Merge)
- [ ] All tests pass (Green phase)
- [ ] Code passes linting and formatting checks
- [ ] No compiler/interpreter warnings
- [ ] Performance targets met (benchmarks or profiling evidence required if targets specified)
- [ ] Documentation updated (README, API docs, CHANGELOG if applicable)

### Gate 4: Integration Validation (Pre-Release)
- [ ] Contract tests pass for all integration points
- [ ] User journeys validated end-to-end
- [ ] No regressions in existing functionality

## Development Workflow

### Branch Strategy
- **Feature branches**: `###-feature-name` (e.g., `001-user-authentication`)
- **Main branch**: Always deployable; protected with required reviews

### Review Requirements
- **Code Reviews**: Minimum one approval from team member familiar with the domain
- **Constitution Compliance**: Reviewer MUST verify adherence to all Core Principles
- **Test Evidence**: Reviewer MUST confirm tests were written first and initially failed

### Commit Standards
- **Atomic Commits**: Each commit represents a single logical change
- **Descriptive Messages**: Follow conventional commits (e.g., `feat: add user login`, `fix: resolve race condition in cache`)
- **Test Commits**: Separate commit for tests before implementation commit

### Continuous Integration
- All tests MUST pass on CI before merge
- Linting and formatting checks MUST pass
- Coverage reports generated (informational; thresholds defined per project in plan.md)

## Governance

This constitution supersedes all other development practices and guidelines. It defines the binding principles for all code, architecture, and process decisions in this project.

### Amendment Process
1. **Proposal**: Document proposed change with rationale in a PR against constitution.md
2. **Review**: Minimum two-week comment period for team review
3. **Approval**: Requires consensus from project maintainers (or majority vote if consensus unattainable)
4. **Migration Plan**: Breaking changes MUST include migration guide and backward compatibility strategy
5. **Version Bump**: Follow semantic versioning (MAJOR for incompatible changes, MINOR for additions, PATCH for clarifications)

### Compliance
- All pull requests MUST reference this constitution in their review checklist
- Any complexity added beyond these principles MUST be justified in plan.md Complexity Tracking section
- Violations require explicit approval from project lead with documented rationale

### Agent Guidance
- For runtime development guidance, agents should refer to agent-specific files in `.specify/templates/` (e.g., `agent-file-template.md`)
- This constitution is authoritative for cross-cutting concerns; agent-specific guidance handles tooling and workflow details

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
