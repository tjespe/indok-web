const validateEnvironmentVariable = (environmentVariable: string | undefined, name: string): string => {
  if (!environmentVariable) {
    throw new Error(`Couldn't find environment variable: ${name}`);
  }
  return environmentVariable;
};

export const config = {
  GRAPHQL_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_GRAPHQL_BACKEND_URI"
  ),
  INTERNAL_GRAPHQL_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_INTERNAL_GRAPHQL_BACKEND_URI,
    "NEXT_PUBLIC_INTERNAL_GRAPHQL_BACKEND_URI"
  ),
  SENTRY_DSN: validateEnvironmentVariable(process.env.NEXT_PUBLIC_SENTRY_DSN, "NEXT_PUBLIC_SENTRY_DSN"),
  SESSION_COOKIE_NAME: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME,
    "NEXT_PUBLIC_SESSION_COOKIE_NAME"
  ),
  FRONTEND_URI: validateEnvironmentVariable(process.env.NEXT_PUBLIC_FRONTEND_URI, "NEXT_PUBLIC_FRONTEND_URI"),
  APP_ENV: validateEnvironmentVariable(process.env.NEXT_PUBLIC_APP_ENV, "NEXT_PUBLIC_APP_ENV"),
  API_URL: validateEnvironmentVariable(process.env.NEXT_PUBLIC_BASE_API_URL, "NEXT_PUBLIC_BASE_API_URL"),
  INTERNAL_API_URL: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_INTERNAL_API_URL,
    "NEXT_PUBLIC_INTERNAL_API_URL"
  ),
  FEIDE_LOGOUT_ENDPOINT: validateEnvironmentVariable(
    process.env.NEXT_PUBLIC_FEIDE_LOGOUT_URI,
    "NEXT_PUBLIC_FEIDE_LOGOUT_URI"
  ),
};
