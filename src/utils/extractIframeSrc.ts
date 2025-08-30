export function extractIframeSrc(html: string): string | null {
  const regex = /<iframe[^>]*src="([^"]*)"/;
  const match = html.match(regex);
  return match ? match[1] : null;
}
