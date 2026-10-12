"use client";
import { deleteReview } from "./actions";
export function DeleteReviewButton({ id }: { id: string }) {
  return (
    <form
      action={deleteReview}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Permanently delete this review? This action cannot be undone."
        );
        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 sm:w-auto"
      >
        Delete
      </button>
    </form>
  );
}
