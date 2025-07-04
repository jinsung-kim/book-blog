import { PostHog } from 'posthog-js';

let posthog: PostHog | undefined = undefined;

if (typeof window !== 'undefined') {
  // Only import dynamically in browser to ensure React context is ready
  const client = require('posthog-js');
  posthog = client.default;
}

export function captureEvent(name: string, props?: Record<string, any>) {
  if (posthog) {
    posthog.capture(name, props);
  }
}
