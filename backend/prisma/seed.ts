import { hashPassword } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";

/**
 * Development seed. Idempotent — safe to run repeatedly.
 *
 * Passwords are deliberately obvious: this data must never reach production.
 */
const PASSWORD = "password123";

/**
 * Refuse to run against a database that already has real accounts.
 *
 * Local development now points at the live database over an SSH tunnel, which
 * means one absent-minded `npm run db:seed` would create an admin with the
 * password above on the production site. Counting users is a crude check, but
 * it costs one query and it is the difference between a typo and a breach.
 *
 * Override deliberately with: ALLOW_SEED=yes npm run db:seed
 */
async function refuseIfPopulated() {
  if (process.env.ALLOW_SEED === "yes") return;

  const existing = await prisma.user.count();
  if (existing === 0) return;

  console.error(
    `\n✖ Refusing to seed: this database already has ${existing} user(s).\n` +
      `  If this is production you almost certainly do not want to add an\n` +
      `  account with the password "${PASSWORD}".\n\n` +
      `  If you are certain, re-run with:  ALLOW_SEED=yes npm run db:seed\n`,
  );
  process.exit(1);
}

const team = [
  {
    email: "amara@snugtalk.test",
    name: "Amara Okonkwo",
    slug: "amara-okonkwo",
    headline: "Ex-operator who now listens to founders think",
    bio: "Twelve years inside early-stage companies taught me that most people already know the answer — they just haven't been given a quiet enough room to hear themselves say it.",
    timezone: "WEST (UTC+1)",
    languages: ["English", "Portuguese"],
    specialties: ["Idea Validation", "Business Brainstorming"],
  },
  {
    email: "daniel@snugtalk.test",
    name: "Daniel Reyes",
    slug: "daniel-reyes",
    headline: "Calm, unhurried, good with the 2am thoughts",
    bio: "I'm comfortable with silence, with tangents, and with conversations that don't resolve neatly.",
    timezone: "CDT (UTC−5)",
    languages: ["English", "Spanish"],
    specialties: ["Life Conversations", "General Listening"],
  },
];

async function main() {
  await refuseIfPopulated();

  const passwordHash = await hashPassword(PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: "admin@snugtalk.test" },
    update: {},
    create: {
      email: "admin@snugtalk.test",
      name: "Shafqat Jamil",
      passwordHash,
      role: "ADMIN",
    },
  });

  for (const person of team) {
    const user = await prisma.user.upsert({
      where: { email: person.email },
      update: {},
      create: {
        email: person.email,
        name: person.name,
        passwordHash,
        role: "LISTENER",
      },
    });

    // Keyed on slug, not userId: the slug is the profile's stable identity, and
    // upserting by userId collides with the unique slug if the account behind a
    // listener ever changes (a rename, a re-seed, a new email).
    await prisma.listenerProfile.upsert({
      where: { slug: person.slug },
      update: { userId: user.id },
      create: {
        userId: user.id,
        slug: person.slug,
        headline: person.headline,
        bio: person.bio,
        timezone: person.timezone,
        languages: person.languages,
        specialties: person.specialties,
        isOnShift: true,
      },
    });
  }

  const member = await prisma.user.upsert({
    where: { email: "member@snugtalk.test" },
    update: {},
    create: {
      email: "member@snugtalk.test",
      name: "Jordan Mercer",
      passwordHash,
      role: "MEMBER",
    },
  });

  const existingRequests = await prisma.meetingRequest.count({ where: { userId: member.id } });
  if (existingRequests === 0) {
    await prisma.meetingRequest.create({
      data: {
        reference: "SNG-SEED01",
        userId: member.id,
        name: member.name,
        email: member.email,
        topic:
          "I've been building a marketplace for eight months and I still can't tell if the pull is real, or if I just enjoy building it.",
      },
    });
  }

  console.log("Seeded:");
  console.log(`  ADMIN     ${admin.email}`);
  for (const person of team) console.log(`  LISTENER  ${person.email}`);
  console.log(`  MEMBER    ${member.email}`);
  console.log(`\n  password for all: ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
