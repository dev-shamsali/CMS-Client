import PostForm from "@/components/post/PostForm";

export const metadata = {
  title: "Create Post | CMS",
  description: "Create a new post",
};

export default function CreatePostPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      <PostForm />
    </div>
  );
}
