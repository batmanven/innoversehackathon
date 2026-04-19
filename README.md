# LexiGuide AI

LexiGuide is an advanced, AI-powered legal document copilot designed to automate document extraction, risk assessment, and clause analysis. By integrating Google Gemini's multimodal capabilities with a robust RAG (Retrieval-Augmented Generation) pipeline, LexiGuide provides professional-grade insights for legal and compliance workflows.

Developed as a submission for the Innoverse Hackathon, the platform focuses on bridging the gap between complex legal jargon and actionable business intelligence.

## Core Capabilities

- **Intelligent Document Ingestion**: Seamless processing of PDF and DOCX files using high-fidelity extraction engines.
- **Persona-Driven Analysis**: Contextual insights tailored for specific professional roles, including Contract Specialists, Compliance Officers, and General Counsel.
- **Automated Clause Categorization**: Dynamic identification and grouping of critical clauses, rights, and obligations.
- **Risk Identification Engine**: Specialized detection of high-impact liabilities, termination triggers, and adverse terms.
- **Interactive Legal Copilot**: A grounded conversational interface allowing users to query document specifics using RAG.
- **Multi-Language Support**: Complete analysis and semantic explanations available across multiple international languages.
- **Professional Reporting**: Export detailed analysis results into structured Markdown reports for external documentation.
- **Local Analytics Persistence**: Secure local storage of analysis history for rapid retrieval and offline review.

## Architecture and Technology

The application is built with a focus on performance, scalability, and premium user experience.

- **Foundational Layer**: React 18 with Vite for a high-performance, typed development environment.
- **AI Orchestration**: LangChain integration with Google Generative AI (Gemini 1.5 Series).
- **Processing Pipeline**: PDF-parse and Mammoth for robust document-to-text conversion.
- **Style Architecture**: Tailwind CSS and Radix UI primitives, featuring a responsive dashboard with adaptive layouts.
- **State Management**: TanStack Query for efficient server-state synchronization and data fetching.
- **Safety and Reliability**: Strict schema validation using Zod and comprehensive error handling across the AI pipeline.

## Getting Started

### Prerequisites

- Node.js version 18.0.0 or higher
- npm or yarn package manager
- A valid Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/batmanven/innoversehackathon.git
   cd LexiGuide
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables:
   Create a `.env` file in the root directory and define the following key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Launch the application:
   ```bash
   npm run dev
   ```

## Development Workflow

- **npm run dev**: Starts the local development server.
- **npm run build**: Generates the production-ready bundle.
- **npm run lint**: Executes ESLint for code quality checks.
- **npm run test**: Runs the Vitest suite for unit and integration testing.

## License

This project is licensed under the MIT License.

---
Created for the Innoverse Hackathon.
