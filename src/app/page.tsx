import Editor from "~/components/editor";
import NotesList from "~/components/notes-list";

export default function HomePage() {
  return (
    <main className="relative flex h-screen w-screen items-center justify-center bg-stone-100">
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-10">
        <NotesList />
      </div>
      <div className="flex flex-col items-center justify-center gap-8 w-full px-8">
        <h1 className="text-4xl font-bold text-stone-800">Life OS / notes</h1>
        <Editor />
      </div>
    </main>
  );
}
