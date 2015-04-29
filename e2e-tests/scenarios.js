'use strict';

describe('MonkeyApp', function() {
  browser.get('index.html');

  //checks, that application can open basic page '/'
  it('should automatically redirect to / when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
    expect(browser.getTitle()).toMatch(/Monkey App$/);
  });

});

describe('Home page functionality', function() {

  var addButton, successfulCreation, errorMessage, infoMessage, creationForm;
  beforeEach(function() {
    browser.get('index.html');
    addButton = element(by.name('addButton')).getAttribute('value');
    successfulCreation = element(by.name('successfulCreation'));
    errorMessage = element(by.name('errorMessage'));
    infoMessage = element(by.name('infoMessage'));
    creationForm = element(by.name('creationForm'));
    });

  afterEach(function() {
    //TODO: delete added data 
  });

  it('should show sign in button and infoMessage and hide errorMessage and successfulCreation element', function() {
    expect(addButton).toMatch('Add new monkey');
    expect((successfulCreation).isDisplayed()).not.toBeTruthy();
    expect((errorMessage).isDisplayed()).not.toBeTruthy();
    expect((infoMessage).isDisplayed()).toBeTruthy();
    expect((creationForm).isDisplayed()).toBeTruthy();
  });

  it('should add new monkey, if at least name and email added', function() {
    element(by.name('name')).sendKeys('e2e test monkey 5');
    element(by.name('email')).sendKeys('email5@monkey.com');
    element(by.name('addButton')).click();
    expect((successfulCreation).isDisplayed()).toBeTruthy();
    expect((errorMessage).isDisplayed()).not.toBeTruthy();
    expect((infoMessage).isDisplayed()).not.toBeTruthy();
    expect((creationForm).isDisplayed()).not.toBeTruthy();
  });

  it('should show error, if email already exists', function() {
    element(by.name('name')).sendKeys('another test monkey 3');
    element(by.name('email')).sendKeys('another3@monkey.com');
    element(by.name('addButton')).click();
    browser.waitForAngular();
    element(by.name('addAnother')).click();
    element(by.name('name')).sendKeys('another test monkey 3');
    element(by.name('email')).sendKeys('another3@monkey.com');
    element(by.name('addButton')).click();
    expect((errorMessage).isDisplayed()).toBeTruthy();
    expect(errorMessage.getText()).toMatch('Monkey with this email is already added to jungle. Use another email.');

  });

});