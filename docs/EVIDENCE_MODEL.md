# Evidence Model

## Rule

A claim and the evidence for that claim are separate objects.

## Evidence types

- `runtime-output`
- `reproduction-snippet`
- `screenshot`
- `source-reference`
- `platform-response`
- `manual-observation`
- `counterevidence`

## Confidence states

- `unverified` — observation recorded, reproduction pending.
- `reproduced` — behavior reproduced under the stated environment.
- `confirmed` — reproduced and supported by independent evidence or a stable reference.
- `ambiguous` — multiple interpretations remain plausible.
- `environment-specific` — behavior depends on runtime, browser, device, locale, or configuration.

## Lifecycle states

- `open`
- `monitoring`
- `fixed`
- `regression`
- `outdated`
- `unreproducible`

## Provenance

Reports should distinguish:

1. source;
2. observation;
3. reproduction;
4. inference;
5. reference;
6. counterevidence;
7. verification state.

This prevents a screenshot, anecdote, or single runtime result from silently becoming an absolute platform claim.
