// Simple in-memory mock store for clips

export interface Clip {
  id: string;
  userId: string;
  title: string;
  thumbnail: string;
  score: number;
  scoreKey: string;
  duration: string;
  style: string;
  status: string;
  resolution: string;
  videoUrl: string;
  createdAt: string;
}

class ClipsStore {
  private clips: Clip[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Generate some mock clips to use as baseline
    const mockClips = [
      { id: "1", title: "Clip #01 - The Big Reveal Hook", thumbnail: "/projects/thumb1.png", score: 94, scoreKey: "high", duration: "00:45", style: "Bold & Dynamic", status: "pending", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: "2", title: "Clip #02 - Technical Deep Dive", thumbnail: "/projects/thumb2.png", score: 68, scoreKey: "medium", duration: "00:58", style: "Minimalist", status: "listed", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: "3", title: "Clip #03 - Audience Reaction", thumbnail: "/projects/thumb3.png", score: 82, scoreKey: "high", duration: "00:32", style: "Emoji-Rich", status: "pending", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: "4", title: "Clip #04 - Feature Walkthrough", thumbnail: "/projects/thumb1.png", score: 91, scoreKey: "high", duration: "00:52", style: "Subtitles Only", status: "history", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
      { id: "5", title: "Clip #05 - Closing Remarks", thumbnail: "/projects/thumb2.png", score: 42, scoreKey: "low", duration: "01:12", style: "Minimalist", status: "pending", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
      { id: "6", title: "Clip #06 - Product Detail B-Roll", thumbnail: "/projects/thumb3.png", score: 89, scoreKey: "high", duration: "00:44", style: "Bold & Dynamic", status: "listed", resolution: "1080x1920", videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
    ];
    
    // Create base pool that users will pull from 
    this.clips = mockClips.map(clip => ({
      ...clip,
      userId: "default", // will be replaced when requested
      createdAt: new Date().toISOString()
    }));
  }

  // Gets clips for a specific user, seeding them if they don't exist yet
  getClipsForUser(userId: string): Clip[] {
    const userClips = this.clips.filter(c => c.userId === userId);
    
    // If no clips exist for this user, duplicate the seed pool for them
    if (userClips.length === 0) {
      const newClips = this.clips.filter(c => c.userId === "default").map((c, idx) => ({
        ...c,
        id: `${userId}-clip-${idx}`,
        userId
      }));
      this.clips.push(...newClips);
      return newClips;
    }
    
    return userClips;
  }
  
  updateClipStatus(userId: string, clipIds: string[], status: string) {
    let updatedCount = 0;
    this.clips = this.clips.map(clip => {
      if (clip.userId === userId && clipIds.includes(clip.id)) {
        updatedCount++;
        return { ...clip, status };
      }
      return clip;
    });
    return updatedCount;
  }
}

export const clipsStore = new ClipsStore();
