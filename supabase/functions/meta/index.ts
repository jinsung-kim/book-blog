// @ts-ignore
import { serve } from 'https://deno.land/std/http/server.ts';

// @ts-ignore
const SUPABASE_URL = Deno.env.get('META_SUPABASE_URL')!;
// @ts-ignore
const ANON_KEY = Deno.env.get('META_SUPABASE_ANON_KEY')!;

// Site config
const SITE_URL = 'https://thereadingcorner.net';
const FALLBACK_IMAGE = 'https://jinkim.io/og-fallback-1200x630.png';

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractFirstImage(markdown: string): string | null {
  const imgRegex = /!\[.*?\]\((.*?)\)/;
  const match = markdown.match(imgRegex);
  return match?.[1] ?? null;
}

// Multi-line quote extractor
function extractDescription(markdown: string): string {
  const lines = markdown.split('\n');
  const quoteLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('>')) {
      quoteLines.push(line.replace(/^>\s*/, '').trim());
    } else if (quoteLines.length > 0) {
      break;
    }
  }

  if (quoteLines.length > 0) {
    return escapeHtml(quoteLines.join(' '));
  }

  return escapeHtml(
    markdown
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/[#_*`>-]/g, '')
      .replace(/\n+/g, ' ')
      .trim()
      .slice(0, 200)
  );
}

serve(async (req) => {
  const url = new URL(req.url);
  const slug = url.pathname.split('/').pop();

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  let data: unknown;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/public_post_meta?slug=eq.${slug}&select=slug,title,content`,
      {
        headers: {
          apikey: ANON_KEY,
          Accept: 'application/json',
        },
      }
    );
    data = await res.json();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from Supabase', err }),
      { status: 500 }
    );
  }

  if (!Array.isArray(data)) {
    return new Response(
      JSON.stringify({ error: 'Unexpected Supabase response', data }),
      { status: 500 }
    );
  }

  const post = data[0];
  if (!post) {
    return new Response('Not found', { status: 404 });
  }

  const title = escapeHtml(post.title);
  const excerpt = extractDescription(post.content);
  let image = extractFirstImage(post.content) ?? FALLBACK_IMAGE;

  if (!image.includes('1200x630')) {
    image = FALLBACK_IMAGE;
  }

  const canonicalUrl = `${SITE_URL}/review/${slug}`;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${excerpt}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${canonicalUrl}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${excerpt}" />
  <meta name="twitter:image" content="${image}" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
});
