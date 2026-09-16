import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL as string, {
  ssl: { rejectUnauthorized: false },
});

const testDBConnection = async () => {
  try {
    await sql`select 1`;
  } catch (error) {
    process.exit(1);
  }
};

export { sql, testDBConnection };
