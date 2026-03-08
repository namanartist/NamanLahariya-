import Section from './Section';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSoundEffects from '../hooks/useSoundEffects';

export const blogPosts = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    excerpt: 'Exploring how artificial intelligence is reshaping the way we build and interact with websites.',
    date: 'March 15, 2026',
    author: 'Naman Lahariya',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    content: `
      Artificial Intelligence is rapidly transforming the landscape of web development. From automated code generation to intelligent user interfaces, AI is enabling developers to build faster, smarter, and more personalized web experiences.

      ## The Rise of AI-Powered Tools
      Tools like GitHub Copilot and ChatGPT are already assisting developers in writing code, debugging, and optimizing performance. These tools are not replacing developers but empowering them to focus on higher-level problem-solving.

      ## Personalized User Experiences
      AI algorithms can analyze user behavior in real-time to deliver personalized content and recommendations. This level of customization was previously difficult to achieve but is now becoming a standard expectation.

      ## Conclusion
      As AI continues to evolve, it will undoubtedly play an even more significant role in web development. Embracing these technologies is crucial for staying ahead in the industry.
    `
  },
  {
    id: '2',
    title: 'Optimizing React Applications for Performance',
    excerpt: 'Key strategies and best practices for building high-performance React applications.',
    date: 'February 28, 2026',
    author: 'Naman Lahariya',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    content: `
      Performance is a critical factor in the success of any web application. In the React ecosystem, there are several strategies developers can employ to ensure their apps run smoothly.

      ## Code Splitting
      Code splitting allows you to split your code into small chunks which you can then load on demand. This significantly reduces the initial load time of your application.

      ## Memoization
      Using hooks like useMemo and useCallback can prevent unnecessary re-renders, which is a common source of performance bottlenecks in React apps.

      ## Virtualization
      For applications that render long lists of data, virtualization can be a game-changer. Libraries like react-window only render the items that are currently visible on the screen.
    `
  },
  {
    id: '3',
    title: 'Understanding Mathematical Modeling in Tech',
    excerpt: 'How mathematical concepts are applied to solve complex problems in software engineering.',
    date: 'January 10, 2026',
    author: 'Naman Lahariya',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1000&auto=format&fit=crop',
    content: `
      Mathematical modeling is the process of using mathematical structures to represent real-world situations. In the tech industry, this is used for everything from algorithm design to system optimization.

      ## Algorithms and Complexity
      Understanding Big O notation and algorithmic complexity is fundamental to writing efficient code. It allows developers to predict how their code will perform as data sets grow.

      ## Data Science and Machine Learning
      At the heart of data science and machine learning lies linear algebra, calculus, and probability. These mathematical foundations enable computers to learn from data and make predictions.
    `
  }
];

export default function BlogSection() {
  const { playHover, playClick } = useSoundEffects();

  return (
    <Section id="blog">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mb-2">
            Latest <span className="text-accent italic">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-md">
            Thoughts, tutorials, and insights on technology, mathematics, and design.
          </p>
        </div>
        <Link 
          to="/blog" 
          className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          View all posts <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id}
            className="group flex flex-col bg-[#121212] border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300"
            onMouseEnter={playHover}
          >
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <User size={12} />
                  {post.author}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                {post.title}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
              
              <Link 
                to={`/blog/${post.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-white transition-colors mt-auto"
                onMouseEnter={playHover}
                onClick={playClick}
              >
                Read Article <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
