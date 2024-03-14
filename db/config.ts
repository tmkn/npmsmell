import { defineDb, defineTable, column } from "astro:db";

const Author = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text()
    }
});

const Comment = defineTable({
    columns: {
        authorId: column.number({ references: () => Author.columns.id }),
        body: column.text()
    }
});

// https://astro.build/db/config
export default defineDb({
    tables: { Author, Comment }
});
