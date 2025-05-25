import React, { createContext, useContext, useEffect, useState } from "react";
import { PGlite } from "@electric-sql/pglite";

interface DatabaseContextType {
  db: PGlite | null;
  isInitialized: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isInitialized: false,
  error: null,
});

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [db, setDb] = useState<PGlite | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log("Initializing PGlite database...");

        // Create PGlite instance with IndexedDB persistence
        const database = new PGlite({
          dataDir: "idb://patient-registry",
        });

        await database.waitReady;
        console.log("PGlite database ready");

        // Create patients table if it doesn't exist
        await database.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(20),
            date_of_birth DATE,
            gender VARCHAR(20),
            address TEXT,
            emergency_contact_name VARCHAR(100),
            emergency_contact_phone VARCHAR(20),
            medical_history TEXT,
            allergies TEXT,
            medications TEXT,
            insurance_provider VARCHAR(100),
            insurance_policy_number VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);

        // Create trigger for updated_at
        await database.exec(`
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
          END;
          $$ language 'plpgsql';
        `);

        await database.exec(`
          DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
          CREATE TRIGGER update_patients_updated_at
            BEFORE UPDATE ON patients
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log("Database tables and triggers created");

        setDb(database);
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError(err instanceof Error ? err.message : "Unknown database error");
      }
    };

    initializeDatabase();
  }, []);

  const value = {
    db,
    isInitialized,
    error,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
