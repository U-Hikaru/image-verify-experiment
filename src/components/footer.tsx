"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      <Button onClick={() => signOut()} variant="link">
        Log out
      </Button>
    </footer>
  );
}
