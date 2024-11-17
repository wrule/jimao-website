import type { MetaFunction } from "@remix-run/cloudflare";
import { useState, useMemo } from "react";

const generateArticles = () => {
  const longContent = Array(20).fill(
    "Web3 represents the next evolution of the internet, promising a more decentralized and user-centric digital world. " +
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. "
  ).join("");

  return Array(100).fill(null).map((_, index) => ({
    id: index + 1,
    title: `Article ${index + 1}: ${[
      "The Future of Web3",
      "Exploring Ethereum 2.0",
      "Decentralized Identity",
      "NFT Markets Analysis",
      "DeFi Innovations"
    ][index % 5]}`,
    date: new Date(2024, 0, 1 + index).toISOString().split('T')[0],
    content: longContent
  }));
};

const articles = generateArticles();

export const meta: MetaFunction = () => {
  return [
    { title: "36000.eth" },
    { name: "description", content: "Welcome to my website" },
  ];
};

export default function Index() {
  const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.content.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="text-white min-h-screen will-change-transform">
      <div className="max-w-screen-xl mx-auto p-8 flex gap-8 h-screen">
        {/* 左侧面板 */}
        <div className="w-80 flex-shrink-0 flex flex-col will-change-transform">
          {/* 搜索框 */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 
                  px-4 py-2 text-white placeholder-white/50 outline-none
                  focus:border-white/40 transition-colors duration-300"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* 文章列表 */}
          <h2 className="text-2xl font-light mb-8 border-b border-white/20 pb-4">
            Articles
          </h2>
          <div 
            className="space-y-2 overflow-y-auto flex-grow [&::-webkit-scrollbar]:hidden 
              [-ms-overflow-style:none] [scrollbar-width:none] transform-gpu"
          >
            {filteredArticles.map((article) => (
              <article 
                key={article.id}
                className="cursor-pointer py-2 transform-gpu will-change-transform"
                onClick={() => setSelectedArticle(article)}
              >
                <div 
                  className={`px-4 transform-gpu ${
                    selectedArticle?.id === article.id 
                      ? 'text-white border-b border-white pb-2' 
                      : 'text-white/70 hover:text-white/90 border-b border-transparent pb-2'
                  }`}
                  style={{
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                  }}
                >
                  <h3 className="text-lg mb-1">{article.title}</h3>
                  <time className={`text-sm ${
                    selectedArticle?.id === article.id 
                      ? 'opacity-80' 
                      : 'opacity-50'
                  }`}>{article.date}</time>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 文章内容 */}
        <div className="flex-grow flex transform-gpu will-change-transform">
          {selectedArticle ? (
            <div className="w-full h-full relative">
              <div 
                className="absolute inset-0 backdrop-blur-md bg-white/5 rounded-xl 
                  overflow-hidden transform-gpu"
                style={{
                  transform: 'translate3d(0,0,0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div 
                  className="h-full overflow-y-auto p-8 [&::-webkit-scrollbar]:hidden 
                    [-ms-overflow-style:none] [scrollbar-width:none] transform-gpu"
                >
                  <h1 className="text-3xl font-light mb-4">{selectedArticle.title}</h1>
                  <time className="text-sm opacity-50 block mb-8">{selectedArticle.date}</time>
                  <div className="leading-relaxed opacity-90 whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-white/50 text-lg">
                Select an article to start reading
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
