'use strict';

describe('MonkeyApp, Homepage functionality', function() {
    browser.get('index.html');

    //checks, that application can open basic page '/'
    it('should automatically redirect to / when location hash/fragment is empty', function() {
      
        expect(browser.getLocationAbsUrl()).toMatch("/");
        expect(browser.getTitle()).toMatch(/Monkey App$/);
    });

});

describe('Creation of new monkey', function() {

    var addButton, successfulCreation, errorMessage, infoMessage, creationForm;
    beforeEach(function() {

        browser.get('index.html');
        addButton = element(by.name('addButton')).getAttribute('value');
        successfulCreation = element(by.name('successfulCreation'));
        errorMessage = element(by.name('errorMessage'));
        infoMessage = element(by.name('infoMessage'));
        creationForm = element(by.name('creationForm'));
    });

    it('should show sign in button and hide errorMessage, infoMessage and successfulCreation element', function() {

        expect(addButton).toMatch('Add new monkey');
        expect((successfulCreation).isDisplayed()).not.toBeTruthy();
        expect((errorMessage).isDisplayed()).not.toBeTruthy();
        expect((infoMessage).isDisplayed()).not.toBeTruthy();
        expect((creationForm).isDisplayed()).toBeTruthy();
    });

    it('should show infoMessage, if user try to add monkey without name or email', function() {

        element(by.name('name')).sendKeys('e2e test monkey');
        element(by.name('addButton')).click();
        expect((infoMessage).isDisplayed()).toBeTruthy();
        element(by.name('name')).clear();
        element(by.name('email')).sendKeys('email@monkey.com');
        element(by.name('addButton')).click();
        expect((infoMessage).isDisplayed()).toBeTruthy();
        element(by.name('email')).clear();
    });

    it('should add new monkey, if at least name and email added', function() {
        element(by.name('name')).sendKeys('e2e test monkey');
        element(by.name('email')).sendKeys('email@monkey.com');
        element(by.name('addButton')).click();
        expect((successfulCreation).isDisplayed()).toBeTruthy();
        expect((errorMessage).isDisplayed()).not.toBeTruthy();
        expect((infoMessage).isDisplayed()).not.toBeTruthy();
        expect((creationForm).isDisplayed()).not.toBeTruthy();
    });

    it('should show error, if email already exists', function() {
        element(by.name('name')).sendKeys('test monkey');
        element(by.name('email')).sendKeys('another@monkey.com');
        element(by.name('addButton')).click();
        browser.waitForAngular();
        element(by.name('addAnother')).click();
        element(by.name('name')).sendKeys('another test monkey');
        element(by.name('email')).sendKeys('another@monkey.com');
        element(by.name('addButton')).click();
        expect((errorMessage).isDisplayed()).toBeTruthy();
        expect(errorMessage.getText()).
            toMatch('Monkey with this email is already added to jungle. Use another email.');
    });

    it('should create new monkey with all fields filled in or changed', function() {
        element(by.name('name')).sendKeys('e2e test orangutan');
        element(by.name('email')).sendKeys('orangutan@email.com');
        element(by.name('age')).sendKeys('4');
        element(by.name('species')).sendKeys('3');
        element(by.name('addButton')).click();
        expect((successfulCreation).isDisplayed()).toBeTruthy();
    });

});

describe('Editing and deleting of created monkey', function() {

    beforeEach(function() {
        browser.get('index.html');
    });

    it('should show values of created monkey in disabled form fields and hide errorMessage and infoMessage', function() {
        element(by.name('name')).sendKeys('e2e test chimpanzee');
        element(by.name('email')).sendKeys('chimpanzee@email.com');
        element(by.name('age')).sendKeys('3');
        element(by.name('species')).sendKeys('5');
        element(by.name('addButton')).click();
        browser.waitForAngular();
        element(by.name('checkProfile')).click();
        browser.waitForAngular();
        expect(browser.getLocationAbsUrl()).toMatch("/monkey/chimpanzee@email.com");
        expect(element(by.name('errorMessage')).isDisplayed()).not.toBeTruthy();
        expect(element(by.name('infoMessage')).isDisplayed()).not.toBeTruthy();
        expect(element(by.name('name')).isEnabled()).not.toBeTruthy();
        expect(element(by.name('email')).isEnabled()).not.toBeTruthy();
        expect(element(by.name('age')).isEnabled()).not.toBeTruthy();
        expect(element(by.name('species')).isEnabled()).not.toBeTruthy();
    });

    it('should enable all fields except email, when press Edit Profile button', function() {
        element(by.name('name')).sendKeys('e2e test another chimpanzee');
        element(by.name('email')).sendKeys('another@chimp.com');
        element(by.name('age')).sendKeys('4');
        element(by.name('species')).sendKeys('5');
        element(by.name('addButton')).click();
        browser.waitForAngular();
        element(by.name('checkProfile')).click();
        browser.waitForAngular();
        element(by.name('startEditing')).click();
        expect(element(by.name('name')).isEnabled()).toBeTruthy();
        expect(element(by.name('email')).isEnabled()).not.toBeTruthy();
        expect(element(by.name('age')).isEnabled()).toBeTruthy();
        expect(element(by.name('species')).isEnabled()).toBeTruthy();
    });

});




