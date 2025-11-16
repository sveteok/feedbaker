"use client";
import { useEffect } from "react";

import { Section, SectionContent, Title } from "@/components/Ui";

export default function MainError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Caught by error.tsx:", error);
  }, [error]);

  return (
    <Section>
      <Title className="bg-red-500">Access Denied</Title>
      <SectionContent className="bg-red-500">
        <div className="p-6 xtext-center text-black xtext-xs bg-gray-50">
          <p>Something went wrong!</p>
          <p>{error.message}</p>
        </div>
      </SectionContent>
    </Section>
  );
}
