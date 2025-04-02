import { supabase, supabaseAdmin } from "./supabase-client";
import { Database } from "./database.types";

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
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
    // Test 1: Check if users table exists
    const { data: tableCheck, error: tableError } = await supabaseAdmin
      .from("users")
      .select("email")
      .limit(1);

    if (tableError) {
      if (tableError.code === "42P01") {
        return {
          success: false,
          message: "Users table does not exist",
          details: "Table needs to be created",
        };
      }
      return {
        success: false,
        message: "Error checking users table",
        details: tableError,
      };
    }

    // Test 2: Check table structure
    const { data: structureCheck, error: structureError } = await supabaseAdmin
      .from("users")
      .select("*")
      .limit(1);

    if (structureError) {
      return {
        success: false,
        message: "Error checking table structure",
        details: structureError,
      };
    }

    // Test 3: Check RLS policies
    const { data: policies, error: policiesError } = await supabaseAdmin.rpc(
      "get_policies",
      { table_name: "users" }
    );

    if (policiesError) {
      return {
        success: false,
        message: "Error checking RLS policies",
        details: policiesError,
      };
    }

    return {
      success: true,
      message: "Table structure and policies verified successfully",
      details: {
        tableExists: true,
        structure: structureCheck,
        policies,
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
    const { data: rlsCheck, error: rlsError } = await supabaseAdmin.rpc(
      "is_rls_enabled",
      { table_name: "users" }
    );

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

    const { data: policies, error: policiesError } = await supabaseAdmin.rpc(
      "get_policies",
      { table_name: "users" }
    );

    if (policiesError) {
      return {
        success: false,
        message: "Error checking policies",
        details: policiesError,
      };
    }

    const missingPolicies = requiredPolicies.filter(
      (policy) => !policies.some((p: any) => p.policyname === policy)
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
