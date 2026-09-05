describe('Beta Unlock Flow', () => {
  beforeEach(() => {
    // Inject state to bypass onboarding and splash
    cy.window().then((win) => {
      win.localStorage.setItem('app_state', JSON.stringify({
        state: {
          navCurrentScreen: 'DashboardHome',
          onboardingStep: 5, // Assumed complete
          plan: 'free',
          isBeta: false
        },
        version: 0
      }));
    });
    cy.visit('/');
    // Wait for app to hydrate
    cy.wait(1000);
  });

  it('allows user to enter beta code and unlocks features', () => {
    // Check if we are on Dashboard
    cy.contains('Settings').should('be.visible');
    
    // Navigate to settings
    cy.contains('Settings').click();

    // Enter code
    cy.get('input[placeholder="Enter Code"]').type('LOVEBETA2025');
    cy.contains('Verify').click();

    // Check for success alert or UI change
    cy.on('window:alert', (txt) => {
      expect(txt).to.contains('Success');
    });

    // Check for "Beta Active" badge
    cy.contains('Beta Active').should('be.visible');
  });
});
