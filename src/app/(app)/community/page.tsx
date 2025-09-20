import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageSquare, ThumbsUp, UserCircle } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    author: 'Rajesh Kumar',
    topic: 'Best practices for pest control in wheat crops?',
    replies: 5,
    likes: 12,
  },
  {
    id: 2,
    author: 'Anita Desai',
    topic: 'Has anyone tried the new organic fertilizer from AgriCo?',
    replies: 8,
    likes: 25,
  },
   {
    id: 3,
    author: 'Vikram Singh',
    topic: 'Tips for managing irrigation during the dry season.',
    replies: 12,
    likes: 40,
  },
];

export default function CommunityPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Community Forum
        </h1>
        <p className="text-muted-foreground">
          Connect with other farmers, ask questions, and share your knowledge.
        </p>
      </div>
       <div className="space-y-6">
        <div className="flex w-full max-w-lg items-center space-x-2">
            <Input type="text" placeholder="Start a new discussion..." />
            <Button type="submit">Post</Button>
        </div>

        <div className="space-y-4">
            {forumPosts.map((post) => (
            <Card key={post.id}>
                <CardHeader>
                    <CardTitle className="text-lg">{post.topic}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <UserCircle className="h-5 w-5" />
                        <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-4">
                         <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies} Replies</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            ))}
        </div>
      </div>
    </main>
  );
}
