# Architecture

## Design goal

Coding Platform Quality Watch is an evidence-driven observatory, not a ranking engine.

The architecture keeps source observations separate from interpretation so that a disputed conclusion can be revisited without losing the underlying evidence.

## Layers

### 1. Collection

Inputs may include:

- manual observations;
- reproduction snippets;
- screenshots;
- runtime output;
- source references;
- platform metadata.

### 2. Normalization

Every finding is normalized into a machine-readable report with explicit platform, category, environment, expected behavior, observed behavior, confidence, and lifecycle state.

### 3. Verification

Validation has two meanings:

- **schema validation** — is the report structurally complete?
- **reproduction validation** — can the described behavior be reproduced?

A structurally valid report is not automatically a confirmed finding.

### 4. Analysis

Analysis may classify an observation as:

- content error;
- autograder error;
- platform/runtime quirk;
- runtime difference;
- specification-compliant alternative;
- ambiguous exercise;
- user/environment error;
- unresolved.

### 5. Presentation

The static frontend consumes normalized data and presents filters, evidence, and timelines without modifying the underlying reports.

## Adapter boundary

Platform-specific collection logic must not leak into the core report model. Future platform adapters should emit normalized observations rather than define their own report structures.

## Deployment boundary

The web frontend is intentionally static in the foundation phase. Submission workflows, authentication, persistent storage, and write APIs remain separate future concerns.
