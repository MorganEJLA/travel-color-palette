import { useState } from "react";
import { useAuth } from "./useAuth";
import SignInModal from "../components/modals/SignInModal";

export function useAuthGate() {
  const { user } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  function authGate(fn) {
    if (user) {
      fn();
    } else {
      setShowSignIn(true);
    }
  }

  function SignInGate() {
    return showSignIn ? (
      <SignInModal
        onClose={() => setShowSignIn(false)}
        onSuccess={() => setShowSignIn(false)}
      />
    ) : null;
  }

  return { authGate, SignInGate };
}
