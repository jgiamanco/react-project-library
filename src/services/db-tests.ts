import { supabase, supabaseAdmin } from "./supabase-client";
import { Database } from "./database.types";

interface TestResult {
  success: boolean;
  message: string;
  details?: unknown;
}

interface TableInfo {
  table_name: string;
  table_type: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
}

interface PolicyInfo {
  policyname: string;
  permissive: string;
  roles: string[];
  cmd: string;
  qual: string;
  with_check: string;
}

export async function testDatabaseConnection(): Promise<TestResult> {
  try {
    // Test 1: Basic connection test
    const { data, error } = await supabase
      .from("users")
      .select("count")
      .limit(1);
    if (error) {
      return {
        success: false,
        message: "Failed to connect to database",
        details: error,
      };
    }

    return {
      success: true,
      message: "Successfully connected to database",
    };
  } catch (error) {
    return {
      success: false,
      message: "Database connection test failed",
      details: error,
    };
  }
}

export async function testTableStructure(): Promise<TestResult> {
  try {
    // Test 1: Get all tables in the database
    const { data: tables, error: tablesError } = (await supabaseAdmin.rpc(
      "get_tables",
      { schema_name: "public" }
    )) as { data: TableInfo[] | null; error: Error | null };

    if (tablesError) {
      return {
        success: false,
        message: "Error getting tables",
        details: tablesError,
      };
    }

    // Test 2: Check if users table exists and get its structure
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from("users")
      .select("email")
      .limit(1);

    if (tableError) {
      if (tableError.code === "42P01") {
        return {
          success: false,
          message: "Users table does not exist",
          details: {
            availableTables: tables,
            message: "Table needs to be created",
          },
        };
      }
      return {
        success: false,
        message: "Error checking users table",
        details: {
          availableTables: tables,
          error: tableError,
        },
      };
    }

    // Test 3: Get table structure without data
    const { data: structure, error: structureError } = (await supabaseAdmin.rpc(
      "get_table_structure",
      { table_name: "users" }
    )) as { data: ColumnInfo[] | null; error: Error | null };

    if (structureError) {
      return {
        success: false,
        message: "Error getting table structure",
        details: {
          availableTables: tables,
          error: structureError,
        },
      };
    }

    // Test 4: Check RLS policies
    const { data: policies, error: policiesError } = (await supabaseAdmin.rpc(
      "get_policies",
      { table_name: "users" }
    )) as { data: PolicyInfo[] | null; error: Error | null };

    if (policiesError) {
      return {
        success: false,
        message: "Error checking RLS policies",
        details: {
          availableTables: tables,
          error: policiesError,
        },
      };
    }

    return {
      success: true,
      message: "Table structure and policies verified successfully",
      details: {
        availableTables: tables,
        usersTableStructure: structure,
        policies: policies?.map((p) => ({
          name: p.policyname,
          command: p.cmd,
          roles: p.roles,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Table structure test failed",
      details: error,
    };
  }
}

export async function testRLSPolicies(): Promise<TestResult> {
  try {
    // Test 1: Check if RLS is enabled
    const { data: rlsCheck, error: rlsError } = (await supabaseAdmin.rpc(
      "is_rls_enabled",
      { table_name: "users" }
    )) as { data: boolean | null; error: Error | null };

    if (rlsError) {
      return {
        success: false,
        message: "Error checking RLS status",
        details: rlsError,
      };
    }

    if (!rlsCheck) {
      return {
        success: false,
        message: "RLS is not enabled on users table",
        details: "RLS needs to be enabled",
      };
    }

    // Test 2: Check specific policies
    const requiredPolicies = [
      "Users can view their own profile",
      "Users can update their own profile",
      "Users can insert their own profile",
    ];

    const { data: policies, error: policiesError } = (await supabaseAdmin.rpc(
      "get_policies",
      { table_name: "users" }
    )) as { data: PolicyInfo[] | null; error: Error | null };

    if (policiesError) {
      return {
        success: false,
        message: "Error checking policies",
        details: policiesError,
      };
    }

    const missingPolicies = requiredPolicies.filter(
      (policy) => !policies?.some((p) => p.policyname === policy)
    );

    if (missingPolicies.length > 0) {
      return {
        success: false,
        message: "Missing required policies",
        details: { missingPolicies },
      };
    }

    return {
      success: true,
      message: "RLS policies verified successfully",
      details: { policies },
    };
  } catch (error) {
    return {
      success: false,
      message: "RLS policies test failed",
      details: error,
    };
  }
}

export async function runAllDatabaseTests(): Promise<{
  connection: TestResult;
  structure: TestResult;
  policies: TestResult;
}> {
  console.log("Starting database tests...");

  const connection = await testDatabaseConnection();
  console.log("Connection test result:", connection);

  const structure = await testTableStructure();
  console.log("Structure test result:", structure);

  const policies = await testRLSPolicies();
  console.log("Policies test result:", policies);

  return {
    connection,
    structure,
    policies,
  };
}
