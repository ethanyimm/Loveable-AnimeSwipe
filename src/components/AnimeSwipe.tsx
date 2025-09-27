import { useState, useEffect } from 'react';
import { SwipeCard } from './SwipeCard';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Import anime character images
import animeChar1 from '@/assets/anime-char-1.jpg';
import animeChar2 from '@/assets/anime-char-2.jpg';
import animeChar3 from '@/assets/anime-char-3.jpg';
import animeChar4 from '@/assets/anime-char-4.jpg';
import animeChar5 from '@/assets/anime-char-5.jpg';

interface AnimeCharacter {
  id: number;
  name: string;
  age: number;
  image: string;
  bio: string;
  interests: string[];
}

const initialCharacters: AnimeCharacter[] = [
  {
    id: 1,
    name: "Sakura",
    age: 18,
    image: animeChar1,
    bio: "A magical school student who loves stargazing and casting spells under the moonlight.",
    interests: ["Magic", "Astronomy", "Cute Things", "Books"]
  },
  {
    id: 2,
    name: "Ryuu",
    age: 19,
    image: animeChar2,
    bio: "A mysterious loner with a heart of gold. Enjoys quiet moments and deep conversations.",
    interests: ["Reading", "Music", "Philosophy", "Night Walks"]
  },
  {
    id: 3,
    name: "Hana",
    age: 17,
    image: animeChar3,
    bio: "Cheerful and energetic! Always ready for an adventure and making new friends.",
    interests: ["Sports", "Festivals", "Cooking", "Dancing"]
  },
  {
    id: 4,
    name: "Akira",
    age: 20,
    image: animeChar4,
    bio: "A fierce warrior with unmatched determination. Trains every day to protect those she loves.",
    interests: ["Martial Arts", "Honor", "Training", "Justice"]
  },
  {
    id: 5,
    name: "Neko",
    age: 19,
    image: animeChar5,
    bio: "A playful cat-girl who brings joy wherever she goes. Loves cozy places and sweet treats.",
    interests: ["Naps", "Sweets", "Games", "Cuddles"]
  }
];

export const AnimeSwipe = () => {
  const [characters, setCharacters] = useState(initialCharacters);
  const [likedCharacters, setLikedCharacters] = useState<AnimeCharacter[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  const handleSwipe = (direction: 'left' | 'right', character: AnimeCharacter) => {
    if (direction === 'right') {
      setLikedCharacters(prev => [...prev, character]);
      toast({
        title: "💖 You liked " + character.name,
        description: "Great choice! " + character.name + " has been added to your favorites.",
      });
    } else {
      toast({
        title: "👋 You passed on " + character.name,
        description: "No worries, there are more amazing characters to discover!",
      });
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
    }, 600);
  };

  const resetCards = () => {
    setCharacters(initialCharacters);
    setCurrentIndex(0);
    setLikedCharacters([]);
    toast({
      title: "🔄 Cards Reset",
      description: "Ready to swipe again!",
    });
  };

  const currentCharacter = characters[currentIndex];
  const nextCharacter = characters[currentIndex + 1];
  const hasMoreCards = currentIndex < characters.length;

  return (
    <div className="min-h-screen bg-gradient-anime flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Anime Match
          </h1>
          <Sparkles className="w-8 h-8 text-secondary animate-pulse-glow" />
        </div>
        <p className="text-muted-foreground">
          Swipe right to like, left to pass • {likedCharacters.length} favorites
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        {hasMoreCards ? (
          <div className="relative w-full max-w-sm h-[600px]">
            {/* Next card (background) */}
            {nextCharacter && (
              <SwipeCard
                key={nextCharacter.id}
                character={nextCharacter}
                onSwipe={handleSwipe}
                isTop={false}
              />
            )}
            
            {/* Current card (top) */}
            {currentCharacter && (
              <SwipeCard
                key={currentCharacter.id}
                character={currentCharacter}
                onSwipe={handleSwipe}
                isTop={true}
              />
            )}
          </div>
        ) : (
          /* End screen */
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8 animate-float">
              <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                All Done! ✨
              </h2>
              <p className="text-muted-foreground mb-6">
                You've seen all the characters. You liked {likedCharacters.length} out of {characters.length}!
              </p>
            </div>

            {likedCharacters.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-foreground mb-4">Your Favorites:</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {likedCharacters.map((char, index) => (
                    <div
                      key={char.id}
                      className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm animate-card-enter"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{char.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={resetCards}
              size="lg"
              className="bg-gradient-like hover:shadow-button transition-all duration-200 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {hasMoreCards && (
        <footer className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tip:</strong> Drag cards left or right, or use the buttons below
          </p>
        </footer>
      )}
    </div>
  );
};