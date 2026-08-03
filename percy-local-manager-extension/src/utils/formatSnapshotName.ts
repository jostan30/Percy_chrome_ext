/**
 * Produces a reasonable default snapshot name from a page title and URL.
 * The user can always override this in the popup before capturing.
 */
export function formatDefaultSnapshotName(title: string, url: string): string {
  const cleanTitle = title?.trim();
  if (cleanTitle) return cleanTitle;

  try {
    const { hostname, pathname } = new URL(url);
    return `${hostname}${pathname}`;
  } catch {
    return 'Untitled snapshot';
  }
}
