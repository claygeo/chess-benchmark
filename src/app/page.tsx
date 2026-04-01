import { project } from '@/app/project';
import { ExerciseList } from '@/components/ExerciseList';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center bg-chess-bg px-5 py-10">
      <main className="flex w-full max-w-[1200px] flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="mb-4 text-[60px] font-bold text-white">
            {project.title}
          </h1>
        </div>

        <div className="text-center">
          <h2 className="text-[28px] font-normal text-white">
            {project.description}
          </h2>
        </div>

        <div className="mt-5">
          <ExerciseList />
        </div>
      </main>
    </div>
  );
}
