import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Plus, ArrowLeft, Send, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type ForumCategory = "crop_issues" | "farming_tips" | "marketplace" | "weather" | "general";

interface ForumPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: ForumCategory;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string | null } | null;
  reply_count?: number;
}

interface ForumReply {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}

const CATEGORIES: { value: ForumCategory; label: string; color: string }[] = [
  { value: "crop_issues", label: "🌱 Crop Issues", color: "bg-destructive/10 text-destructive" },
  { value: "farming_tips", label: "💡 Farming Tips", color: "bg-primary/10 text-primary" },
  { value: "marketplace", label: "🛒 Marketplace", color: "bg-chart-4/20 text-chart-4" },
  { value: "weather", label: "🌤 Weather", color: "bg-chart-2/20 text-chart-2" },
  { value: "general", label: "💬 General", color: "bg-muted text-muted-foreground" },
];

const CommunityForumPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useActivityTracker("community_forum");

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ForumCategory | "all">("all");
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  // New post form
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<ForumCategory>("general");
  const [creating, setCreating] = useState(false);

  // Reply form
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchPosts();

    const channel = supabase
      .channel("forum-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "forum_posts" }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const fetchPosts = async () => {
    // Fetch posts - we'll get profile names separately
    const { data: postsData, error } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load posts");
      setLoading(false);
      return;
    }

    // Get reply counts
    const { data: repliesData } = await supabase
      .from("forum_replies")
      .select("post_id");

    const replyCounts: Record<string, number> = {};
    (repliesData || []).forEach((r: any) => {
      replyCounts[r.post_id] = (replyCounts[r.post_id] || 0) + 1;
    });

    // Get unique user IDs and fetch profiles
    const userIds = [...new Set((postsData || []).map((p: any) => p.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const profileMap: Record<string, string | null> = {};
    (profilesData || []).forEach((p: any) => {
      profileMap[p.user_id] = p.full_name;
    });

    const enrichedPosts = (postsData || []).map((p: any) => ({
      ...p,
      profiles: { full_name: profileMap[p.user_id] || null },
      reply_count: replyCounts[p.id] || 0,
    }));

    setPosts(enrichedPosts);
    setLoading(false);
  };

  const fetchReplies = async (postId: string) => {
    setRepliesLoading(true);
    const { data: repliesData, error } = await supabase
      .from("forum_replies")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load replies");
      setRepliesLoading(false);
      return;
    }

    // Fetch profiles for replies
    const userIds = [...new Set((repliesData || []).map((r: any) => r.user_id))];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds.length > 0 ? userIds : ["none"]);

    const profileMap: Record<string, string | null> = {};
    (profilesData || []).forEach((p: any) => {
      profileMap[p.user_id] = p.full_name;
    });

    const enrichedReplies = (repliesData || []).map((r: any) => ({
      ...r,
      profiles: { full_name: profileMap[r.user_id] || null },
    }));

    setReplies(enrichedReplies);
    setRepliesLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in title and content");
      return;
    }
    setCreating(true);
    const { error } = await supabase.from("forum_posts").insert({
      user_id: user!.id,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
    });
    if (error) {
      toast.error("Failed to create post");
    } else {
      toast.success("Post created!");
      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setCreateOpen(false);
      fetchPosts();
    }
    setCreating(false);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || !selectedPost) return;
    setReplying(true);
    const { error } = await supabase.from("forum_replies").insert({
      post_id: selectedPost.id,
      user_id: user!.id,
      content: replyContent.trim(),
    });
    if (error) {
      toast.error("Failed to post reply");
    } else {
      setReplyContent("");
      fetchReplies(selectedPost.id);
      fetchPosts();
    }
    setReplying(false);
  };

  const openPost = (post: ForumPost) => {
    setSelectedPost(post);
    fetchReplies(post.id);
  };

  const filteredPosts = selectedCategory === "all"
    ? posts
    : posts.filter((p) => p.category === selectedCategory);

  const getCategoryInfo = (cat: ForumCategory) =>
    CATEGORIES.find((c) => c.value === cat) || CATEGORIES[4];

  if (selectedPost) {
    const catInfo = getCategoryInfo(selectedPost.category);
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-3xl">
          <Button variant="ghost" size="sm" onClick={() => setSelectedPost(null)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Forum
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className={catInfo.color}>{catInfo.label}</Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedPost.created_at).toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="text-xl">{selectedPost.title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                by {selectedPost.profiles?.full_name || "Anonymous Farmer"}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-foreground whitespace-pre-wrap">{selectedPost.content}</p>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Replies ({replies.length})
            </h3>

            {repliesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : replies.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No replies yet. Be the first!</p>
            ) : (
              replies.map((r) => (
                <Card key={r.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {r.profiles?.full_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{r.content}</p>
                  </CardContent>
                </Card>
              ))
            )}

            {/* Reply form */}
            <div className="flex gap-2 mt-4">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button onClick={handleReply} disabled={replying || !replyContent.trim()} size="sm" className="self-end">
                {replying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Community Forum</h1>
            <p className="text-sm text-muted-foreground">Discuss crop issues, share tips, and connect with fellow farmers</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Post</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <Input placeholder="Post title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} maxLength={200} />
                <Select value={newCategory} onValueChange={(v) => setNewCategory(v as ForumCategory)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea placeholder="What's on your mind?" value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={5} maxLength={5000} />
                <Button onClick={handleCreatePost} disabled={creating} className="w-full">
                  {creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedCategory === "all" ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Badge>
          {CATEGORIES.map((c) => (
            <Badge
              key={c.value}
              variant={selectedCategory === c.value ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(c.value)}
            >
              {c.label}
            </Badge>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No posts yet. Start the conversation!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => {
              const catInfo = getCategoryInfo(post.category);
              return (
                <Card
                  key={post.id}
                  className="cursor-pointer hover:border-primary/30 transition-colors"
                  onClick={() => openPost(post)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={`text-xs ${catInfo.color}`}>
                            {catInfo.label}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-foreground truncate">{post.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span>{post.profiles?.full_name || "Anonymous"}</span>
                          <span>·</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" /> {post.reply_count || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityForumPage;
