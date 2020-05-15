# Changelog

## Unreleased

Fix:

- Better file sorting after glob.

## v3.1.4

Fix:

- Remove extra HEAD request.

## v3.1.3

Fix:

- Abort with error code when capture directory is empty.

## v3.1.2

Fix:

- Throw early error if remote URL does not respond with a 200 HTTP code.

## v3.1.1

Fix:

- Throw early errors before merging too few images to help debugging.

## v3.1.0

Change:

- Accept local path to 3D model with `--path`.

## v3.0.1

Fixes:

- Better example path for `--image` on the command line.
- Higher definition.

## v3.0.0

Breaking changes:

- Drop support for setting the base path for image captures with `--path`.
  Instead, creates a temporary directory and cleans it up automatically.
- Require the `--image` option.

Fixes:

- Double the quality of screenshots by adding a zoomFactor.
- Debug prints a line for each capture.
- Replace local example STL by remote URL.

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
