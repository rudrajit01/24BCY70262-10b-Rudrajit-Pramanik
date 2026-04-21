import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export interface PostWithAuthor {
  _id: string;
  userId: string;
  title: string;
  description: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get all posts with pagination
 */
export async function paginatePosts(
  page: number = 1,
  limit: number = 10
): Promise<{
  posts: PostWithAuthor[];
  total: number;
  pages: number;
}> {
  await connectDB();

  const skip = (page - 1) * limit;
  const posts = await Post.find().skip(skip).limit(limit).sort({ createdAt: -1 });
  const total = await Post.countDocuments();

  // Fetch user details and map to author names
  const postsWithAuthors = await Promise.all(
    posts.map(async (post: any) => {
      const user = await User.findById(post.userId);
      return {
        _id: post._id.toString(),
        userId: post.userId,
        title: post.title,
        description: post.description,
        authorName: user?.name || "Unknown",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    })
  );

  return {
    posts: postsWithAuthors,
    total,
    pages: Math.ceil(total / limit),
  };
}

/**
 * Get posts excluding a specific userId
 */
export async function getAllPostsExcluding(
  excludeUserId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  posts: PostWithAuthor[];
  total: number;
  pages: number;
}> {
  await connectDB();

  const skip = (page - 1) * limit;
  const posts = await Post.find({ userId: { $ne: excludeUserId } })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Post.countDocuments({ userId: { $ne: excludeUserId } });

  // Fetch user details and map to author names
  const postsWithAuthors = await Promise.all(
    posts.map(async (post: any) => {
      const user = await User.findById(post.userId);
      return {
        _id: post._id.toString(),
        userId: post.userId,
        title: post.title,
        description: post.description,
        authorName: user?.name || "Unknown",
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    })
  );

  return {
    posts: postsWithAuthors,
    total,
    pages: Math.ceil(total / limit),
  };
}

/**
 * Get user's own posts
 */
export async function getUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  posts: PostWithAuthor[];
  total: number;
  pages: number;
}> {
  await connectDB();

  const skip = (page - 1) * limit;
  const posts = await Post.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  const total = await Post.countDocuments({ userId });

  const user = await User.findById(userId);

  const postsWithAuthors = posts.map((post: any) => ({
    _id: post._id.toString(),
    userId: post.userId,
    title: post.title,
    description: post.description,
    authorName: user?.name || "Unknown",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return {
    posts: postsWithAuthors,
    total,
    pages: Math.ceil(total / limit),
  };
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<PostWithAuthor | null> {
  await connectDB();

  const post = await Post.findById(postId);
  if (!post) return null;

  const user = await User.findById(post.userId);

  return {
    _id: post._id.toString(),
    userId: post.userId,
    title: post.title,
    description: post.description,
    authorName: user?.name || "Unknown",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

/**
 * Create a new post
 */
export async function createPost(
  userId: string,
  title: string,
  description: string
): Promise<PostWithAuthor> {
  await connectDB();

  const post = new Post({
    userId,
    title,
    description,
  });

  await post.save();

  const user = await User.findById(userId);

  return {
    _id: post._id.toString(),
    userId: post.userId,
    title: post.title,
    description: post.description,
    authorName: user?.name || "Unknown",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

/**
 * Update a post
 */
export async function updatePost(
  postId: string,
  title?: string,
  description?: string
): Promise<PostWithAuthor | null> {
  await connectDB();

  const post = await Post.findByIdAndUpdate(
    postId,
    { title, description },
    { new: true }
  );

  if (!post) return null;

  const user = await User.findById(post.userId);

  return {
    _id: post._id.toString(),
    userId: post.userId,
    title: post.title,
    description: post.description,
    authorName: user?.name || "Unknown",
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<boolean> {
  await connectDB();

  const result = await Post.findByIdAndDelete(postId);
  return result !== null;
}
