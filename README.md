<h1 align="center">Web Scraper</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/ChrisAraneo/web-scraper/refs/heads/master/logo.png" alt="Web Scraper logo" width="518px" height="200px"/>
  <br>
  <a href="https://github.com/ChrisAraneo/web-scraper/blob/master/package.json"><img src="https://img.shields.io/badge/version-v0.1.1-blue" alt="version"></a>
  <a href="https://github.com/ChrisAraneo/web-scraper/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Web Scraper is released under the MIT license."></a>
  <a href="https://github.com/ChrisAraneo/web-scraper/actions/workflows/node.js.yml"><img alt="GitHub CI Status" src="https://img.shields.io/github/actions/workflow/status/ChrisAraneo/web-scraper/node.js.yml?label=CI&logo=GitHub"></a>
  <br>
  <br>
  <em>Simple configurable TypeScript web scraping tool</em>
  <br>
</p>

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ChrisAraneo/web-scraper.git
cd web-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
LEADERBOARDS_URL=https://example.com/leaderboards
DETAILS_URL=https://example.com/details
BEST_PLAYERS_URL=https://example.com/best-players
CHARACTER=example-character
REGION=eu
OUTPUT_DIR=output
FIRST=1
LAST=100
```

## Usage

### Running the scraper

```bash
npm start
```

This will:
1. Build the project using [`tsconfig.build.json`](tsconfig.build.json)
2. Execute the compiled JavaScript

The scraper will:
- Fetch pages concurrently in chunks
- Extract data from each page
- Automatically save results every batch
- Log progress and any errors encountered

### Development

Build the project:
```bash
npm run build
```

Run tests:
```bash
npm test
```

Run mutation testing:
```bash
npm run stryker
```

Format code:
```bash
npm run format
```

Run linting:
```bash
npm run lint
```

Fix linting issues automatically:
```bash
npm run lint:fix
```

Run all maintenance tasks (lint fix + format):
```bash
npm run chores
```

## Technologies and tools

- **TypeScript**: static typing and compilation with strict type checking
- **Axios**: HTTP client for making requests with retry support
- **JSSoup**: HTML parsing and DOM manipulation
- **RxJS**: reactive programming for concurrent async operations
- **Lodash**: utility functions for data manipulation
- **dotenv**: environment variable management
- **@chris.araneo/logger**: logging
- **Jest**: unit testing
- **Stryker**: mutation testing for test quality verification
- **ESLint**: code linting
- **Prettier**: code formatting
- **rimraf**: directory cleanup

## Architecture

### Core

- **[`src/index.ts`](src/index.ts)**: main entry point that runs the scraping process
- **[`src/fetch-leaderboards-page.ts`](src/fetch-leaderboards-page.ts)**: fetches and parses leaderboard pages to extract player IDs
- **[`src/fetch-details-page.ts`](src/fetch-details-page.ts)**: fetches detailed player information
- **[`src/fetch-best-players-page.ts`](src/fetch-best-players-page.ts)**: fetches best players data for specific characters
- **[`src/get-website.ts`](src/get-website.ts)**: core HTTP client with retry logic, using Axios and JSSoup for HTML parsing

### Utilities

- **[`src/utils/logger.ts`](src/utils/logger.ts)**: centralized logging with different log levels
- **[`src/utils/write-file.ts`](src/utils/write-file.ts)**: file writing operations with JSON serialization and error handling
- **[`src/utils/should-retry.ts`](src/utils/should-retry.ts)**: retry logic for failed HTTP requests
- **[`src/utils/get-env-or-exit-process.ts`](src/utils/get-env-or-exit-process.ts)**: environment variable validation with process exit on missing variables
- **[`src/utils/create-directory-when-doesnt-exist.ts`](src/utils/create-directory-when-doesnt-exist.ts)**: directory creation utility
- **[`src/utils/consts.ts`](src/utils/consts.ts)**: shared constants and configuration values

## Configuration

The scraper is configured through environment variables defined in the `.env` file:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `LEADERBOARDS_URL` | Base URL for leaderboard pages | `https://example.com/leaderboards` | Yes |
| `DETAILS_URL` | Base URL for player detail pages | `https://example.com/details` | Yes |
| `BEST_PLAYERS_URL` | Base URL for best players pages | `https://example.com/best-players` | Yes |
| `CHARACTER` | Character name to search for | `example-character` | Yes |
| `REGION` | Region parameter for requests | `na` | Yes |
| `OUTPUT_DIR` | Directory to save results | `output` | Yes |
| `FIRST` | First page number to scrape (0-based) | `0` | Yes |
| `LAST` | Last page number to scrape (inclusive) | `10` | Yes |

## Output

The scraper saves results in JSON format, with each line containing a separate JSON object. Files are organized as:
- `{OUTPUT_DIR}/results_{REGION}_0`
- `{OUTPUT_DIR}/results_{REGION}_1`
- etc.

## Error Handling

The scraper includes error handling:
- HTTP 429 (rate limiting) and 5xx errors trigger automatic retries
- 10-minute delays between retry attempts
- Logging of errors and progress

## Testing

Run the test suite:
```bash
npm test
```

Run mutation testing:
```bash
npm run stryker
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Krzysztof Pająk (Chris Araneo) - chris.araneo@gmail.com
