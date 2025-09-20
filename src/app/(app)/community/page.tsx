import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, ThumbsUp, UserCircle } from 'lucide-react';

const forumPosts = [
  {
    id: 1,
    author: 'Rajesh Kumar',
    topic: 'Gehu ki fasal mein pest control ke liye best practices kya hain?',
    repliesCount: 5,
    likes: 12,
    replies: [
      { author: 'Sunita Devi', text: 'Neem oil ka spray try kijiye, bahut effective hai.' },
      { author: 'Amit Singh', text: 'Haan, aur saath mein pheromone traps bhi laga sakte hain.' }
    ]
  },
  {
    id: 2,
    author: 'Anita Desai',
    topic: 'AgriCo ka naya organic fertilizer try kiya hai kisi ne? Kaisa result hai?',
    repliesCount: 8,
    likes: 25,
    replies: [
      { author: 'Ravi Verma', text: 'Maine pichle season use kiya tha, result accha tha. Yield badh gayi thi.' },
    ]
  },
   {
    id: 3,
    author: 'Vikram Singh',
    topic: 'Dry season mein irrigation manage karne ke kuch tips dijiye.',
    repliesCount: 12,
    likes: 40,
    replies: [
        { author: 'Priya Sharma', text: 'Drip irrigation system best hai. Paani ki bachat hoti hai.' },
        { author: 'Manoj Patel', text: 'Subah ya shaam ko paani dena chahiye to avoid evaporation.' },
    ]
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
                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <UserCircle className="h-8 w-8 mt-1" />
                        <div>
                            <CardTitle className="text-lg">{post.topic}</CardTitle>
                            <p className="text-sm text-muted-foreground">by {post.author}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Separator />
                    <div className="text-sm text-muted-foreground space-y-3 pl-4 border-l-2">
                        {post.replies.map((reply, index) => (
                             <div key={index} className="flex items-start gap-2">
                                <UserCircle className="h-5 w-5 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-foreground">{reply.author}</span>
                                    <p>{reply.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-6 text-sm text-muted-foreground pt-4">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.repliesCount} Replies</span>
                    </div>
                </CardFooter>
            </Card>
            ))}
        </div>
      </div>
    </main>
  );
}
