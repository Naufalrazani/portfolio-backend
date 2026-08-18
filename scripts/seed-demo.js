import "dotenv/config";

import prisma from "../src/lib/prisma.js";

if (process.env.NODE_ENV === "production") {
  console.error("Demo seed cannot run in production.");
  process.exit(1);
}

const profile = {
  name: "Alex Pratama",
  headline: "Software Engineer & AI Enthusiast",
  bio: "I am a university student studying Informatics Engineering at Universitas Muhammadiyah Jakarta. My work spans web development, data analysis, machine learning, and natural language processing.\n\nOn the backend, I build with Node.js, Express, and Prisma against PostgreSQL. On the frontend, I work with React and modern JavaScript. I have also applied Python and scikit-learn to sentiment analysis and text classification tasks as part of academic capstone projects.\n\nI am currently focused on shipping real projects: an AI-powered tourism platform, a student organization website, and this portfolio itself. I learn best by building things that solve actual problems.",
  location: "Jakarta, Indonesia",
  email: null,
  profileImageUrl: null,
  resumeUrl: null,
};

const skills = [
  { name: "React", category: "Frontend", sortOrder: 1 },
  { name: "JavaScript", category: "Frontend", sortOrder: 2 },
  { name: "Node.js", category: "Backend", sortOrder: 3 },
  { name: "Express", category: "Backend", sortOrder: 4 },
  { name: "Prisma", category: "Backend", sortOrder: 5 },
  { name: "PostgreSQL", category: "Database", sortOrder: 6 },
  { name: "Python", category: "Data & AI", sortOrder: 7 },
  { name: "Machine Learning", category: "Data & AI", sortOrder: 8 },
];

const experiences = [
  {
    role: "ML Pipeline Developer",
    organization: "Kemari Capstone Project",
    description:
      "Designed and built the sentiment analysis pipeline for a smart tourism platform as part of a university capstone project. Processed multilingual tourism reviews, trained classification models using Python, scikit-learn, and Hugging Face transformers, and integrated the model into a web application for real-time inference.",
    location: "Jakarta, Indonesia",
    startDate: "2025-09-01",
    endDate: "2026-02-28",
    sortOrder: 1,
  },
  {
    role: "Developer",
    organization: "HMIF FT-UMJ Website",
    description:
      "Built the official website for Himpunan Mahasiswa Informatika FT-UMJ. Implemented the admin CMS, public project showcase, and content management features using Node.js, Express, Prisma, and React.",
    location: "Jakarta, Indonesia",
    startDate: "2025-03-01",
    endDate: null,
    sortOrder: 2,
  },
  {
    role: "Laboratory Assistant",
    organization: "Universitas Muhammadiyah Jakarta",
    description:
      "Assisted in teaching introductory programming and data structures courses. Graded assignments, held weekly lab sessions, and helped students understand core algorithmic concepts.",
    location: "Jakarta, Indonesia",
    startDate: "2024-09-01",
    endDate: "2025-01-31",
    sortOrder: 3,
  },
];

const education = {
  institution: "Universitas Muhammadiyah Jakarta",
  degree: "Bachelor's Degree",
  fieldOfStudy: "Informatics Engineering",
  description:
    "Studying software engineering, algorithms, databases, machine learning, and web technologies.",
  startDate: "2022-09-01",
  endDate: null,
  sortOrder: 1,
};

const projects = [
  {
    title: "Kemari — AI for Smart Tourism",
    slug: "kemari-ai-smart-tourism",
    shortDescription:
      "AI-powered tourism sentiment analysis platform for Indonesian destinations.",
    description:
      "Kemari is a capstone project that applies natural language processing to tourism reviews. The platform collects visitor reviews from multiple sources, runs sentiment analysis using trained ML models, and presents aggregated insights through an interactive dashboard. Tourism managers can track visitor sentiment trends, identify pain points, and make data-driven decisions to improve destination quality. The backend is built with Node.js and Express, the frontend with React, and the ML pipeline uses Python with scikit-learn and Hugging Face transformers.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Python",
      "scikit-learn",
      "PostgreSQL",
    ],
    repositoryUrl: null,
    demoUrl: null,
    category: "AI & Machine Learning",
    status: "COMPLETED",
    published: true,
    featured: true,
    startDate: "2025-09-01",
    endDate: "2026-02-28",
    sortOrder: 1,
  },
  {
    title: "HMIF FT-UMJ Website",
    slug: "hmif-ft-umj-website",
    shortDescription:
      "Official website for the Informatics Engineering student association.",
    description:
      "The HMIF FT-UMJ website serves as the central digital presence for Himpunan Mahasiswa Informatika at Universitas Muhammadiyah Jakarta. It features a public-facing project showcase, event announcements, and organizational information. The admin CMS allows members to manage projects, events, and content without touching the codebase. Built with a REST API backend, PostgreSQL for persistence, and a React frontend with protected admin routes.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    repositoryUrl: null,
    demoUrl: null,
    category: "Web Development",
    status: "IN_PROGRESS",
    published: true,
    featured: true,
    startDate: "2025-03-01",
    endDate: null,
    sortOrder: 2,
  },
  {
    title: "KSM Tirta Water Management System",
    slug: "ksm-tirta-water-management",
    shortDescription:
      "Water meter management and monitoring system for local communities.",
    description:
      "KSM Tirta is a management system designed for local water supply cooperatives (KSM). It tracks water meter readings, calculates billing based on consumption tiers, and generates monthly reports for administrators. The system reduces manual bookkeeping and helps cooperatives manage distribution more efficiently. Currently under active development with a focus on accurate billing logic and a clean admin interface.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
    ],
    repositoryUrl: null,
    demoUrl: null,
    category: "Web Development",
    status: "IN_PROGRESS",
    published: true,
    featured: true,
    startDate: "2025-11-01",
    endDate: null,
    sortOrder: 3,
  },
  {
    title: "YouTube Brainrot Comment Analysis",
    slug: "youtube-brainrot-analysis",
    shortDescription:
      "NLP analysis of YouTube comment trends and language patterns.",
    description:
      "A data analysis project that scrapes YouTube comments from trending videos and applies NLP techniques to study informal language patterns, slang evolution, and engagement trends. The project uses Python for data collection and processing, with visualizations built in React to display sentiment distributions, word frequency breakdowns, and temporal trends in comment activity.",
    technologies: [
      "Python",
      "React",
      "NLP",
      "Data Visualization",
    ],
    repositoryUrl: null,
    demoUrl: null,
    category: "Data & NLP",
    status: "COMPLETED",
    published: true,
    featured: false,
    startDate: "2025-06-01",
    endDate: "2025-08-15",
    sortOrder: 4,
  },
  {
    title: "Personal Portfolio Website",
    slug: "personal-portfolio",
    shortDescription:
      "This portfolio — a full-stack personal site with admin CMS.",
    description:
      "A personal portfolio website built from scratch with a Node.js/Express REST API, Prisma ORM, PostgreSQL, and a React frontend. Includes a public-facing portfolio display and an admin CMS for managing projects, skills, experience, education, certificates, achievements, and contact messages. The backend follows a layered architecture with route, controller, service, and repository layers. Authentication uses JWT with bcrypt password hashing.",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "Prisma",
      "PostgreSQL",
      "JWT",
    ],
    repositoryUrl: null,
    demoUrl: null,
    category: "Web Development",
    status: "IN_PROGRESS",
    published: true,
    featured: false,
    startDate: "2025-10-01",
    endDate: null,
    sortOrder: 5,
  },
];

const projectImages = [];

const certificates = [
  {
    name: "AI Engineering Program",
    issuer: "Dicoding x IBM SkillsBuild",
    issueDate: "2025-07-15",
    credentialUrl: null,
    imageUrl: null,
    description:
      "Completed the AI Engineering learning path covering machine learning fundamentals, model training, and deployment.",
    sortOrder: 1,
  },
];

const achievements = [];

const socialLinks = [];

const contactMessages = [
  {
    name: "Rina Sari",
    email: "rina@example.com",
    subject: "Collaboration Inquiry",
    message:
      "Hi Alex, I am working on a research project about sentiment analysis in Indonesian social media. Would you be open to collaborating on the NLP pipeline? I have access to a labeled dataset we could use.",
  },
  {
    name: "Dev Team",
    email: "devteam@example.com",
    subject: "Project Discussion",
    message:
      "Hello, we saw the Kemari project and are interested in integrating a similar sentiment analysis feature into our tourism platform. Could we discuss the approach you used and potential licensing?",
  },
  {
    name: "Portfolio Visitor",
    email: "visitor@example.com",
    subject: "Portfolio Feedback",
    message:
      "Great portfolio, Alex. The project descriptions are clear and the tech stack choices make sense. One suggestion: adding live demo links when available would strengthen the project pages.",
  },
];

async function seedProfile() {
  const existing = await prisma.profile.findFirst();

  if (existing) {
    await prisma.profile.update({
      where: { id: existing.id },
      data: {
        name: profile.name,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        email: profile.email,
        profileImageUrl: profile.profileImageUrl,
        resumeUrl: profile.resumeUrl,
      },
    });
    return "updated";
  }

  await prisma.profile.create({ data: profile });
  return "created";
}

async function seedSkills() {
  let created = 0;
  let updated = 0;

  for (const skill of skills) {
    const existing = await prisma.skill.findUnique({
      where: { name: skill.name },
    });

    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: { category: skill.category, sortOrder: skill.sortOrder },
      });
      updated++;
    } else {
      await prisma.skill.create({ data: skill });
      created++;
    }
  }

  return { created, updated };
}

async function seedExperiences() {
  let created = 0;
  let updated = 0;

  for (const exp of experiences) {
    const existing = await prisma.experience.findFirst({
      where: { role: exp.role, organization: exp.organization },
    });

    if (existing) {
      await prisma.experience.update({
        where: { id: existing.id },
        data: {
          description: exp.description,
          location: exp.location,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          sortOrder: exp.sortOrder,
        },
      });
      updated++;
    } else {
      await prisma.experience.create({
        data: {
          ...exp,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
        },
      });
      created++;
    }
  }

  return { created, updated };
}

async function seedEducation() {
  const existing = await prisma.education.findFirst({
    where: { institution: education.institution },
  });

  if (existing) {
    await prisma.education.update({
      where: { id: existing.id },
      data: {
        degree: education.degree,
        fieldOfStudy: education.fieldOfStudy,
        description: education.description,
        startDate: new Date(education.startDate),
        endDate: education.endDate,
        sortOrder: education.sortOrder,
      },
    });
    return "updated";
  }

  await prisma.education.create({
    data: {
      ...education,
      startDate: new Date(education.startDate),
      endDate: education.endDate,
    },
  });
  return "created";
}

async function seedProjects() {
  let created = 0;
  let updated = 0;

  const projectRecords = {};

  for (const project of projects) {
    const existing = await prisma.project.findUnique({
      where: { slug: project.slug },
    });

    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          title: project.title,
          shortDescription: project.shortDescription,
          description: project.description,
          technologies: project.technologies,
          repositoryUrl: project.repositoryUrl,
          demoUrl: project.demoUrl,
          category: project.category,
          status: project.status,
          published: project.published,
          featured: project.featured,
          startDate: project.startDate ? new Date(project.startDate) : null,
          endDate: project.endDate ? new Date(project.endDate) : null,
          sortOrder: project.sortOrder,
        },
      });
      projectRecords[project.slug] = existing.id;
      updated++;
    } else {
      const createdProject = await prisma.project.create({
        data: {
          ...project,
          startDate: project.startDate ? new Date(project.startDate) : null,
          endDate: project.endDate ? new Date(project.endDate) : null,
        },
      });
      projectRecords[project.slug] = createdProject.id;
      created++;
    }
  }

  return { created, updated, projectRecords };
}

async function seedProjectImages(projectRecords) {
  let created = 0;
  let updated = 0;

  for (const img of projectImages) {
    const projectId = projectRecords[img.projectSlug];
    if (!projectId) continue;

    const existing = await prisma.projectImage.findFirst({
      where: { projectId, url: img.url },
    });

    if (existing) {
      await prisma.projectImage.update({
        where: { id: existing.id },
        data: { altText: img.altText, sortOrder: img.sortOrder },
      });
      updated++;
    } else {
      await prisma.projectImage.create({
        data: {
          projectId,
          url: img.url,
          altText: img.altText,
          sortOrder: img.sortOrder,
        },
      });
      created++;
    }
  }

  return { created, updated };
}

async function seedCertificates() {
  let created = 0;
  let updated = 0;

  for (const cert of certificates) {
    const existing = await prisma.certificate.findFirst({
      where: { name: cert.name, issuer: cert.issuer },
    });

    if (existing) {
      await prisma.certificate.update({
        where: { id: existing.id },
        data: {
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
          credentialUrl: cert.credentialUrl,
          imageUrl: cert.imageUrl,
          description: cert.description,
          sortOrder: cert.sortOrder,
        },
      });
      updated++;
    } else {
      await prisma.certificate.create({
        data: {
          ...cert,
          issueDate: cert.issueDate ? new Date(cert.issueDate) : null,
        },
      });
      created++;
    }
  }

  return { created, updated };
}

async function seedAchievements() {
  let created = 0;
  let updated = 0;

  for (const ach of achievements) {
    const existing = await prisma.achievement.findFirst({
      where: { title: ach.title },
    });

    if (existing) {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: {
          description: ach.description,
          organization: ach.organization,
          date: ach.date ? new Date(ach.date) : null,
          url: ach.url,
          sortOrder: ach.sortOrder,
        },
      });
      updated++;
    } else {
      await prisma.achievement.create({
        data: {
          ...ach,
          date: ach.date ? new Date(ach.date) : null,
        },
      });
      created++;
    }
  }

  return { created, updated };
}

async function seedSocialLinks() {
  let created = 0;
  let updated = 0;

  for (const link of socialLinks) {
    const existing = await prisma.socialLink.findUnique({
      where: { platform: link.platform },
    });

    if (existing) {
      await prisma.socialLink.update({
        where: { id: existing.id },
        data: { url: link.url, label: link.label, sortOrder: link.sortOrder },
      });
      updated++;
    } else {
      await prisma.socialLink.create({ data: link });
      created++;
    }
  }

  return { created, updated };
}

async function seedContactMessages() {
  let created = 0;
  let skipped = 0;

  for (const msg of contactMessages) {
    const existing = await prisma.contactMessage.findFirst({
      where: { email: msg.email, name: msg.name, subject: msg.subject },
    });

    if (existing) {
      skipped++;
    } else {
      await prisma.contactMessage.create({ data: msg });
      created++;
    }
  }

  return { created, skipped };
}

async function main() {
  const counts = {};

  counts.profile = await seedProfile();
  counts.skills = await seedSkills();
  counts.experiences = await seedExperiences();
  counts.education = await seedEducation();

  const projectResult = await seedProjects();
  counts.projects = projectResult;

  counts.projectImages = await seedProjectImages(
    projectResult.projectRecords,
  );
  counts.certificates = await seedCertificates();
  counts.achievements = await seedAchievements();
  counts.socialLinks = await seedSocialLinks();
  counts.contactMessages = await seedContactMessages();

  console.log("Demo seed completed successfully.\n");
  console.log(`Profile: 1 (${counts.profile})`);
  console.log(
    `Skills: ${skills.length} (${counts.skills.created} created, ${counts.skills.updated} updated)`,
  );
  console.log(
    `Experience: ${experiences.length} (${counts.experiences.created} created, ${counts.experiences.updated} updated)`,
  );
  console.log(`Education: 1 (${counts.education})`);
  console.log(
    `Projects: ${projects.length} (${counts.projects.created} created, ${counts.projects.updated} updated)`,
  );
  console.log(
    `Project Images: ${projectImages.length} (${counts.projectImages.created} created, ${counts.projectImages.updated} updated)`,
  );
  console.log(
    `Certificates: ${certificates.length} (${counts.certificates.created} created, ${counts.certificates.updated} updated)`,
  );
  console.log(
    `Achievements: ${achievements.length} (${counts.achievements.created} created, ${counts.achievements.updated} updated)`,
  );
  console.log(
    `Social Links: ${socialLinks.length} (${counts.socialLinks.created} created, ${counts.socialLinks.updated} updated)`,
  );
  console.log(
    `Contact Messages: ${contactMessages.length} (${counts.contactMessages.created} created, ${counts.contactMessages.skipped} skipped)`,
  );
}

main()
  .catch((err) => {
    console.error("Failed to seed demo data:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
