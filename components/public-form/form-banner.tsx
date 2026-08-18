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
        className="h-28 w-full sm:h-36"
        style={{ backgroundColor: accentColor }}
      />
    );
  }

  if (banner.type === "image") {
    return (
      <div
        className="bg-muted h-40 w-full sm:h-48"
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
