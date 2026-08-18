import type { FormRecord } from "@/lib/forms/types";

export const sampleForms: FormRecord[] = [
  {
    id: "1",
    slug: "customer-feedback",
    title: "Customer Feedback Survey",
    description:
      "We'd love to hear your thoughts — this only takes a couple of minutes.",
    accentColor: "#f97316",
    status: "published",
    responseCount: 14,
    updatedAt: "2026-08-10",
    theme: {
      fontFamily: "sans",
      fontWeight: "semibold",
      banner: { type: "color" },
    },
    fields: [
      {
        id: "full-name",
        type: "short_text",
        label: "Full name",
        placeholder: "Jane Cooper",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email address",
        placeholder: "jane@example.com",
        required: true,
      },
      {
        id: "referral-source",
        type: "single_choice",
        label: "How did you hear about us?",
        required: true,
        options: [
          { label: "Search engine", value: "search" },
          { label: "Social media", value: "social" },
          { label: "Friend or colleague", value: "referral" },
          { label: "Advertisement", value: "ad" },
          { label: "Other", value: "other" },
        ],
      },
      {
        id: "features-used",
        type: "multi_choice",
        label: "Which features do you use most?",
        description: "Select all that apply.",
        options: [
          { label: "Form builder", value: "builder" },
          { label: "Templates", value: "templates" },
          { label: "Analytics", value: "analytics" },
          { label: "Integrations", value: "integrations" },
        ],
      },
      {
        id: "satisfaction",
        type: "dropdown",
        label: "Overall satisfaction",
        required: true,
        options: [
          { label: "Excellent", value: "excellent" },
          { label: "Good", value: "good" },
          { label: "Average", value: "average" },
          { label: "Poor", value: "poor" },
        ],
      },
      {
        id: "comments",
        type: "long_text",
        label: "Any additional comments?",
        placeholder: "Tell us more...",
      },
    ],
  },
  {
    id: "2",
    slug: "event-registration",
    title: "Event Registration",
    description: "Reserve your spot for our upcoming product launch event.",
    accentColor: "#6366f1",
    status: "draft",
    responseCount: 0,
    updatedAt: "2026-08-15",
    theme: {
      fontFamily: "sans",
      fontWeight: "normal",
      banner: { type: "none" },
    },
    fields: [
      {
        id: "name",
        type: "short_text",
        label: "Full name",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email address",
        required: true,
      },
      {
        id: "guests",
        type: "dropdown",
        label: "Number of guests",
        required: true,
        options: [
          { label: "Just me", value: "1" },
          { label: "Me + 1 guest", value: "2" },
          { label: "Me + 2 guests", value: "3" },
        ],
      },
    ],
  },
];
