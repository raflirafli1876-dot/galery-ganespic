import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import TeamModal from "@/components/TeamModal";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/useTheme";
import { fetchGallery, fetchTeam, type ActivityWithItems, type TeamMember } from "@/lib/supabase";

function App() {
  const { theme, toggle } = useTheme();
  const [activities, setActivities] = useState<ActivityWithItems[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const [teamOpen, setTeamOpen] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setGalleryLoading(true);
    fetchGallery()
      .then((data) => {
        if (active) setActivities(data);
      })
      .catch((err) => {
        if (active) setGalleryError(err.message);
      })
      .finally(() => {
        if (active) setGalleryLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!teamOpen || team.length > 0) return;
    let active = true;
    setTeamLoading(true);
    fetchTeam()
      .then((data) => {
        if (active) setTeam(data);
      })
      .catch(() => {
        if (active) setTeam([]);
      })
      .finally(() => {
        if (active) setTeamLoading(false);
      });
    return () => {
      active = false;
    };
  }, [teamOpen, team.length]);

  return (
    <div className="min-h-screen bg-sage-wash transition-colors duration-300">
      <Navbar theme={theme} onToggleTheme={toggle} onOpenTeam={() => setTeamOpen(true)} />
      <main>
        <Hero />
        {galleryError ? (
          <div className="py-24 text-center">
            <p className="text-sage-800/70 dark:text-sage-200/70">
              Gagal memuat galeri. Silakan coba muat ulang halaman.
            </p>
          </div>
        ) : (
          <Gallery activities={activities} loading={galleryLoading} />
        )}
      </main>
      <Footer />
      <TeamModal
        open={teamOpen}
        onClose={() => setTeamOpen(false)}
        members={team}
        loading={teamLoading}
      />
    </div>
  );
}

export default App;
