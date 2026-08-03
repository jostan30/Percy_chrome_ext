import type { CapturedPageState } from '../types';

/**
 * Runs inside the target page's context via chrome.scripting.executeScript.
 * Keep this function pure and self-contained — it is serialized and injected,
 * it cannot close over anything from the popup's scope.
 */
function readPageState(): { url: string; dom: string; viewportWidth: number; viewportHeight: number; title: string } {
  return {
    url: window.location.href,
    dom: document.documentElement.outerHTML,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    title: document.title
  };
}

/**
 * Captures the DOM, URL, and viewport size of the currently active tab.
 * This is the ONLY thing this extension knows how to do with the page —
 * it has no knowledge of Percy, snapshots naming conventions, or builds.
 */
export async function captureActiveTabState(): Promise<CapturedPageState & { title: string }> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!activeTab?.id) {
    throw new Error('No active tab found to capture.');
  }

  const [injectionResult] = await chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: readPageState
  });

  if (!injectionResult?.result) {
    throw new Error('Failed to capture page state from the active tab.');
  }

  const { url, dom, viewportWidth, viewportHeight, title } = injectionResult.result;
  return { url, dom, viewportWidth, viewportHeight, title };
}
