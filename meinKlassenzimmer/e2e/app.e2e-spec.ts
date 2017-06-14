import { MeinKlassenzimmerPage } from './app.po';

describe('mein-klassenzimmer App', () => {
  let page: MeinKlassenzimmerPage;

  beforeEach(() => {
    page = new MeinKlassenzimmerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
