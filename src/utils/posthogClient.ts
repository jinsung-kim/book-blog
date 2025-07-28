import { PostHog } from 'posthog-js';

let posthog: PostHog | undefined = undefined;

if (typeof window !== 'undefined') {
  // Only import dynamically in browser to ensure React context is ready.
  const client = require('posthog-js');
  posthog = client.default;

  posthog.init(process.env.REACT_APP_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
    person_profiles: 'always',
    loaded: ph => {
      if (process.env.NODE_ENV === 'development') {
        ph.debug();
      }
    },
  });

  // Avoid re-initializing.
  (posthog as any).__loaded = true;
}

export default posthog;

export function captureEvent(name: string, props?: Record<string, any>) {
  if (posthog) {
    posthog.capture(name, props);
  }
}
