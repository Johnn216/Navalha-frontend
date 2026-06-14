import { setupWorker } from "msw/browser";

import { handlers } from "@/compartilhado/mocks/handlers";

export const worker = setupWorker(...handlers);
