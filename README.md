# TimeBlock API

A modern time management application API built with GraphQL, and Node.js.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/timeblock-api.git
cd timeblock-api
```

### Installation

Install the project dependencies:

```bash
yarn install
```

### Environment Setup

1. Create a `.env` file in the root directory
2. Copy the contents from `.env.example` to `.env`
3. Update the environment variables with your specific configuration

### Running the Application

#### Development Mode

```bash
npm run dev
# or
yarn dev
```

The development server will start, typically on `http://localhost:3000` (or your configured port).

#### Production Mode

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Project Structure

```
timeblock-api/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Data models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── tests/              # Test files
└── package.json        # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm test` - Run tests
- `npm run lint` - Run linting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

https://chatgpt.com/canvas/shared/6808944de5548191a5da1955ae3b2b10
