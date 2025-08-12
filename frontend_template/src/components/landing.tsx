'use client';

import {
  Brain,
  Calendar,
  ChevronDown,
  Code2,
  Cpu,
  Database,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Rocket,
  Terminal,
  Users,
} from 'lucide-react';
import React from 'react';

export const Landing = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='mesh-gradient min-h-screen'>
      {/* Previous sections remain the same */}
      <section className='relative flex min-h-screen flex-col items-center justify-center px-4'>
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900/80' />
        <div className='mx-auto max-w-3xl space-y-6 text-center'>
          <h1 className='animate-gradient bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent md:text-7xl'>
            Hi. I&apos;m Dan.
          </h1>
          <p className='text-xl leading-relaxed text-gray-200 md:text-2xl'>
            I&apos;m a software engineer with a passion for solving complex problems through elegant
            code solutions, building scalable systems, and creating impactful user experiences.
          </p>
          <div className='flex justify-center gap-4 pt-6'>
            <a href='https://github.com' className='p-2 transition-colors hover:text-blue-400'>
              <Github size={24} />
            </a>
            <a href='https://linkedin.com' className='p-2 transition-colors hover:text-blue-400'>
              <Linkedin size={24} />
            </a>
            <a
              href='mailto:contact@example.com'
              className='p-2 transition-colors hover:text-blue-400'
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
        <button
          onClick={scrollToProjects}
          className='absolute bottom-8 animate-bounce cursor-pointer transition-colors hover:text-blue-400'
          aria-label='Scroll to projects'
        >
          <ChevronDown size={32} className='text-gray-400' />
        </button>
      </section>

      {/* Projects Section */}
      <section id='projects' className='relative px-4 py-20'>
        <div className='mx-auto max-w-6xl'>
          <h2 className='mb-16 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl'>
            Featured Projects
          </h2>
          <div className='space-y-12'>
            <DetailedProjectCard
              title='Portfolio Site'
              description='A modern, responsive portfolio website showcasing my work and skills. Built with a focus on performance and user experience.'
              icon={<Globe className='size-6' />}
              tech={['Next.js', 'TypeScript', 'Firebase']}
              link='/'
            />
            <DetailedProjectCard
              title='ChessBenchmark.com'
              description='An interactive platform for chess enthusiasts to improve their skills through targeted exercises and real-time feedback.'
              icon={<Brain className='size-6' />}
              tech={['Next.js', 'TypeScript', 'Firebase']}
              link='https://chessbenchmark.com'
            />
            <DetailedProjectCard
              title='Automated Trading System'
              description='A high-performance automated trading system capable of executing complex strategies with minimal latency.'
              icon={<Cpu className='size-6' />}
              tech={['Rust', 'PostgreSQL', 'Redis']}
              link='https://github.com'
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className='relative px-4 py-20'>
        <div className='absolute inset-0 bg-gray-900/50' />
        <div className='relative mx-auto max-w-6xl'>
          <h2 className='mb-16 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-center text-3xl font-bold text-transparent md:text-4xl'>
            What I Do
          </h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <SkillCard
              icon={<Terminal />}
              title='Backend Development'
              description='Building robust and scalable server-side applications using Node.js, Python, and Go.'
            />
            <SkillCard
              icon={<Code2 />}
              title='Frontend Development'
              description='Creating responsive and intuitive user interfaces with React and modern web technologies.'
            />
            <SkillCard
              icon={<Brain />}
              title='System Architecture'
              description='Designing efficient and maintainable software architectures for complex applications.'
            />
            <SkillCard
              icon={<Rocket />}
              title='DevOps'
              description='Implementing CI/CD pipelines and managing cloud infrastructure with AWS and Docker.'
            />
          </div>
        </div>
      </section>

      {/* Miami Tech Scene Section */}
      {/* <section className='relative overflow-hidden px-4 py-20'>
        <div className='absolute inset-0 bg-gradient-to-b from-pink-500/10 to-blue-500/10' />
        <div className='relative mx-auto max-w-6xl'>
          <div className='mb-16 text-center'>
            <h2 className='bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
              Miami Women in Tech
            </h2>
            <p className='mt-4 text-xl text-gray-200'>
              Empowering the next generation of female tech leaders in Miami
            </p>
          </div>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            <MiamiTechCard
              icon={<Users />}
              title='Mentorship Program'
              description="Connect with experienced women leaders in Miami's tech scene for personalized guidance and support."
              link='https://example.com/mentorship'
            />
            <MiamiTechCard
              icon={<Calendar />}
              title='Tech Events'
              description='Join our monthly meetups and workshops designed specifically for women in tech in the Miami area.'
              link='https://example.com/events'
            />
            <MiamiTechCard
              icon={<MapPin />}
              title='Local Opportunities'
              description='Discover tech opportunities at Miami-based companies committed to diversity and inclusion.'
              link='https://example.com/jobs'
            />
          </div>
          <div className='mt-12 text-center'>
            <a
              href='#join'
              className='inline-block rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:from-pink-600 hover:to-blue-600'
            >
              Join Our Community
            </a>
          </div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section className='relative px-4 py-20'>
        <div className='mx-auto max-w-3xl text-center'>
          <h2 className='mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
            Let&apos;s Connect
          </h2>
          <p className='mb-8 text-xl text-gray-200'>
            I&apos;m always interested in hearing about new projects and opportunities.
          </p>
          <a
            href='mailto:contact@example.com'
            className='inline-block rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-8 py-3 font-semibold text-white transition-all duration-300 hover:from-blue-600 hover:to-emerald-600'
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

const SkillCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className='rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-colors hover:bg-gray-700/40'>
    <div className='mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400'>
      {icon}
    </div>
    <h3 className='mb-2 text-xl font-semibold'>{title}</h3>
    <p className='text-gray-300'>{description}</p>
  </div>
);

const DetailedProjectCard = ({
  title,
  description,
  icon,
  tech,
  link,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tech: string[];
  link: string;
}) => (
  <div className='group rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/40'>
    <div className='flex flex-col gap-6 md:flex-row'>
      <div className='flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400'>
        {icon}
      </div>
      <div className='grow'>
        <div className='mb-2 flex items-center gap-4'>
          <h3 className='text-xl font-semibold'>{title}</h3>
          <a
            href={link}
            className='text-blue-400 transition-colors hover:text-blue-300'
            target='_blank'
            rel='noopener noreferrer'
          >
            <Globe className='size-5' />
          </a>
        </div>
        <p className='mb-4 text-gray-300'>{description}</p>
        <div className='flex flex-wrap gap-2'>
          {tech.map((item, index) => (
            <span
              key={index}
              className='rounded-full border border-gray-600/50 bg-gray-700/50 px-3 py-1 text-sm text-gray-200'
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MiamiTechCard = ({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) => (
  <a
    href={link}
    className='group block rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-gray-700/40'
  >
    <div className='mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-blue-500/20 text-pink-400 transition-transform group-hover:scale-110'>
      {icon}
    </div>
    <h3 className='mb-2 text-xl font-semibold transition-colors group-hover:text-pink-400'>
      {title}
    </h3>
    <p className='text-gray-300'>{description}</p>
  </a>
);
