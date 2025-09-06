import Hero3D from "@/components/Hero3D";
import Quote from "@/components/Quote";
import Timeline from "@/components/Timeline";
import Library from "@/components/Library";
import PodcastShelf from "@/components/PodcastShelf";
import HumanVerification from "@/components/HumanVerification";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Hero3D />
      <Quote />
      <Timeline />
  <HumanVerification />
  <Library id="library" />
  <PodcastShelf id="podcasts" />
  <Footer />
    </main>
  );
}
