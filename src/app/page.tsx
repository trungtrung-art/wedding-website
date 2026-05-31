import { SectionRenderer } from "@/components/section-renderer";
import { LanguageToggle } from "@/components/language-toggle";
import { SnapScrollController } from "@/components/snap-scroll-controller";

export default function Home() {
  return (
    <>
      <LanguageToggle />
      <SectionRenderer />
      <SnapScrollController />
    </>
  );
}
