// import styles from '../styles/Home.module.css';
// pages/index.tsx: Home page listing game types.

// pages/index.tsx
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export const HomePage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1>Chess Memorization Game</h1>
      <button onClick={() => router.push('/memorization')}>Opening Memorization Game</button>
      {/* Add more game types here */}
    </div>
  );
};

// // src/pages/home.tsx
// import { GetStaticProps } from 'next';
// import Head from 'next/head';
// import Home from '@/components/Home';

// // Mocked data for demonstration
// const featuredPosts = [
//   { id: 1, title: 'Post One', content: 'Content for post one...' },
//   { id: 2, title: 'Post Two', content: 'Content for post two...' },
// ];

// type HomePageProps = {
//   featuredPosts: { id: number; title: string; content: string }[];
// };

// const HomePage: React.FC<HomePageProps> = ({ featuredPosts }) => {
//   return (
//     <>
//       {/* SEO & Head */}
//       <Head>
//         <title>Home | My Next.js App</title>
//         <meta name="description" content="This is the home page of my Next.js application" />
//       </Head>

//       {/* Home component rendering */}
//       <Home featuredPosts={featuredPosts} />
//     </>
//   );
// };

// export default HomePage;

// //////////////////////////
// // getStaticProps for data fetching
// //////////////////////////

// export const getStaticProps: GetStaticProps = async () => {
//   // You could fetch this data from an API, database, or external service
//   // For demonstration, we are using the mock data

//   return {
//     props: {
//       featuredPosts, // Pass data as props to the Home component
//     },
//     revalidate: 10, // Optional: ISR (Incremental Static Regeneration) every 10 seconds
//   };
// };
