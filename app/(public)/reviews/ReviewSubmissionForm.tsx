
"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitReview } from "./actions";
import type { ReviewFormState } from "./actions";

const initialState: ReviewFormState = {
  status: "idle",
  message: "",
};

export function ReviewSubmissionForm() {
  const [state, formAction, isPending] = useActionState(
    submitReview,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <section
      id="write-review"
      className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-secondary">
          Your experience matters
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Share your experience
        </h2>
        <p className="mt-3 leading-7 text-muted">
          Bought a vehicle from Doctors Autos? Tell us about your
          experience. Your review will be checked before it appears publicly.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-6">
        <div>
          <label
            htmlFor="customerName"
            className="mb-2 block text-sm font-semibold text-primary"
          >
            Your name
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            placeholder="Enter your name"
            className="w-full rounded-lg border border-border bg-white px-4 py-3 text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-primary">
            Your rating
          </legend>
          <div className="flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="cursor-pointer">
                <input
                  className="peer sr-only"
                  type="radio"
                  name="rating"
                  value={rating}
                  required
                />
                <span className="flex h-12 min-w-12 items-center justify-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold text-primary transition hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary/10 peer-checked:text-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-secondary">
                  {rating}
                  <span aria-hidden="true" className="text-secondary">
                    ★
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            1 star = poor, 5 stars = excellent.
          </p>
        </fieldset>

        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-semibold text-primary"
          >
            Your review
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={5}
            minLength={10}
            maxLength={2000}
            required
            placeholder="Tell us about your experience with Doctors Autos..."
            className="w-full resize-y rounded-lg border border-border bg-white px-4 py-3 text-foreground outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          />
          <p className="mt-2 text-xs text-muted">
            Please write between 10 and 2,000 characters.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <label htmlFor="website">Leave this field empty</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {state.message && (
          <p
            role={state.status === "error" ? "alert" : "status"}
            aria-live="polite"
            className={`rounded-lg px-4 py-3 text-sm leading-6 ${
              state.status === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isPending ? "Submitting..." : "Submit review"}
        </button>

        <p className="text-xs leading-5 text-muted">
          Reviews are moderated before publication. Please do not include
          private or sensitive information.
        </p>
      </form>
    </section>
  );
}
