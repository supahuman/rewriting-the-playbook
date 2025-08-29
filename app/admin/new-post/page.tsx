import NewPostForm from '@/components/admin/NewPostForm';

export default function NewPostPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Create a new post</h1>
      <NewPostForm />
    </div>
  );
}
