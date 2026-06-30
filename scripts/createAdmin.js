require("dotenv").config();

const readline = require("readline");

const usersService =
  require("../services/users.service");

const {
  hashPassword,
} = require("../utils/password");

const rl =
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

function ask(question) {

  return new Promise((resolve) => {

    rl.question(
      question,
      resolve
    );

  });

}

async function main() {

  try {

    console.log("\n=================================");
    console.log(" ForgeFlow Admin Creator");
    console.log("=================================\n");

    const name =
      (
        await ask(
          "Enter admin name: "
        )
      ).trim();

    const email =
      (
        await ask(
          "Enter admin email: "
        )
      ).trim();

    const password =
      (
        await ask(
          "Enter admin password: "
        )
      ).trim();

    const hashedPassword =
      hashPassword(password);

    const admin =
      await usersService.createUser({

        name,

        email,

        password:
          hashedPassword,

        role:
          "admin",

        dept:
          "Engineering",

        jobRole:
          "Backend Developer",

        phoneNumber:
          null,

      });

    console.log("\n✅ Admin created successfully.\n");

    console.table({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });

  }

  catch (error) {

    console.error(
      "\n❌ Failed to create admin.\n"
    );

    console.error(
      error.message
    );

  }

  finally {

    rl.close();

    process.exit();

  }

}

main();