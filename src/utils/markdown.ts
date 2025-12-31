export function extractFirstImage(markdown: string): string | null {
    const match = markdown.match(/!\[[^\]]*]\(([^)]+)\)/);
    return match ? match[1] : null;
}