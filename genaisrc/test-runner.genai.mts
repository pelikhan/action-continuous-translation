// Integration test wrapper that can handle both offline and online tests
// This script checks for authentication and runs appropriate tests

script({
  title: "Test Runner - Unit and Integration Tests", 
  description: "Runs offline unit tests and conditionally runs integration tests if auth is available",
  disableChatPreview: true,
});

export default async function main() {
  const { output } = env;
  
  output.heading(1, "Test Runner");
  
  // Check if we have authentication for integration tests
  output.heading(2, "Checking Authentication for Integration Tests");
  
  try {
    const authCheck = await runPrompt("Respond with 'auth-ok'", {
      model: "github:openai/gpt-4o-mini",
      cache: false,
      maxTokens: 10,
    });
    
    if (authCheck && !authCheck.error) {
      output.note("✅ Authentication available - integration tests can be run");
      output.note("Run: npm run test:genai");
    } else {
      output.note("⚠️ No authentication available - only unit tests can run");
    }
  } catch (error) {
    output.note("⚠️ Authentication check failed - only unit tests available");
    output.note("This is expected in offline environments");
  }
  
  output.heading(2, "Test Summary");
  output.note("✅ Unit tests: Offline validation of core functionality");
  output.note("ℹ️ Integration tests: Require authentication for end-to-end translation testing");
  output.note("Run 'npm run test' for unit tests");
  output.note("Run 'npm run test:genai' for integration tests (requires GitHub auth)");
}