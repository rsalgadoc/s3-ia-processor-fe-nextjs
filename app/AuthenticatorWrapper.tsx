"use client"

import { Authenticator } from "@aws-amplify/ui-react";
import { Cloud } from "lucide-react"

const components = {
  Header() {
    return (
      <div className="p-6 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
          <Cloud className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold">Bienvenido a AWS Serverless Projects</h2>
      </div>
    );
  },
};

export default function AuthenticatorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Authenticator components={components} hideSignUp={true}>{children}</Authenticator>;
}