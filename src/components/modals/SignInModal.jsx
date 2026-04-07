import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";


export default function SignInModal({ onClose, onSuccess }) {
  async function handleGoogleSignIn() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const authorizedEmail = import.meta.env.VITE_AUTHORIZED_EMAIL;

      if (result.user.email !== authorizedEmail) {
        await auth.signOut();
        alert("Access is restricted. This atlas is private.");
        return;
      }

      onSuccess(result.user);
      onClose();
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 26, 24, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F0EBE0",
          padding: "3rem",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#999",
                marginBottom: "0.5rem",
              }}
            >
              Chromaterra
            </p>
            <h2
              style={{
                fontFamily: "'Abril Fatface', cursive",
                fontSize: "2rem",
                fontWeight: 400,
                color: "#1A1A18",
                lineHeight: 1,
              }}
            >
              Sign In
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "#aaa",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.1em",
            }}
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "#C8C0B0" }} />

        {/* Description */}
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.06em",
            lineHeight: 1.9,
            color: "#777",
          }}
        >
          Sign in to access your atlas, save palettes, and generate new locales
          from your travel photos.
        </p>

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            background: "#1A1A18",
            color: "#F0EBE0",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            padding: "0.9rem 1.6rem",
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.52rem",
            letterSpacing: "0.06em",
            lineHeight: 1.8,
            color: "#bbb",
            textAlign: "center",
          }}
        >
          Access is by invitation only. Only authorized accounts can sign in.
        </p>
      </div>
    </div>
  );
}
