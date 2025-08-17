import { project } from '@/app/project';
import { ExerciseList } from '@/components/ExerciseList';

export default function Home() {
  return (
    <div 
      style={{ 
        backgroundColor: '#1a1a1a',
        minHeight: 'calc(100vh - 60px)', // Account for header height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '60px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            {project.title}
          </h1>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '28px',
            color: '#ffffff',
            fontWeight: 'normal'
          }}>
            {project.description}
          </h2>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <ExerciseList />
        </div>
      </main>
    </div>
  );
}