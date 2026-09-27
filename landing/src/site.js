/**
 * One place for every link and claim the page makes, so nothing has to be
 * hunted down later.
 */

// `releases/latest` always resolves to the newest release, so this link needs
// no maintenance when a new APK is published.
//
// Note: the GitHub repository was renamed from `Pantry-pilot` to
// `Recipe-pilot`; the old URL still redirects, but the canonical one is used
// here so nothing depends on a redirect.
export const RELEASE_URL =
  'https://github.com/Parth-191006/Recipe-pilot/releases/latest';

export const REPO_URL = 'https://github.com/Parth-191006/Recipe-pilot';

export const ALL_RELEASES_URL = `${REPO_URL}/releases`;

export const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;

// Verified against the published v1.3.1 release assets:
// arm64-v8a 17.1 MB · armeabi-v7a 14.6 MB · x86_64 18.6 MB.
export const DOWNLOAD_SIZE = '~17 MB';

export const DOWNLOAD_LABEL = 'Download APK for Android';
