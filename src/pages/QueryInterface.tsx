import React, { useState, useEffect } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Play, Database, Clock, Download, Copy } from "lucide-react";

interface QueryResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  rowCount: number;
  executionTime: number;
}

const QueryInterface = () => {
  const { db, isInitialized } = useDatabase();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const sampleQueries = [
    {
      title: "All Patients",
      query: "SELECT * FROM patients ORDER BY created_at DESC;",
    },
    {
      title: "Patients by Gender",
      query:
        "SELECT gender, COUNT(*) as count FROM patients WHERE gender IS NOT NULL GROUP BY gender;",
    },
    {
      title: "Recent Registrations",
      query: `SELECT first_name, last_name, created_at FROM patients WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' ORDER BY created_at DESC;`,
    },
    {
      title: "Patients with Allergies",
      query:
        "SELECT first_name, last_name, allergies FROM patients WHERE allergies IS NOT NULL AND allergies != '';",
    },
    {
      title: "Age Distribution",
      query: `SELECT 
        CASE 
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) < 18 THEN 'Under 18'
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 18 AND 35 THEN '18-35'
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) BETWEEN 36 AND 55 THEN '36-55'
          WHEN EXTRACT(YEAR FROM AGE(date_of_birth)) > 55 THEN 'Over 55'
          ELSE 'Unknown'
        END as age_group,
        COUNT(*) as count
      FROM patients 
      WHERE date_of_birth IS NOT NULL
      GROUP BY age_group;`,
    },
    {
      title: "Table Schema",
      query: `SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'patients' 
      ORDER BY ordinal_position;`,
    },
  ];

  useEffect(() => {
    const savedHistory = localStorage.getItem("query-history");
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }
  }, []);

  const executeQuery = async () => {
    if (!db || !query.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = await db.query(query);
      const executionTime = Date.now() - startTime;

      const columns = result.fields?.map((field) => field.name) || [];
      const queryResult: QueryResult = {
        columns,
        rows: result.rows as Array<Record<string, unknown>>,
        rowCount: result.rows.length,
        executionTime,
      };

      setResult(queryResult);

      // Add to history
      const newHistory = [
        query,
        ...queryHistory.filter((q) => q !== query),
      ].slice(0, 10);
      setQueryHistory(newHistory);
      localStorage.setItem("query-history", JSON.stringify(newHistory));

      toast({
        title: "Query Executed",
        description: `Returned ${queryResult.rowCount} rows in ${executionTime}ms`,
      });
    } catch (error) {
      console.error("Query error:", error);
      toast({
        title: "Query Error",
        description:
          error instanceof Error ? error.message : "Failed to execute query",
        variant: "destructive",
      });
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const downloadResults = () => {
    if (!result) return;

    const csv = [
      result.columns.join(","),
      ...result.rows.map((row) =>
        result.columns
          .map((col) => {
            const value = row[col];
            return typeof value === "string" && value.includes(",")
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `query-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          SQL Query Interface
        </h1>
        <p className="text-gray-600 mt-2">
          Execute raw SQL queries against the patient database
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Query Input */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                SQL Query
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your SQL query here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={executeQuery}
                    disabled={loading || !query.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute Query
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(query)}
                    disabled={!query.trim()}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query Results */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    Results
                    <Badge variant="secondary" className="ml-2">
                      {result.rowCount} rows
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {result.executionTime}ms
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadResults}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.rowCount === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No results returned
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          {result.columns.map((column, index) => (
                            <th
                              key={index}
                              className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-900"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.slice(0, 100).map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {result.columns.map((column, colIndex) => (
                              <td
                                key={colIndex}
                                className="border border-gray-200 px-4 py-2 text-sm text-gray-900"
                              >
                                {row[column] !== null &&
                                row[column] !== undefined
                                  ? String(row[column])
                                  : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {result.rowCount > 100 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Showing first 100 rows of {result.rowCount} total
                        results
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sample Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleQueries.map((sample, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setQuery(sample.query)}
                  >
                    <div>
                      <div className="font-medium">{sample.title}</div>
                      <div className="text-xs text-gray-500 mt-1 font-mono">
                        {sample.query.slice(0, 50)}...
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queryHistory.map((historyQuery, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setQuery(historyQuery)}
                    >
                      <div className="text-xs text-gray-600 font-mono truncate">
                        {historyQuery}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schema Info */}
          <Card>
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="font-medium">patients table:</div>
                <ul className="text-xs text-gray-600 space-y-1 ml-4">
                  <li>• id (UUID, Primary Key)</li>
                  <li>• first_name, last_name (VARCHAR)</li>
                  <li>• email, phone (VARCHAR)</li>
                  <li>• date_of_birth (DATE)</li>
                  <li>• gender (VARCHAR)</li>
                  <li>• address (TEXT)</li>
                  <li>• emergency_contact_* (VARCHAR)</li>
                  <li>• medical_history (TEXT)</li>
                  <li>• allergies, medications (TEXT)</li>
                  <li>• insurance_* (VARCHAR)</li>
                  <li>• created_at, updated_at (TIMESTAMP)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueryInterface;
