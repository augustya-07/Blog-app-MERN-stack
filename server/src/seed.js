import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Post } from './models/Post.js';

dotenv.config();

const password = 'Password123!';

const posts = [
  {
    title: 'Designing a Writing Ritual That Actually Sticks',
    slug: 'designing-a-writing-ritual-that-actually-sticks',
    excerpt: 'A practical approach to building a calm, repeatable routine around ideas, drafts, and publishing.',
    category: 'Writing',
    tags: ['craft', 'habits', 'productivity'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1400&q=80',
    content: 'The best writing ritual is not dramatic. It is small enough to repeat and clear enough to begin even on busy days.\n\nStart by choosing one fixed cue, one realistic writing block, and one ending ritual. Keep your tools boring, your scope narrow, and your attention protected.'
  },
  {
    title: 'How Product Teams Can Tell Better Stories',
    slug: 'how-product-teams-can-tell-better-stories',
    excerpt: 'Storytelling is not decoration. It is how teams align around user problems and make better tradeoffs.',
    category: 'Product',
    tags: ['teams', 'strategy', 'research'],
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80',
    content: 'Good product stories connect the user, the constraint, and the change you want to create.\n\nWhen a team can explain the why in plain language, prioritization gets easier and the work feels less abstract.'
  },
  {
    title: 'A Gentle Guide to Better Technical Notes',
    slug: 'a-gentle-guide-to-better-technical-notes',
    excerpt: 'Capture decisions, examples, and gotchas in a way your future self can use without archaeology.',
    category: 'Engineering',
    tags: ['documentation', 'learning', 'systems'],
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=80',
    content: 'Technical notes become valuable when they preserve context, not just commands.\n\nWrite down what changed, why it changed, what failed, and the smallest working example. Those four pieces save hours later.'
  }
];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Post.deleteMany({})]);

  const [admin, author, reader] = await User.create([
    {
      name: 'Admin Editor',
      email: 'admin@inkspire.dev',
      password,
      role: 'admin',
      bio: 'Keeps the publication tidy and thoughtful.'
    },
    {
      name: 'Aarav Mehta',
      email: 'author@inkspire.dev',
      password,
      role: 'author',
      bio: 'Writes about craft, software, and practical creativity.'
    },
    {
      name: 'Reader One',
      email: 'reader@inkspire.dev',
      password,
      role: 'user',
      bio: 'Curious reader and generous commenter.'
    }
  ]);

  await Post.create(
    posts.map((post, index) => ({
      ...post,
      author: index === 1 ? admin._id : author._id,
      likes: [reader._id],
      comments: [
        {
          body: 'This was genuinely useful. Saved for later.',
          author: reader._id
        }
      ]
    }))
  );

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
