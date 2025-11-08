import FeedbackCard from "@/components/feedback/FeedbackCard";
import { Feedback, PaginatedFeedback } from "@/types/feedback";

export default function FeedbackList({
  feedback,
}: {
  feedback: PaginatedFeedback;
}) {
  console.log(feedback);
  return (
    <>
      <div className="flex flex-col gap-2 bg-emerald-50xx">
        {feedback.feedback.map((fb: Feedback) => (
          <FeedbackCard key={fb.feedback_id} feedback={fb} />
        ))}
        {feedback.totalCount === 0 && (
          <div className="p-6 text-center text-black/50 text-xs bg-gray-50">
            no feedback records found
          </div>
        )}
      </div>
    </>
  );
}
