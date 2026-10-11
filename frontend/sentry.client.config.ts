import * as Sentry from "@sentry/nextjs";
import { scrubSentryEvent } from "./src/lib/monitoring/sentry-scrubber";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: !!SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    return scrubSentryEvent(event);
  },
});
