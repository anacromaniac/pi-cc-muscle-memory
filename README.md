# pi-cc-muscle-memory

[![npm version](https://img.shields.io/npm/v/@anacromaniac/pi-cc-muscle-memory.svg)](https://www.npmjs.com/package/@anacromaniac/pi-cc-muscle-memory)

> Claude Code muscle memory for [pi](https://github.com/earendil-works/pi).

Your fingers already know `/clear`, `/exit` and `/rename`. pi calls those
commands something else, so this package registers them as thin aliases over
the built-ins — nothing is reimplemented, nothing is overridden.

## Commands

| Command | pi equivalent | Notes |
| --- | --- | --- |
| `/clear` | `/new` | Starts a fresh session. |
| `/exit` | `/quit` | Also intercepts the bare words `exit` and `quit` typed **without** the leading slash, so they shut pi down instead of being sent to the model. |
| `/rename [name]` | `/name` | With a name it sets it directly; without one it prompts, prefilled with the current session name. |

## Install

```bash
pi install npm:@anacromaniac/pi-cc-muscle-memory
```

Or add it to the `packages` array in `~/.pi/agent/settings.json`:

```json
{
  "packages": ["npm:@anacromaniac/pi-cc-muscle-memory"]
}
```

Installing straight from the repository also works:

```bash
pi install git:git@github.com:anacromaniac/pi-cc-muscle-memory
```

Prefer the npm package. pi deliberately skips peer-dependency resolution for
npm packages (`--legacy-peer-deps`), but a git install runs a plain
`npm install` inside the checkout, so `@earendil-works/pi-coding-agent` gets
resolved and a full duplicate copy of pi lands in the package directory.

Verify with `pi list`. If you install this package, delete any local copies of
these extensions from `~/.pi/agent/extensions/` — two extensions registering
the same command name would produce a conflict diagnostic.

## Layout

```
extensions/
  clear-alias/index.ts    /clear  -> ctx.newSession()
  exit-alias/index.ts     /exit   -> ctx.shutdown() (+ bare word interception)
  rename-alias/index.ts   /rename -> pi.setSessionName()
```

Each extension is a single self-contained file. The `pi` manifest in
`package.json` lists them explicitly.

## Behaviour details

### `/exit` and the bare words

The `input` handler only intercepts plain text typed interactively
(`source === "interactive"`), skips messages with attached images, and never
touches messages injected by other extensions or prompt templates. Anything
that does not match `exit`/`quit` (case-insensitive, trimmed) passes through
to the model untouched.

### `/rename` without arguments

In TUI mode it opens an input prompt prefilled with the current session name;
an empty or cancelled prompt leaves the name unchanged. In non-interactive
modes (`pi -p`, RPC) the bare command is a no-op — pass a name explicitly.

## Development

Nothing to build: pi loads the TypeScript sources directly. Point pi at a
checkout with `pi -e /absolute/path/to/pi-cc-muscle-memory/extensions/clear-alias/index.ts`,
or install the directory itself:

```bash
pi install /absolute/path/to/pi-cc-muscle-memory
```

`@earendil-works/pi-coding-agent` is a peer dependency and is provided by pi;
do not bundle it. There is no build step and no lockfile to commit, so the
published tarball contains the TypeScript sources exactly as they are here.

## Releasing

Publishing is manual and token-based. Create a token on npm (Automation or
Publish type), then:

```bash
export NPM_TOKEN=npm_xxxxxxxxxxxx
echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc
```

With auth in place, from a clean `main`:

```bash
npm pack --dry-run                 # inspect the tarball first
npm version patch                  # bumps patch; use minor/major as needed
npm publish                        # publishes the version in package.json
git push --follow-tags             # push the bump + tag
```

`npm version` bumps `package.json` and creates the matching git tag, so those
last two steps belong together. The one exception is the very first publish:
the version is already `1.0.0` in `package.json`, so skip `npm version` and
go straight to `npm publish` (then `git push`, adding a `v1.0.0` tag yourself
if you want one).

`publishConfig.access` is already `public`, so the scoped package needs no
`--access` flag. Published versions are immutable: never republish the same
version, always bump.

## License

MIT
