import { useState, useRef } from 'react';
import { Heart, X } from 'lucide-react';

interface AnimeCharacter {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
  interests: string[];
}

interface SwipeCardProps {
  character: AnimeCharacter;
  onSwipe: (direction: 'left' | 'right', character: AnimeCharacter) => void;
  isTop?: boolean;
}

export const SwipeCard = ({ character, onSwipe, isTop = false }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTop) return;
    setIsDragging(true);
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTop) return;
    const offset = e.clientX - startX.current;
    setDragOffset(offset);
  };

  const handleMouseUp = () => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset) > 100) {
      setIsAnimating(true);
      onSwipe(dragOffset > 0 ? 'right' : 'left', character);
    } else {
      setDragOffset(0);
    }
  };

  const handleButtonClick = (direction: 'left' | 'right') => {
    if (!isTop) return;
    setIsAnimating(true);
    onSwipe(direction, character);
  };

  const rotation = dragOffset * 0.1;
  const opacity = Math.max(0.3, 1 - Math.abs(dragOffset) / 300);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing ${
        isAnimating 
          ? dragOffset > 0 || (dragOffset === 0 && Math.random() > 0.5)
            ? 'animate-swipe-right' 
            : 'animate-swipe-left'
          : 'animate-card-enter'
      }`}
      style={{
        transform: `translateX(${isDragging ? dragOffset : 0}px) rotate(${isDragging ? rotation : 0}deg)`,
        opacity: isDragging ? opacity : 1,
        zIndex: isTop ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="bg-gradient-card backdrop-blur-sm border border-border/50 rounded-3xl overflow-hidden shadow-card h-full max-w-sm mx-auto">
        <div className="relative h-3/5">
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Swipe indicators */}
          {isDragging && (
            <>
              <div 
                className={`absolute top-8 left-8 px-4 py-2 rounded-full border-2 font-bold transition-opacity ${
                  dragOffset > 50 
                    ? 'bg-success/20 border-success text-success opacity-100' 
                    : 'bg-success/10 border-success/50 text-success/70 opacity-50'
                }`}
              >
                LIKE
              </div>
              <div 
                className={`absolute top-8 right-8 px-4 py-2 rounded-full border-2 font-bold transition-opacity ${
                  dragOffset < -50 
                    ? 'bg-destructive/20 border-destructive text-destructive opacity-100' 
                    : 'bg-destructive/10 border-destructive/50 text-destructive/70 opacity-50'
                }`}
              >
                NOPE
              </div>
            </>
          )}
        </div>

        <div className="p-6 h-2/5 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {character.name}, {character.age}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {character.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {character.interests.slice(0, 3).map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {isTop && (
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={() => handleButtonClick('left')}
                className="w-14 h-14 rounded-full bg-gradient-dislike hover:shadow-button transition-all duration-200 flex items-center justify-center group hover:scale-110"
              >
                <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={() => handleButtonClick('right')}
                className="w-14 h-14 rounded-full bg-gradient-like hover:shadow-button transition-all duration-200 flex items-center justify-center group hover:scale-110"
              >
                <Heart className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};