"use client";
import { Section, SectionContent, Title } from "@/components/Ui";
export default function GlobalError() {
  return (
    <Section>
      <Title className="bg-red-500">Access Denied</Title>
      <SectionContent className="bg-red-500">
        <div className="p-6 xtext-center text-black xtext-xs bg-gray-50">
          <p>Something went wrong!</p>
        </div>
      </SectionContent>
    </Section>
  );
}
