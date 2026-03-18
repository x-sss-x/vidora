import { VideoCard } from "@/components/video-card";

export const mockVideos = [
  {
    id: "1",
    title: "Build a Netflix Clone with Next.js 15 and Tailwind",
    thumbnailUrl: "https://picsum.photos/seed/vid1/800/450",
    createdAt: new Date("2025-01-10"),
    duration: "12:45",
  },
  {
    id: "2",
    title: "Understanding tRPC in 15 Minutes (Full Guide)",
    thumbnailUrl: "https://picsum.photos/seed/vid2/800/450",
    createdAt: new Date("2025-02-02"),
    duration: "15:20",
  },
  {
    id: "3",
    title: "Mux Video Streaming Setup for Beginners",
    thumbnailUrl: "https://picsum.photos/seed/vid3/800/450",
    createdAt: new Date("2025-02-18"),
    duration: "9:10",
  },
  {
    id: "4",
    title: "Build a YouTube Clone UI with ShadCN Components",
    thumbnailUrl: "https://picsum.photos/seed/vid4/800/450",
    createdAt: new Date("2025-03-01"),
    duration: "18:32",
  },
  {
    id: "5",
    title: "Next.js App Router Explained (2025 Edition)",
    thumbnailUrl: "https://picsum.photos/seed/vid5/800/450",
    createdAt: new Date("2025-03-05"),
    duration: "21:05",
  },
  {
    id: "6",
    title: "Zustand vs Redux — Which Should You Use?",
    thumbnailUrl: "https://picsum.photos/seed/vid6/800/450",
    createdAt: new Date("2025-03-07"),
    duration: "11:50",
  },
  {
    id: "7",
    title: "Full Stack Project Structure with T3 Stack",
    thumbnailUrl: "https://picsum.photos/seed/vid7/800/450",
    createdAt: new Date("2025-03-09"),
    duration: "14:12",
  },
  {
    id: "8",
    title: "Deploy Next.js App using Bun and Docker",
    thumbnailUrl: "https://picsum.photos/seed/vid8/800/450",
    createdAt: new Date("2025-03-12"),
    duration: "16:40",
  },
];

export default async function Home() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {mockVideos.map((v) => (
        <VideoCard
          createdAt={v.createdAt}
          duration={v.duration}
          id={v.id}
          key={v.id}
          thumbnailUrl={v.thumbnailUrl}
          title={v.title}
        />
      ))}
    </div>
  );
}
