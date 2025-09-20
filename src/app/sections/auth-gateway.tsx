"use client";

import { useUser } from "@stackframe/stack";

import { AuthenticatedSection } from "./authenticated-section";
import { SignedOutSection } from "./signed-out-section";

export function AuthGateway() {
  const user = useUser({ or: "return-null" });

  if (user) {
    return <AuthenticatedSection user={user} />;
  }

  return <SignedOutSection />;
}
