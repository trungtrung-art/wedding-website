import { EnvelopeDemoCss3D } from "@/components/demos/envelope-demo-css-3d";

export default function EnvelopeCss3DDemoPage() {
  return (
    <main className="wedding-canvas grid min-h-screen place-items-center px-5 py-16">
      <div className="space-y-10 text-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.42em] text-bronze-500">Option A</p>
          <h1 className="font-serif text-4xl font-light text-burgundy-900 md:text-6xl">
            CSS 3D envelope
          </h1>
          <p className="mx-auto max-w-md text-sm text-burgundy-900/70">
            Top triangle flap hinges back in real 3D space via CSS perspective +
            preserve-3d. The remaining 4 paper pieces are flat SVG behind.
            Zero new dependencies.
          </p>
        </div>
        <EnvelopeDemoCss3D />
      </div>
    </main>
  );
}
