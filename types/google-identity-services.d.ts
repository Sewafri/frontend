/** Minimal type declarations for Google Identity Services (GIS) client library */

interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: "signin" | "signup" | "use";
  callback: (response: CredentialResponse) => void;
}

interface CredentialResponse {
  credential: string;
  select_by?: string;
}

interface GsiButtonConfiguration {
  type: "standard" | "icon";
  shape?: "rectangular" | "pill" | "circle" | "square";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "large" | "medium" | "small";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  logo_alignment?: "left" | "center";
  width?: number;
}

interface PromptMomentNotification {
  isNotDisplayed: () => boolean;
  isDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

interface Accounts {
  id: {
    initialize: (config: IdConfiguration) => void;
    prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void;
    renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
    disableAutoSelect: () => void;
    storeCredential: (credential: string, callback?: () => void) => void;
    cancel: () => void;
    generateCredential: (hint?: string) => Promise<CredentialResponse>;
  };
  oauth2: {
    initTokenClient: (config: {
      client_id: string;
      scope: string;
      callback: (response: { access_token: string }) => void;
    }) => { requestAccessToken: () => void };
  };
}

interface Google {
  accounts: Accounts;
}

interface Window {
  google?: Google;
}

declare var google: Google;
