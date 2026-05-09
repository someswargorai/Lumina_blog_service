import { PostHog } from "posthog-node";

export const posthog = new PostHog(
    process.env.posthog_api_key!,
    {
        host: "https://us.posthog.com",
    }
);