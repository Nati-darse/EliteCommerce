import { mergeTests } from '@playwright/test'
import { test as authTest } from './auth.fixture'
import { test as dataTest } from './test-data.fixture'

// One import gives you all fixtures
export const test = mergeTests(authTest, dataTest)
export { expect } from '@playwright/test'