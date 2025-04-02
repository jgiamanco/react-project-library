import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { runAllDatabaseTests } from "@/services/db-tests";

export default function DatabaseTest() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTests = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await runAllDatabaseTests();
      setTestResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Connection Tests</h1>

      <Button onClick={runTests} disabled={loading} className="mb-4">
        {loading ? "Running Tests..." : "Run Database Tests"}
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {testResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connection Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`font-bold ${
                  testResults.connection.success
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testResults.connection.message}
              </div>
              {testResults.connection.details && (
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.connection.details, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table Structure Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`font-bold ${
                  testResults.structure.success
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testResults.structure.message}
              </div>
              {testResults.structure.details && (
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.structure.details, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>RLS Policies Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`font-bold ${
                  testResults.policies.success
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {testResults.policies.message}
              </div>
              {testResults.policies.details && (
                <pre className="mt-2 text-sm bg-gray-100 p-2 rounded">
                  {JSON.stringify(testResults.policies.details, null, 2)}
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
