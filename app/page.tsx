import Hero3D from "@/components/Hero3D";
import Quote from "@/components/Quote";
import Timeline from "@/components/Timeline";
import Library from "@/components/Library";
import PodcastShelf from "@/components/PodcastShelf";
import HumanVerification from "@/components/HumanVerification";
import Globe from "@/components/Globe";
import Footer from "@/components/Footer";
import MockTerminal from "@/components/MockTerminal";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Hero3D />
      <Quote />
  <MockTerminal />
      <Timeline />
  <HumanVerification />
  <Globe />
  <Library id="library" />
  <PodcastShelf id="podcasts" />
  <Footer />
    </main>
  );
}
