export function BrandMark() {
  return (
    <img
      src={chrome.runtime.getURL('icons/percy-icon.svg')}
      alt="Percy Logo"
      className="popup__brand-mark"
      width="24"
      height="24"
    />
  );
}