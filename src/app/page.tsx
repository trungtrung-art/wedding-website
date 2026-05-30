import { SectionRenderer } from "@/components/section-renderer";
import { LanguageToggle } from "@/components/language-toggle";

export default function Home() {
  return (
    <>
      <LanguageToggle />
      <SectionRenderer />
    </>
  );
}
