export {}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            cancel_on_tap_outside?: boolean
            auto_select?: boolean
            context?: string
            native_callback?: (...args: unknown[]) => void
            ux_mode?: "popup" | "redirect"
            use_fedcm_for_prompt?: boolean
          }) => void
          prompt: (momentListener?: (notification: {
            isDisplayMoment: () => boolean
            isSkippedMoment: () => boolean
            isDismissedMoment: () => boolean
            getNotDisplayedReason: () => string
            getSkippedReason: () => string
            getDismissedReason: () => string
          }) => void) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
          disableAutoSelect: () => void
          cancel: () => void
          storeCredential: (credential: string, callback: () => void) => void
          onGoogleLibraryLoad: () => void
        }
      }
    }
  }
}
