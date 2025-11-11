import WidgetInstructions from "@/components/sites/WidgetInstructions";
import { Section, SectionContent, TableHolder, Title } from "@/components/Ui";
import Image from "next/image";
function EndPoint({ url = "", hint = "" }) {
  return (
    <li className="p-2">
      <span className="ixtalic text-sky-800 xopacity-50 bg-white ring-1 ring-gray-200 px-2 py-1">
        {url}
      </span>
      <span className="italic pl-2 xopacity-50">{hint}</span>
    </li>
  );
}
export default async function HelpPage() {
  return (
    <Section>
      <Title>About</Title>
      <SectionContent>
        <div className="p-6 xtext-center text-black xtext-xs bg-gray-50">
          <p>
            <b>Feedbaker (a playful twist on &ldquo;feedback&ldquo;)</b> is a
            small-scale feedback management service designed for websites and
            applications. Its purpose is to provide a simple yet powerful
            platform for collecting, organizing, and moderating user feedback.
          </p>
          <p>
            Owners (developers or product managers) can register using Google
            OAuth, create site entries, and embed a lightweight feedback widget
            on their websites. Visitors can submit feedback directly through
            these widgets, while owners can view, moderate, and respond to
            feedback in a web dashboard or via a REST API. Login to feedbaker,
            add own site and you will be able to integrate feedback widget into
            it.
          </p>
        </div>
      </SectionContent>
      <WidgetInstructions
        site_id={"aaaaaaaa-1234-1234-1234-ffffffffffff"}
        src={`${process.env.NEXT_PUBLIC_API_URL}/feedbaker.js`}
      />
      <Title>Public Endpoints</Title>
      <SectionContent>
        <div className="p-6 xtext-center text-black xtext-xs bg-gray-50">
          <ul className="clist-disc cml-4">
            <EndPoint url="GET /api/sites" hint="site list" />

            <EndPoint url="GET /api/sites/:site_id " hint="site details" />
            <EndPoint
              url="GET /api/sites/:site_id/feedback"
              hint="feedback list"
            />
            <EndPoint
              url="GET /api/sites/:site_id/feedback/:feedback_id"
              hint="feedback details"
            />
            <EndPoint
              url="POST /api/sites/:site_id/feedback"
              hint="submit public feedback"
            />
          </ul>
        </div>
      </SectionContent>
      <Title>Example of Widget Usage</Title>
      <SectionContent>
        <TableHolder className="bg-gray-50 p-4 gap-4">
          <Image src="/widgetscreen1.png" alt="eee" width={1000} height={500} />
          <Image src="/widgetscreen2.png" alt="eee" width={1000} height={500} />
        </TableHolder>
      </SectionContent>
    </Section>
  );
}
