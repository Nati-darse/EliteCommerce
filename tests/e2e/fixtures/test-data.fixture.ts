import { test as base } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client for test data management
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // service role — bypasses RLS
)

type TestDataFixtures = {
  testUser: { email: string; id: string }
}

export const test = base.extend<TestDataFixtures>({
  testUser: async ({}, use) => {
    // Create a test user before the test
    const email = `test-${Date.now()}@elitecommerce.test`
    const password = 'TestPassword123!'

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) throw new Error(`Failed to create test user: ${error.message}`)

    // Run the test with the user available
    await use({ email, id: data.user.id })

    // afterEach equivalent — delete user after test
    await supabase.auth.admin.deleteUser(data.user.id)
  },
})