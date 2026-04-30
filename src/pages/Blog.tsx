import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Tag, ChevronRight, ArrowLeft, BookOpen, Search, X, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Blog = ({ t }: { t: any }) => {
  const [selectedPost, setSelectedPost] = useState<string | number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const staticPosts = t.blog.posts;
  const allPosts = staticPosts;

  const categories = Object.keys(t.blog.categories).map(key => ({
    id: key,
    label: t.blog.categories[key]
  }));

  const filteredPosts = allPosts.filter((p: any) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.content || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const currentPost = selectedPost !== null ? allPosts.find((p: any) => p.id === selectedPost) : null;

  if (currentPost) {
    return (
      <div className="pt-24 min-h-screen bg-soft-gray ring-opacity-0">
        <div className="max-w-4xl mx-auto px-8 py-20 pb-40">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedPost(null)}
            className="flex items-center gap-2 text-primary hover:text-dark-blue transition-colors mb-12 font-bold uppercase tracking-wider text-xs"
          >
            <ArrowLeft size={16} />
            {t.aboutPage.back}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {t.blog.categories[currentPost.category as keyof typeof t.blog.categories]}
              </span>
              <span className="text-gray/50 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5">
                <Calendar size={12} strokeWidth={3} />
                {currentPost.date}
              </span>
            </div>

            <h1 className="text-ink mb-10 leading-[1.1]">
              {currentPost.title}
            </h1>

            {currentPost.imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl"
              >
                <img 
                  src={currentPost.imageUrl} 
                  alt={currentPost.title} 
                  className="w-full h-auto object-cover max-h-[500px]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            <div className="prose prose-lg prose-ink max-w-none">
              <div className="text-gray text-lg leading-relaxed space-y-6 blog-content-rich">
                {currentPost.content.includes('<') ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: currentPost.content }} 
                    className="article-body-html"
                  />
                ) : (
                  currentPost.content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx}>{paragraph}</p>
                  ))
                )}
              </div>
            </div>

            {currentPost.originalLink && (
              <div className="mt-20 pt-10 border-t border-ink/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray/40 mb-4">Source Originale</p>
                <a 
                  href={currentPost.originalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-soft-gray rounded-xl text-primary font-bold hover:bg-primary hover:text-white transition-all duration-300"
                >
                  {currentPost.originalLink}
                  <ChevronRight size={14} />
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-soft-gray ring-opacity-0">
      {/* Header */}
      <section className="py-20 bg-white border-b border-ink/5">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-px bg-primary/30" />
              <span className="label-caps">Blog & Actualités</span>
            </div>
            <h1 className="text-ink mb-6">
              {t.blog.title} <br />
              <span className="text-secondary italic font-normal">{t.blog.titleItalic}</span>
            </h1>
            <p className="text-lg text-gray max-w-2xl">
              {t.blog.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 pb-40">
        <div className="max-w-7xl mx-auto px-8">
          {/* Search and Categories Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white text-gray/60 border border-ink/5 hover:bg-soft-gray'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray/40" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.blog.searchPlaceholder}
                className="w-full pl-12 pr-12 py-3 bg-white rounded-full border border-ink/5 focus:border-primary/20 outline-none transition-all text-sm placeholder:text-gray/30 shadow-sm"
              />
              <AnimatePresence>
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-soft-gray flex items-center justify-center text-gray/40 hover:text-primary transition-colors"
                  >
                    <X size={14} />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post: any, idx: number) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedPost(post.id)}
                className="group bg-white rounded-[2rem] border border-ink/5 overflow-hidden hover:shadow-2xl hover:shadow-ink/5 transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                {post.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                      {t.blog.categories[post.category as keyof typeof t.blog.categories]}
                    </span>
                    <span className="text-gray/40 text-[9px] uppercase font-bold tracking-wider flex items-center gap-1">
                      <Calendar size={12} strokeWidth={3} />
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-ink mb-4 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>

                  {post.source && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      <span className="text-[10px] font-bold text-gray/60 uppercase tracking-widest">{post.source}</span>
                    </div>
                  )}

                  <p className="text-sm text-gray/70 mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-ink/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      {t.blog.readMore}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <BookOpen size={16} className="text-gray/20 group-hover:text-primary/40 transition-colors" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-ink/10">
              <p className="text-gray/50 font-serif italic">Aucun article trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
