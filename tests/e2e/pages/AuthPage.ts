import { Page, Locator,  expect } from '@playwright/test';

export class AuthPage {

  readonly page : Page
  readonly emailInput: Locator 
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly successMessage: Locator

  constructor (page: Page ) {
    this.page = page 
    this.emailInput=page.getByLabel('email')
    this.passwordInput= page.getByLabel('password ')
    this.submitButton =page.getByRole('button', {name : /sign in|sign up/i})
        this.errorMessage = page.getByTestId('auth-error')
    this.successMessage = page.getByTestId('auth-success')
  
  }

  async gotoLogin(){
    await this.page.goto('/login')
  }

  async gotoSignup(){
    await this.page.goto('/signup')
  }

  async login (email: string, password: string){
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
 
  async signup( email:string, password: string){
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }
 
  async expectRedirectTo(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path))
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible()
  }

}