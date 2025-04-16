const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Wipe function
async function wipeAllData() {
  try {
    console.log("Wiping data...");

    // Delete all users
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`Deleted ${deletedUsers.count} users.`);

    // Reset the auto-increment sequence
    console.log("Resetting ID sequence...");
    await prisma.$executeRawUnsafe(
      `DELETE FROM sqlite_sequence WHERE name = 'user';`
    );
    console.log("ID sequence reset complete.");

    console.log("Data wiped.");
  } catch (e) {
    console.error("Error wiping data: ", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seedData, wipeAllData, or exportDataToCSV based on command-line argument
const command = process.argv[2];

if (command === "wipeAllData") {
  wipeAllData();
} else {
  console.error("Unknown command. Use 'wipeAllData'");
  process.exit(1);
}
