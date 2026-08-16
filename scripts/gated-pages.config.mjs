// Maps each password-gated public route to the "raw" (unencrypted) route that
// renders its real content, and the env var holding the password used to
// derive the AES key. Low-stakes gate — see docs/password-gate.md.
//
// Passwords come from environment variables, not this file:
//   - local dev/build: set them in .env (gitignored) — see .env.example
//   - CI/deploy: set them as GitHub Actions repo secrets, passed into the
//     build step's env in .github/workflows/deploy.yml
//
// To add a new gated page: build a raw page under src/pages/raw-content/, a
// loader page using <PasswordGate />, add an entry here, and add its env var
// to .env.example and the deploy workflow.
export const gatedPages = [
	{ raw: 'raw-content/meditationlibrary', loader: 'meditationlibrary', passwordEnv: 'GATE_MEDITATION_LIBRARY' },
	{ raw: 'raw-content/en/meditationlibrary', loader: 'en/meditationlibrary', passwordEnv: 'GATE_MEDITATION_LIBRARY' },
];
