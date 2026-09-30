# Coding Platform Quality Watch

A community-driven project by **Digital Welfare Productions™ Unltd.**

Coding Platform Quality Watch documents, reproduces, compares, and explains quality issues and strong teaching patterns across coding-learning platforms.

> You may be learning how to operate the platform, not how to build software.

The project exists to help learners tell the difference.

## Mission

The goal is not outrage. The goal is clarity.

We collect reproducible evidence about:

- broken or misleading autograders;
- ambiguous exercises and weak hints;
- console/output rendering issues;
- localization and template bugs;
- sandbox/runtime differences;
- outdated technical content;
- accessibility and UX regressions;
- strong examples of good teaching;
- practical workarounds for learners.

## Principles

- Be fair.
- Be reproducible.
- Be useful to beginners.
- Criticize systems, not learners.
- Highlight good work, not only bad work.
- Prefer evidence over vibes.
- Keep humor sharp, but never lazy.

**This is not a platform war. This is a quality map.**

## Foundation architecture

The v0.2 foundation separates four layers:

1. **Observation** — what was actually seen.
2. **Evidence** — artifacts that support the observation.
3. **Interpretation** — classification, confidence, and expected behavior.
4. **Presentation** — reports, dashboards, and comparisons.

Machine-readable findings live under `reports/` and are validated in CI.

## First platforms

- Mimo
- SoloLearn
- Encode
- Boot.dev
- TryHackMe
- freeCodeCamp

## Local validation

```sh
npm test
```

Run the static observatory:

```sh
npm run serve
```

Then open <http://localhost:8080>.

## Repository map

```text
docs/        Philosophy, methodology, architecture
platforms/   Platform profiles and platform-specific notes
reports/     Machine-readable findings and examples
schemas/     Data contracts
snippets/    Reproduction code
scripts/     Validation and maintenance tooling
web/         Static observatory frontend
.github/     CI and contribution workflow
```

## Status

**v0.2 foundation — active development**

Markdown-first. Evidence-first. Engineering-first. Community-friendly.
