import { SvgDashboard, SvgPromo, SvgSecure, SvgWidget } from "@/components/Svg";
import { Section, Title } from "@/components/Ui";

export default function MainPage() {
  return (
    <>
      <Section className="p-4 gap-4 grid grid-cols-3" promo>
        <div className="p-4 items-start col-span-2">
          <h1 className="text-2xl font-bold text-left">
            Gather User Feedback2
            <br />
            That Matter
          </h1>
          <p>
            Simple, powerful feedback management for your website and apps.
            <br />
            {`Join now. It's Free!`}
          </p>
        </div>
        <div className="grid flex-1 text-sky-600 bg-black/10 p-4  items-center justify-center">
          <SvgPromo />
        </div>
      </Section>
      <Section>
        <Title>Key features</Title>
        <div className="grid grid-cols-3 gap-4 text-amber-800">
          <div className="flex flex-1 flex-col gap-2 text-center justify-center items-center p-4 bg-gray-100">
            <SvgWidget />
            Lightweight Embeddable Widget
          </div>
          <div className="flex  flex-1 flex-col gap-2 text-center justify-center items-center p-4 bg-gray-100">
            <SvgDashboard />
            <div className="flex-1">Owner Dashboard & Moderation</div>
          </div>
          <div className="flex  flex-1 flex-col gap-2 text-center justify-center items-center p-4 bg-gray-100">
            <SvgSecure />
            <div className="flex-1">Secure Google Oauth</div>
          </div>
        </div>
      </Section>
      <Section>
        <Title>Recent Feedback</Title>
        <div className="flex flex-col gap-1 bg-gray-200 -mt-4x border-y-4 border-y-sky-200 "></div>
      </Section>
    </>
  );
}
