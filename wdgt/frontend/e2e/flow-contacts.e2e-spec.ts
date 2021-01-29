import { ContactsPage } from './contacts.po';
import { FeedbackTypeSelectPage } from './feedback-type-select.po';
import { RecordTypePage } from './record-type.po';
import { ChatPage } from './chat.po';
import { SummaryPage } from './summary.po';
import { FinalPage } from './final.po';

import { protractor, browser, by, element, ElementFinder } from 'protractor';

describe('improveapp contacts flow', () => {
  const EC = protractor.ExpectedConditions;

  beforeEach(() => {
  });

  it('should goto record type', async () => {
    const contactsPage = new ContactsPage();
    contactsPage.navigateTo();
    await browser.wait(EC.urlContains('record-type'), 5000);
  });

  it('should wallpaper be 3back', async () => {
    const recordTypePage = new RecordTypePage();
    expect((await recordTypePage.getWalpaper().getAttribute('src'))).toEqual('http://localhost:4200/assets/img/backgrounds/3back.jpg');
  });

  it('should goto chat', async () => {
    const recordTypePage = new RecordTypePage();
    await browser.wait(EC.elementToBeClickable(recordTypePage.getTextButton()), 5000);
    await recordTypePage.getTextButton().click();
    await browser.wait(EC.urlContains('chat'), 5000);
  });

  it('should avatar be 3back', async () => {
    const chatPage = new ChatPage();
    await browser.wait(EC.textToBePresentInElement(chatPage.getMessagesList(), 'Hi'), 30000);
    expect((await chatPage.getAvatar().getAttribute('style'))).toEqual('background-image: url("/assets/img/chat-avatar-3back.png");');
  });

  it('should show suggests in s&s', async () => {
    const chatPage = new ChatPage();
    await browser.wait(EC.visibilityOf(chatPage.getSAndSInput()), 30000);
    await ensureCorrectInput(chatPage.getSAndSInput(), 'Engine');

    await browser.sleep(2000);

    await browser.wait(EC.presenceOf(chatPage.getSuggestFirstValue()), 5000);
    expect((await chatPage.getSuggestFirstValue().getText()).toLowerCase()).toEqual('engine');
  });

  it('should accept suggest', async () => {
    const chatPage = new ChatPage();
    await chatPage.getSendButton().click();
    await browser.wait(
      EC.textToBePresentInElement(
        chatPage.getMessagesList(),
        'Alright, could you please tell me some more about it. The more details you provide, the better.'
      ), 30000
    );
  });

  it('should enter details', async () => {
    const chatPage = new ChatPage();
    await browser.wait(EC.visibilityOf(chatPage.getChatInput()), 30000);
    await browser.sleep(2000);
    await browser.wait(EC.elementToBeClickable(chatPage.getSendButton()), 30000);
    await ensureCorrectInput(chatPage.getChatInput(), 'Engine noise');
    await chatPage.getSendButton().click();
    await browser.wait(
      EC.textToBePresentInElement(
        chatPage.getMessagesList(),
        'What is the current milage of your car?'
      ), 30000
    );
  });

  it('should skip car milage', async () => {
    const chatPage = new ChatPage();
    await browser.wait(EC.visibilityOf(chatPage.getDontKnowChatButton()), 30000);
    await browser.sleep(2000);
    await browser.wait(EC.elementToBeClickable(chatPage.getDontKnowChatButton()), 30000);
    await chatPage.getDontKnowChatButton().click();
    await browser.wait(EC.textToBePresentInElement(chatPage.getMessagesList(), 'Ok, no problem. We are almost done now.'), 30000);
  });

  it('should enter name', async () => {
    const chatPage = new ChatPage();

    await browser.wait(
      EC.textToBePresentInElement(
        chatPage.getMessagesList(),
        'Please enter your contact details (name & email) below so we can get in touch with you if any additional information is required.'
      ), 30000
    );
    await browser.wait(EC.visibilityOf(chatPage.getExtraInfoInput()), 30000);
    await ensureCorrectInput(chatPage.getExtraInfoInput(), 'John Doe');
    await browser.wait(EC.visibilityOf(chatPage.getSendButton()), 30000);
    await chatPage.getSendButton().click();
    await browser.wait(EC.textToBePresentInElement(chatPage.getMessagesList(), 'now please enter your email address.'), 30000);
  });

  it('should enter email', async () => {
    const chatPage = new ChatPage();

    await browser.wait(EC.visibilityOf(chatPage.getExtraInfoInput()), 30000);
    await ensureCorrectInput(chatPage.getExtraInfoInput(), 'susanabrodgers@gmail.com');
    // susanabrodgers@gmail.com:crawler2017_1
    await browser.wait(EC.visibilityOf(chatPage.getSendButton()), 30000);
    await chatPage.getSendButton().click();
    await browser.wait(EC.textToBePresentInElement(chatPage.getMessagesList(), 'Perfect, thanks!'), 30000);
  });

  it('should done', async () => {
    const chatPage = new ChatPage();

    await browser.wait(EC.visibilityOf(chatPage.getDoneButton()), 30000);
    await browser.sleep(2000);
    await browser.wait(EC.elementToBeClickable(chatPage.getDoneButton()), 30000);
    await chatPage.getDoneButton().click();
    await browser.wait(EC.urlContains('summary'), 5000);
  });

  it('should send feedback', async () => {
    const summaryPage = new SummaryPage();

    await browser.wait(EC.visibilityOf(summaryPage.getSendButton()), 30000);
    await browser.wait(EC.elementToBeClickable(summaryPage.getSendButton()), 30000);
    await summaryPage.getSendButton().click();
    await browser.wait(EC.urlContains('final'), 5000);
  });

  it('should be name on final page', async () => {
    const finalPage = new FinalPage();

    await browser.wait(EC.presenceOf(finalPage.getNameTitle()), 5000);
    expect((await finalPage.getNameTitle().getText()).toLowerCase().trim()).toEqual('john doe');
  });
});

function ensureCorrectInput(inputEl: ElementFinder, value: string) {
  inputEl.clear();
  inputEl.sendKeys(value);
  return inputEl.getAttribute('value').then(expectedValue => {
    if (expectedValue !== value) {
      return ensureCorrectInput(inputEl, value);
    } else {
      return Promise.resolve();
    }
  });
}
