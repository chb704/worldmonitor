/**
 * Vercel Edge Middleware:
 * 1) Optional HTTP Basic auth for all routes (set APP_PASSWORD to enable).
 * 2) Bot/crawler blocking for API routes.
 * Social preview bots are allowed on /api/story and /api/og-story.
 */

const BOT_UA =
  /bot|crawl|spider|slurp|archiver|wget|curl\/|python-requests|scrapy|httpclient|go-http|java\/|libwww|perl|ruby|php\/|ahrefsbot|semrushbot|mj12bot|dotbot|baiduspider|yandexbot|sogou|bytespider|petalbot|gptbot|claudebot|ccbot/i;

const SOCIAL_PREVIEW_UA =
  /twitterbot|facebookexternalhit|linkedinbot|slackbot|telegrambot|whatsapp|discordbot|redditbot/i;

const SOCIAL_PREVIEW_PATHS = new Set(['/api/story', '/api/og-story']);
const PROTECTED_PATH_BYPASSES = ['/favicon.ico'];
const runtimeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

interface BasicCredentials {
  username: string;
  password: string;
}

function parseBasicCredentials(authHeader: string | null): BasicCredentials | null {
  if (!authHeader) return null;
  const [scheme, encoded] = authHeader.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !encoded) return null;
  try {
    const decoded = atob(encoded);
    const separator = decoded.indexOf(':');
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function isProtectedPath(path: string): boolean {
  if (path.startsWith('/_vercel/')) return false;
  return !PROTECTED_PATH_BYPASSES.includes(path);
}

function isRequestAuthorized(request: Request): boolean {
  const expectedPassword = runtimeEnv.APP_PASSWORD?.trim();
  if (!expectedPassword) return true;

  const expectedUsername = runtimeEnv.APP_USERNAME?.trim() ?? '';
  const credentials = parseBasicCredentials(request.headers.get('authorization'));
  if (!credentials) return false;
  if (credentials.password !== expectedPassword) return false;
  if (expectedUsername && credentials.username !== expectedUsername) return false;
  return true;
}

function unauthorizedResponse(): Response {
  const realm = runtimeEnv.APP_AUTH_REALM?.trim() || 'WorldMonitor';
  return new Response('Authentication required', {
    status: 401,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'WWW-Authenticate': `Basic realm="${realm}"`,
    },
  });
}

function forbiddenJson(): Response {
  return new Response('{"error":"Forbidden"}', {
    status: 403,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function middleware(request: Request) {
  const ua = request.headers.get('user-agent') ?? '';
  const url = new URL(request.url);
  const path = url.pathname;

  // Lock down all routes when APP_PASSWORD is configured.
  if (isProtectedPath(path) && !isRequestAuthorized(request)) {
    return unauthorizedResponse();
  }

  // Non-API routes are handled by static hosting; no additional filtering required.
  if (!path.startsWith('/api/')) {
    return;
  }

  // Allow social preview bots on exact OG routes only
  if (SOCIAL_PREVIEW_UA.test(ua) && SOCIAL_PREVIEW_PATHS.has(path)) {
    return;
  }

  // Block bots from all API routes
  if (BOT_UA.test(ua)) {
    return forbiddenJson();
  }

  // No user-agent or suspiciously short — likely a script
  if (!ua || ua.length < 10) {
    return forbiddenJson();
  }
}

export const config = {
  matcher: '/:path*',
};
