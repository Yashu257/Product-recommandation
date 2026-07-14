import { PrismaClient, Platform, PostStatus, WorkspaceMemberRole, AITone } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'sarah@cadence.app' },
    update: {},
    create: {
      email: 'sarah@cadence.app',
      passwordHash,
      name: 'Sarah Johnson',
      handle: 'sarahjohnson',
      timezone: 'America/New_York',
      emailVerified: true,
    },
  });

  // Create workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'cadence-demo' },
    update: {},
    create: {
      name: 'Cadence Inc.',
      slug: 'cadence-demo',
      timezone: 'America/New_York',
      aiCredits: 5000,
      aiCreditsResetAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
  });

  // Add user as owner
  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: user.id,
      role: WorkspaceMemberRole.OWNER,
    },
  });

  // Create social accounts
  const accounts = [
    { platform: Platform.TWITTER,   handle: '@cadence',        displayName: 'Cadence',       followersCount: 24100 },
    { platform: Platform.FACEBOOK,  handle: 'cadence.app',     displayName: 'Cadence App',   followersCount: 12800 },
    { platform: Platform.INSTAGRAM, handle: '@cadence.studio', displayName: 'Cadence Studio', followersCount: 38400 },
    { platform: Platform.LINKEDIN,  handle: 'Cadence Inc.',    displayName: 'Cadence Inc.',  followersCount: 9300 },
  ];

  const socialAccountMap: Record<string, string> = {};
  for (const acc of accounts) {
    const sa = await prisma.socialAccount.upsert({
      where: { workspaceId_platform_handle: { workspaceId: workspace.id, platform: acc.platform, handle: acc.handle } },
      update: {},
      create: { workspaceId: workspace.id, ...acc, isActive: true },
    });
    socialAccountMap[acc.platform] = sa.id;
  }

  // Create brand voice
  await prisma.brandVoice.upsert({
    where: { workspaceId: workspace.id },
    update: {},
    create: {
      workspaceId: workspace.id,
      defaultTone: AITone.CONVERSATIONAL,
      championWords: ['innovative', 'seamless', 'powerful', 'intelligent'],
      avoidWords: ['synergy', 'leverage', 'disruptive'],
      postsAnalyzed: 47,
      voiceMatchScore: 94,
    },
  });

  // Create sample posts
  const postsData = [
    {
      title: 'Product Launch Announcement',
      content: '🚀 Excited to announce our new AI-powered features! Transform your social media strategy with intelligent automation that learns your voice and audience.',
      hashtags: ['ProductLaunch', 'AI', 'SocialMedia'],
      status: PostStatus.SCHEDULED,
      scheduledAt: new Date(2026, 4, 28, 10, 0),
      platforms: [Platform.TWITTER, Platform.LINKEDIN],
    },
    {
      title: 'Customer Success Story — Sarah',
      content: 'Meet Sarah, who increased her engagement by 300% using our platform. Read her inspiring journey on our blog!',
      hashtags: ['CustomerSuccess', 'Growth'],
      status: PostStatus.SCHEDULED,
      scheduledAt: new Date(2026, 4, 29, 14, 30),
      platforms: [Platform.FACEBOOK, Platform.INSTAGRAM],
    },
    {
      title: 'Monday Motivation',
      content: '🌟 Start your week right! Success is not about being the best, it\'s about being better than you were yesterday.',
      hashtags: ['MondayMotivation', 'Success'],
      status: PostStatus.PUBLISHED,
      scheduledAt: new Date(2026, 4, 25, 8, 0),
      publishedAt: new Date(2026, 4, 25, 8, 0),
      platforms: [Platform.LINKEDIN, Platform.TWITTER],
    },
    {
      title: 'Behind the Scenes',
      content: 'A sneak peek at our team working on exciting new features! Stay tuned for updates. 👀',
      hashtags: ['BehindTheScenes', 'TeamWork'],
      status: PostStatus.DRAFT,
      platforms: [Platform.INSTAGRAM],
    },
  ];

  for (const postData of postsData) {
    const { platforms, ...rest } = postData;
    const post = await prisma.post.create({
      data: {
        ...rest,
        workspaceId: workspace.id,
        authorId: user.id,
        targets: {
          create: platforms.map((p) => ({
            platform: p,
            socialAccountId: socialAccountMap[p],
            status: rest.status,
          })),
        },
      },
    });

    // Add metrics for published posts
    if (rest.status === PostStatus.PUBLISHED) {
      await prisma.postMetrics.create({
        data: {
          postId: post.id,
          reach: 8240,
          impressions: 12000,
          engagement: 5.6,
          clicks: 187,
          likes: 342,
          shares: 58,
          comments: 24,
        },
      });
    }
  }

  console.log('✅ Seed complete');
  console.log(`   User: sarah@cadence.app / password123`);
  console.log(`   Workspace: ${workspace.slug}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
