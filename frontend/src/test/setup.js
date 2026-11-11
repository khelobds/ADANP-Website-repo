import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Vitest runs without globals, so Testing Library can't register its automatic cleanup:
// unmount what each test rendered so the next test starts with an empty page.
afterEach(() => cleanup());
