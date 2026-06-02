# Changelog

All notable changes to this project are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [1.1.0] - 2026-06-02

### Added
- `stringify(input)` - serializes a layer object, or an array of layers, back into a CSS box-shadow string (the inverse of `parse()`), enabling full read-edit-write round-trips.
- Built-in TypeScript definitions (`index.d.ts`) exporting the `BoxShadowLayer` interface and all function signatures. No `@types` install required.

## [1.0.1]

### Fixed
- `calc()` offsets no longer produce false length matches; values inside CSS functions are stripped before parsing offsets.
- Color functions with nested parentheses (for example `rgba(calc(0), 0, 0, 1)`) are now extracted correctly.
- Scientific-notation lengths such as `1e2px` are parsed as a single number instead of being mismatched.

## [1.0.0]

### Added
- Initial release.
- `parse()`, `parseSingle()`, and `split()` for reading CSS box-shadow values.
- Support for multi-layer shadows, `inset`, full CSS declarations, and all color formats: hex (3/4/6/8-digit), `rgb()`, `rgba()`, `hsl()`, `hsla()`, named colors, `transparent`, and `currentcolor`.
- Resolved 6-digit hex plus numeric alpha for every layer.
