import { db, Comment, Author } from "astro:db";
import { getCollection } from "astro:content";

// https://astro.build/db/seed
export default async function seed() {
    const allDependencies = await getCollection("dependencies");

    allDependencies.forEach((dependency, i) => {
        console.log(i, dependency.id);
    });

    // TODO
    console.log("Seeding the database");
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log("Seeding complete");

    await db.insert(Author).values([
        { id: 1, name: "Astro 2" },
        { id: 2, name: "DB" }
    ]);

    await db.insert(Comment).values([
        { authorId: 1, body: "Hope you like Astro DB!!" },
        { authorId: 2, body: "Enjoy!" }
    ]);
}
