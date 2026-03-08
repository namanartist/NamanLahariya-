import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { blogPosts } from '../components/BlogSection';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import useSoundEffects from '../hooks/useSoundEffects';

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);
  const { playHover, playClick, playAppear } = useSoundEffects();

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Post Not Found</h1>
          <Link to="/" className="text-accent hover:underline">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Naman Lahariya</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="bg-background min-h-screen text-foreground selection:bg-accent selection:text-black">
        <Navbar />
        
        <article className="pt-32 pb-20 px-4">
          <div className="max-w-3xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted hover:text-accent mb-8 transition-colors"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onAnimationStart={() => playAppear()}
            >
              <div className="aspect-video rounded-2xl overflow-hidden mb-8 border border-theme">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center gap-6 text-sm text-muted mb-6 font-mono border-b border-theme pb-6">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-accent" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} className="text-accent" />
                  {post.author}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-accent" />
                  5 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                {post.title}
              </h1>

              <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-serif prose-a:text-accent prose-img:rounded-xl">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        </article>

        <Contact />
      </div>
    </>
  );
}
