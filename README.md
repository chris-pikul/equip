# equip

Node based CLI tool for common tools used in development

## Installation

`equip` comes as a binary executable if desired, otherwise can be installed as most global NPM packages can.

```console
npm install -g equip-cli
npx equip-cli
```

If linked and installed locally, then the `equip` program becomes available, otherwise npx uses `equip-cli`
as that is the package name (the short name was taken, by a deprecated project).

## Commands

Each command provided by equip is available as either a command within `equip`, or as a kebab version for
standalone usage.

## Hash

Performs hashing using a variety of commonly used hash algorithms. Can be supplied input text directly, a
file name using the `-f, --file` option, or a command prompt to input text (which can be hidden with the
`-s, --secret` option).

```console
equip hash <algorithm> [options...] [text...]
equip-hash <algorithm> [options...] [text...]
npx equip-cli hash <algorithm> [options...] [text...]
```

Supported algorithms:

* `md5` - Allows outputing as "binary", "hex", or "base64" with the `-o, --output-format` option.
* `sha1` - Allows outputing as "binary", "hex", or "base64" with the `-o, --output-format` option.
* `sha256` - Allows outputing as "binary", "hex", or "base64" with the `-o, --output-format` option.
* `sha512` - Allows outputing as "binary", "hex", or "base64" with the `-o, --output-format` option.
* `bcrypt` - Can be provided a number of rounds value as a `-r, --rounds` option, defaults to 10.
