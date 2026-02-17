
import React, { useState } from 'react';
import { Play, X, Star, Sparkles, MonitorPlay } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import ReactPlayer from 'react-player';

// Using direct MP4 files from Pexels/Stock sources to ensure 100% in-app playback reliability.
// These serve as placeholders for the actual lesson content.
const VIDEOS = [
  { 
    id: 'abc', 
    title: 'The Alphabet Adventure', 
    category: 'Basics', 
    color: 'bg-fun-pink', 
    url: 'https://videos.pexels.com/video-files/5906253/5906253-hd_1920_1080_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1629738722915-02553755452e?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'phonics', 
    title: 'Phonics Fun', 
    category: 'Phonics', 
    color: 'bg-fun-blue', 
    url: 'https://videos.pexels.com/video-files/8925508/8925508-hd_1920_1080_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'colors', 
    title: 'World of Colors', 
    category: 'Vocabulary', 
    color: 'bg-fun-green', 
    url: 'https://videos.pexels.com/video-files/2869818/2869818-hd_1920_1080_30fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'math', 
    title: 'Counting 1-10', 
    category: 'Math', 
    color: 'bg-fun-yellow', 
    url: 'https://videos.pexels.com/video-files/5906258/5906258-hd_1920_1080_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'move', 
    title: 'Move Your Body', 
    category: 'Movement', 
    color: 'bg-fun-purple', 
    url: 'https://videos.pexels.com/video-files/8612163/8612163-hd_1920_1080_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'greet', 
    title: 'Hello Friends!', 
    category: 'Conversation', 
    color: 'bg-fun-orange', 
    url: 'https://videos.pexels.com/video-files/3245464/3245464-hd_1920_1080_25fps.mp4',
    thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop'
  },
];

const VideoLearning: React.FC = () => {
  const { awardPoints, mode } = useGamification();
  // Store the full video object instead of just ID so we have the URL
  const [activeVideo, setActiveVideo] = useState<typeof VIDEOS[0] | null>(null);
  const isKids = mode === 'kids';

  const handlePlay = (video: typeof VIDEOS[0]) => {
    setActiveVideo(video);
    awardPoints(20, 'Started Video Lesson');
  };

  const handleClose = () => {
    setActiveVideo(null);
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block relative">
             <div className="absolute -top-6 -right-6 text-fun-yellow animate-bounce">
                <Star size={48} fill="currentColor" />
             </div>
             <h2 className={`${isKids ? 'text-6xl font-black' : 'text-4xl font-bold'} text-slate-800 tracking-tight`}>
                {isKids ? 'TV TIME!' : 'Video Lessons'}
             </h2>
        </div>
        <p className="text-slate-500 font-bold text-xl">
           {isKids ? 'Watch, Sing, and Learn!' : 'Curated video content for immersive learning.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {VIDEOS.map((video) => (
          <div 
            key={video.id}
            onClick={() => handlePlay(video)}
            className={`group relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-b-[12px] border-slate-100 cursor-pointer hover:translate-y-[-8px] transition-all duration-300`}
          >
            {/* Thumbnail Area */}
            <div className={`aspect-video relative overflow-hidden bg-slate-200`}>
                <img 
                    src={video.thumb} 
                    alt={video.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className={`${video.color} w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-125 transition-all border-4 border-white`}>
                        <Play size={24} className="text-white fill-current ml-1" />
                    </div>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${video.color}`}>
                        {video.category}
                    </span>
                    <Sparkles size={16} className="text-fun-yellow" />
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-fun-blue transition-colors">
                    {video.title}
                </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-5xl bg-black rounded-[2rem] overflow-hidden shadow-2xl relative border-4 border-slate-800 flex flex-col">
                <button 
                    onClick={handleClose}
                    className="absolute -top-4 -right-4 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors z-20 border-4 border-slate-900"
                >
                    <X size={24} strokeWidth={3} />
                </button>
                
                <div className="aspect-video bg-black relative flex items-center justify-center rounded-t-[1.8rem] overflow-hidden">
                    <ReactPlayer
                        key={activeVideo.id}
                        url={activeVideo.url}
                        width="100%"
                        height="100%"
                        playing={true}
                        controls={true}
                        // MP4 config usually needs minimal tweaking, but we ensure it expands fully
                        style={{ backgroundColor: 'black' }}
                    />
                </div>
                
                <div className="bg-slate-900 p-6 flex justify-between items-center text-white rounded-b-[1.8rem]">
                    <div>
                        <h3 className="font-bold text-lg text-white">{activeVideo.title}</h3>
                        <p className="text-slate-400 text-sm">Interactive Learning Session</p>
                    </div>
                    <div className="flex gap-2 items-center bg-red-500/10 px-4 py-2 rounded-full border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                        <span className="text-xs font-black uppercase tracking-widest text-red-500">Playing Now</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default VideoLearning;
