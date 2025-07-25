import Editor from "~/components/editor";

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-stone-100">
      <div className="flex flex-col items-center justify-center gap-8 w-full px-8">
        <h1 className="text-4xl font-bold text-stone-800">Life OS / notes</h1>
        <Editor />
      </div>
    </main>
  );
}
