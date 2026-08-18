import type { FormResponse } from "@/lib/forms/types";

const feedbackResponses: FormResponse[] = [
  {
    id: "r1",
    formId: "1",
    submittedAt: "2026-08-11T09:12:00Z",
    answers: {
      "full-name": "Jane Cooper",
      email: "jane.cooper@example.com",
      "referral-source": "search",
      "features-used": ["builder", "templates"],
      satisfaction: "excellent",
      comments: "Really smooth experience setting up my first form.",
    },
  },
  {
    id: "r2",
    formId: "1",
    submittedAt: "2026-08-11T14:45:00Z",
    answers: {
      "full-name": "Wade Warren",
      email: "wade.warren@example.com",
      "referral-source": "social",
      "features-used": ["analytics"],
      satisfaction: "good",
      comments: "",
    },
  },
  {
    id: "r3",
    formId: "1",
    submittedAt: "2026-08-12T08:03:00Z",
    answers: {
      "full-name": "Esther Howard",
      email: "esther.howard@example.com",
      "referral-source": "referral",
      "features-used": ["builder", "integrations"],
      satisfaction: "good",
      comments: "Would love more field types.",
    },
  },
  {
    id: "r4",
    formId: "1",
    submittedAt: "2026-08-12T16:22:00Z",
    answers: {
      "full-name": "Cameron Williamson",
      email: "cameron.williamson@example.com",
      "referral-source": "ad",
      "features-used": ["templates", "analytics", "integrations"],
      satisfaction: "average",
      comments: "The dashboard could load a bit faster.",
    },
  },
  {
    id: "r5",
    formId: "1",
    submittedAt: "2026-08-13T11:30:00Z",
    answers: {
      "full-name": "Brooklyn Simmons",
      email: "brooklyn.simmons@example.com",
      "referral-source": "search",
      "features-used": ["builder"],
      satisfaction: "excellent",
      comments: "",
    },
  },
  {
    id: "r6",
    formId: "1",
    submittedAt: "2026-08-13T18:07:00Z",
    answers: {
      "full-name": "Leslie Alexander",
      email: "leslie.alexander@example.com",
      "referral-source": "other",
      "features-used": ["builder", "templates", "analytics"],
      satisfaction: "poor",
      comments: "Ran into a bug exporting my responses.",
    },
  },
  {
    id: "r7",
    formId: "1",
    submittedAt: "2026-08-14T10:15:00Z",
    answers: {
      "full-name": "Guy Hawkins",
      email: "guy.hawkins@example.com",
      "referral-source": "social",
      "features-used": ["integrations"],
      satisfaction: "good",
      comments: "",
    },
  },
  {
    id: "r8",
    formId: "1",
    submittedAt: "2026-08-14T20:50:00Z",
    answers: {
      "full-name": "Kristin Watson",
      email: "kristin.watson@example.com",
      "referral-source": "referral",
      "features-used": ["builder", "analytics"],
      satisfaction: "excellent",
      comments: "Customer support was fantastic.",
    },
  },
  {
    id: "r9",
    formId: "1",
    submittedAt: "2026-08-15T09:41:00Z",
    answers: {
      "full-name": "Ralph Edwards",
      email: "ralph.edwards@example.com",
      "referral-source": "search",
      "features-used": ["templates"],
      satisfaction: "average",
      comments: "",
    },
  },
  {
    id: "r10",
    formId: "1",
    submittedAt: "2026-08-15T15:12:00Z",
    answers: {
      "full-name": "Devon Lane",
      email: "devon.lane@example.com",
      "referral-source": "ad",
      "features-used": ["builder", "integrations"],
      satisfaction: "good",
      comments: "Happy with the accent color customization.",
    },
  },
  {
    id: "r11",
    formId: "1",
    submittedAt: "2026-08-16T07:58:00Z",
    answers: {
      "full-name": "Savannah Nguyen",
      email: "savannah.nguyen@example.com",
      "referral-source": "social",
      "features-used": ["analytics", "integrations"],
      satisfaction: "excellent",
      comments: "",
    },
  },
  {
    id: "r12",
    formId: "1",
    submittedAt: "2026-08-16T13:36:00Z",
    answers: {
      "full-name": "Arlene McCoy",
      email: "arlene.mccoy@example.com",
      "referral-source": "other",
      "features-used": ["builder"],
      satisfaction: "good",
      comments: "Simple and effective.",
    },
  },
  {
    id: "r13",
    formId: "1",
    submittedAt: "2026-08-17T10:05:00Z",
    answers: {
      "full-name": "Jacob Jones",
      email: "jacob.jones@example.com",
      "referral-source": "referral",
      "features-used": ["templates", "builder"],
      satisfaction: "average",
      comments: "",
    },
  },
  {
    id: "r14",
    formId: "1",
    submittedAt: "2026-08-17T19:27:00Z",
    answers: {
      "full-name": "Courtney Henry",
      email: "courtney.henry@example.com",
      "referral-source": "search",
      "features-used": ["builder", "templates", "integrations"],
      satisfaction: "excellent",
      comments: "Best form tool we've tried so far.",
    },
  },
];

export const sampleResponses: FormResponse[] = [...feedbackResponses];

export function getResponsesForForm(formId: string): FormResponse[] {
  return sampleResponses.filter((response) => response.formId === formId);
}
