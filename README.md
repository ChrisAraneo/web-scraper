<h1 align="center">Web Scraper</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/ChrisAraneo/web-scraper/refs/heads/master/logo.png" alt="Web Scraper logo" width="518px" height="200px"/>
  <br>
  <a href="https://github.com/ChrisAraneo/web-scraper/blob/master/package.json"><img src="https://img.shields.io/badge/version-v0.1.0-blue" alt="version"></a>
  <a href="https://github.com/ChrisAraneo/web-scraper/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="Web Scraper is released under the MIT license."></a>
  <a href="https://github.com/ChrisAraneo/web-scraper/actions/workflows/node.js.yml"><img alt="GitHub CI Status" src="https://img.shields.io/github/actions/workflow/status/ChrisAraneo/web-scraper/node.js.yml?label=CI&logo=GitHub"></a>
  <br>
  <br>
  <em>Simple configurable TypeScript web scraping tool</em>
  <br>
</p>

## Installation

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
LEADERBOARDS_URL=https://example.com/
DETAILS_URL=https://example.com/details
FIRST=1
LAST=99
REGION=eu
OUTPUT_DIR=output
```

## Usage

### Running the scraper

```bash
npm start
```

This will:
1. Build the project using [`tsconfig.build.json`](tsconfig.build.json)
2. Execute the compiled JavaScript

### Development

Build the project:
```bash
npm run build
```

Run tests:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

Run all maintenance tasks:
```bash
npm run chores
```

## Technologies and tools

- **TypeScript**: static typing and compilation
- **JSSoup**: HTML parsing
- **Jest**: unit testing framework
- **Stryker**: mutation testing
- **ESLint**: code linting
- **Prettier**: code formatting
- **Axios**: HTTP client
- **RxJS**: reactive programming for async operations

## Architecture

- **[`src/index.ts`](src/index.ts)**: main entry point that runs the scraping process
- **[`src/fetch-list-page.ts`](src/fetch-list-page.ts)**: fetches and parses list pages to extract item IDs
- **[`src/fetch-details-page.ts`](src/fetch-details-page.ts)**: fetches detailed information for individual items
- **[`src/get-website.ts`](src/get-website.ts)**: core HTTP client using Axios and JSSoup for HTML parsing

### Utilities

- **[`src/utils/logger.ts`](src/utils/logger.ts)**: centralized logging functionality
- **[`src/utils/write-file.ts`](src/utils/write-file.ts)**: file writing operations with error handling
- **[`src/utils/should-retry.ts`](src/utils/should-retry.ts)**: retry logic for failed HTTP requests
- **[`src/utils/get-env-or-exit-process.ts`](src/utils/get-env-or-exit-process.ts)**: environment variable validation
- **[`src/utils/create-directory-when-doesnt-exist.ts`](src/utils/create-directory-when-doesnt-exist.ts)**: directory creation utility

## Configuration

The scraper is configured through environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `LEADERBOARDS_URL` | Base URL for list pages | `https://example.com/` |
| `DETAILS_URL` | Base URL for detail pages | `https://example.com/details` |
| `FIRST` | First page number to scrape | `1` |
| `LAST` | Last page number to scrape | `99` |
| `REGION` | Region parameter for requests | `eu` |
| `OUTPUT_DIR` | Directory to save results | `output` |

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
