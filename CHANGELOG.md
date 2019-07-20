## Unreleased

## v2.0.1

Fix:
- More wait time between captures, to help against blank images.

## v2.0.0

Breaking changes:
- Rename `--debug-wait` option in favor of `--server`.
- Final image filenames use an index (0, 1, 2, …) instead of
  a rotation (000, 060, 120, …).

Changes:
- Add an `--image` option to generate a composition image.
- Extract craster to its own exported module.

Fixes:
- Remove multiple dependencies (pug, body-parser, debug, …).
- Update node dependency.
- Wait 100ms before starting captures, to fix blank first image.

## v1.5.13

First changelog entry.
