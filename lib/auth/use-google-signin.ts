/**
 * Google Identity Services (GIS) integration hook.
 *
 * On click, shows the One Tap prompt. When the user selects an account, the
 * credential (ID token JWT) is returned and should be POSTed to our backend's
 * /auth/google endpoint.
 *
 * Requires NEXT_PUBLIC_GOOGLE_CLIENT_ID to be set in the environment.
 */

const GIS_SRC = "https://accounts.google.com/gsi/client";

let scriptLoaded = false;
let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (scriptLoaded) return Promise.resolve();
  if (scriptLoading) return scriptLoading;

  scriptLoading = new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Not in browser"));
      return;
    }

    const script = document.createElement("script");
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };
    script.onerror = () => {
      scriptLoading = null;
      reject(new Error("Failed to load Google Identity Services script"));
    };
    document.head.appendChild(script);
  });

  return scriptLoading;
}

export function useGoogleSignIn() {
  const clientId =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      : undefined;

  const configured = !!clientId;

  async function signInWithGoogle(): Promise<string> {
    if (!clientId) {
      throw new Error("Google sign-in is not configured (NEXT_PUBLIC_GOOGLE_CLIENT_ID)");
    }

    await loadScript();

    return new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Google sign-in timed out"));
      }, 60_000);

      google.accounts.id.initialize({
        client_id: clientId,
        cancel_on_tap_outside: false,
        context: "signin",
        callback: (response) => {
          clearTimeout(timeout);
          if (response.credential) {
            resolve(response.credential);
          } else {
            reject(new Error("No credential returned from Google"));
          }
        },
      });

      // Show the One Tap prompt (account selector popup)
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          clearTimeout(timeout);
          reject(new Error("Google sign-in was skipped or dismissed"));
        }
      });
    });
  }

  return { configured, signInWithGoogle };
}
