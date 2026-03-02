
import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music2, Volume2, VolumeX, ArrowLeft, Star, Sparkles, Users, User, Loader2 } from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import ReactPlayer from 'react-player';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';

interface Video {
  id: string;
  title: string;
  category: string;
  color: string;
  url: string;
  author: string;
  description: string;
  likes: string;
  comments: string;
  channellink?: string;
  avatar?: string;
}

const FALLBACK_VIDEOS: Video[] = [
  { 
    id: 'abc', 
    title: 'The Alphabet Adventure', 
    category: 'Basics', 
    color: 'bg-fun-pink', 
    url: 'https://videos.pexels.com/video-files/5906253/5906253-hd_1920_1080_25fps.mp4',
    author: '@HeroTeacher',
    description: 'Let\'s learn the ABCs together! Sing along and master the alphabet in minutes. 🍎📚',
    likes: '12.4K',
    comments: '1.2K',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HeroTeacher'
  },
  // ... (other fallback videos can keep using dicebear if avatar is missing)
];

const VideoItem: React.FC<{ video: Video, isActive: boolean }> = ({ video, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { awardPoints } = useGamification();
  const [hasAwarded, setHasAwarded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive && !hasAwarded) {
      awardPoints(10, 'Watched Learning Clip');
      setHasAwarded(true);
    }
  }, [isActive, hasAwarded, awardPoints]);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to profile or channel page
    // Assuming we have a route or just showing an alert for now as requested "make functional"
    // Ideally: navigate(`/channel/${video.author}`);
    alert(`Navigating to ${video.author}'s profile!`);
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center overflow-hidden snap-start">
      {/* Video Layer - Strictly non-interactive */}
      <div className="absolute inset-0 pointer-events-none">
        <ReactPlayer
          url={video.url}
          playing={isActive}
          loop={true}
          muted={false}
          width="100%"
          height="100%"
          playsinline
          controls={false}
          config={{
            file: {
              attributes: {
                style: { objectFit: 'cover', width: '100%', height: '100%', pointerEvents: 'none' },
                disablePictureInPicture: true,
                controlsList: 'nodownload noplaybackrate',
              }
            }
          }}
        />
      </div>

      {/* Right Side Actions - z-20 to sit above interaction layer */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={handleProfileClick}>
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-slate-200">
            <img 
              src={video.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.author}`} 
              alt="avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="bg-fun-pink text-white rounded-full p-0.5 -mt-3">
             <Star size={12} fill="currentColor" />
          </div>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked ? 'bg-fun-pink text-white scale-110' : 'bg-black/20 text-white'}`}>
            <Heart size={28} fill={isLiked ? "currentColor" : "none"} />
          </div>
          <span className="text-white text-xs font-bold shadow-sm">{video.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white">
            <MessageCircle size={28} />
          </div>
          <span className="text-white text-xs font-bold shadow-sm">{video.comments}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white">
            <Share2 size={28} />
          </div>
          <span className="text-white text-xs font-bold shadow-sm">Share</span>
        </button>
      </div>


      {/* Bottom Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="space-y-3 max-w-[80%]">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-black text-xl">{video.author}</h3>
            <span className="bg-[#00F798] text-black text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified</span>
          </div>
          
          <p className="text-white/90 text-sm font-medium line-clamp-2">
            {video.description}
          </p>

          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Music2 size={14} className="animate-spin-slow" />
            <div className="overflow-hidden whitespace-nowrap">
              <div className="animate-marquee inline-block">
                {video.title} • Original Sound - {video.author}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
             <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${video.color || 'bg-fun-blue'}`}>
                {video.category}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoLearning: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const dbVideos = await db.getLingavoLearnsVideos();
        if (dbVideos && dbVideos.length > 0) {
          setVideos(dbVideos);
        } else {
          setVideos(FALLBACK_VIDEOS);
        }
      } catch (error) {
        console.error("Failed to fetch videos", error);
        setVideos(FALLBACK_VIDEOS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollPos / height);
    setActiveIndex(index);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-40 p-6 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <button 
          onClick={() => navigate('/')}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex flex-col items-center">
          <img src="https://i.ibb.co/MyJNdByd/lingavolearns.png" alt="Lingavo Learns" className="h-10 mb-2" />
        </div>

        <div className="w-10 h-10 flex items-center justify-center text-white/60">
           <Sparkles size={24} />
        </div>
      </div>

      {/* Video Feed Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative"
      >
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-white gap-4">
            <Loader2 size={48} className="animate-spin text-[#00F798]" />
            <p className="font-black animate-pulse">Loading Lingavo Learns...</p>
          </div>
        ) : (
          videos.map((video, index) => (
            <VideoItem 
              key={video.id} 
              video={video} 
              isActive={activeIndex === index} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default VideoLearning;
