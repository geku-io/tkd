import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./tests/mocks/server";
import { cleanup } from "@testing-library/react";

beforeAll(() => server.listen());
afterEach(() => {
   server.resetHandlers();
   cleanup();
});

afterAll(() => server.close());

vi.mock("next/navigation", () => ({
   useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
   }),
   usePathname: () => "/",
   useSearchParams: () => ({
      get: vi.fn(),
      has: vi.fn(),
   }),
}));
