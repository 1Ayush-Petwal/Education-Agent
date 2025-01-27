
# Installation

## Clone and Install

Please be sure to check what the latest available stable version tag is.

### Clone the repository

```bash
git clone [https://github.com/elizaos/Agent.git](https://github.com/1Ayush-Petwal/Education-Agent.git)
```

### Enter directory

```bash
cd Agent
```

### Switch to latest tagged release

```bash
# Checkout the latest release
# This project iterates fast, so we recommend checking out the latest release
git checkout $(git describe --tags --abbrev=0)
```

### Install dependencies (on initial run)

```bash
pnpm install --no-frozen-lockfile
```

By default, the pnpm lockfile will not be updated during installations based off of `.npmrc` frozen-lockfile=true. To update the lockfile, you need to run the command:

```bash
pnpm install --no-frozen-lockfile
```

Please only use this command when you are initially instantiating the repo or are bumping the version of a package or adding a new package to your `package.json`. This practice helps maintain consistency in your project's dependencies and prevents unintended changes to the lockfile.

### Build the local libraries

```bash
pnpm build
```

## Configure Environment

### Copy example environment file

```bash
cp .env.example .env
```

## Interact with the Agent

Now you're ready to start a conversation with your agent! Open a new terminal window and run:

```bash
pnpm start:client
```

Once the client is running, you'll see a message like this:

```
➜  Local:   http://localhost:5173/
```

Simply click the link or open your browser to [http://localhost:5173/](http://localhost:5173/). You'll see the chat interface connect to the system, and you can begin interacting with your character.
