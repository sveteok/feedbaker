"use client";

import FeedbackAddForm from "@/components/feedback/FeedbackAddForm";
import { DefaultLink, Title } from "@/components/Ui";
import { useFeedbackMutation } from "@/features/feedback/mutations";
import { Site } from "@/types/sites";

export default function FeedbackAddFormController({ site }: { site: Site }) {
  const addFeedbackMutation = useFeedbackMutation("onCreate");

  return (
    <>
      <Title>
        Add New Feedback
        <DefaultLink href={`/sites/${site.site_id}/feedback`}>
          Cancel
        </DefaultLink>
      </Title>
      <FeedbackAddForm
        site_id={site.site_id}
        onSubmit={addFeedbackMutation.mutate}
        disabled={addFeedbackMutation.isPending}
      />
    </>
  );
}
