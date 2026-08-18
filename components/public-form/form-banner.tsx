import type { FormBanner } from "@/lib/forms/types";

export function FormBannerDisplay({
  banner,
  accentColor,
}: {
  banner: FormBanner;
  accentColor: string;
}) {
  if (banner.type === "color") {
    return (
      <div
        className="h-36 w-full sm:h-44"
        style={{ backgroundColor: accentColor }}
      />
    );
  }

  if (banner.type === "image") {
    return (
      <div
        className="bg-muted h-52 w-full sm:h-60"
        style={{
          backgroundImage: `url(${banner.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    );
  }

  return (
    <div className="h-2 w-full" style={{ backgroundColor: accentColor }} />
  );
}
