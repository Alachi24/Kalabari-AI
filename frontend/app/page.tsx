import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { TextGeneration } from "@/components/text-generation";
import { LanguageDetection } from "@/components/language-detection";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "LinguaAI - Translate Languages with AI",
  description:
    "Break language barriers instantly with LinguaAI. Fast, accurate translations powered by advanced AI.",
};

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <Hero />
      <TextGeneration />
      <LanguageDetection />
      <Features />
      <Footer />
    </div>
  );
}
