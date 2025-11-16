import { Section, SectionContent, Title } from "@/components/Ui";

export default async function UnauthorizedPage() {
  return (
    <Section>
      <Title className="bg-red-500">Access Denied</Title>
      <SectionContent className="bg-red-500">
        <div className="p-6 xtext-center text-black xtext-xs bg-gray-50">
          <p>
            You have no access right for this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>
      </SectionContent>
    </Section>
  );
}
