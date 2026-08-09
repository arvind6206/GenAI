import pg from "pg";
import pgvector from "pgvector/pg";

let client;

export const connectToDB = async () => {
    try {
        client = new pg.Client({
            connectionString: process.env.PGVECTOR_DATABASE_URL,
        });

        await client.connect();

        // Check exactly which database Node is connected to
        const result = await client.query(`
            SELECT
                current_database() AS database,
                current_user AS user,
                inet_server_port() AS port,
                version() AS version,
                to_regtype('vector') AS vector_type
        `);

        console.log("DATABASE INFO:");
        console.log(result.rows[0]);

        await pgvector.registerTypes(client);

        console.log("Database connected successfully");

    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
};

export const getDb = () => {
    if (!client) {
        throw new Error("Database client not connected.");
    }

    return client;
};