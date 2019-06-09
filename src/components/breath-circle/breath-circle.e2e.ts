
import { newE2EPage } from '@stencil/core/testing';

describe('mood-circumplex', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<mood-circumplex></mood-circumplex>');
    const element = await page.find('mood-circumplex');
    expect(element).toHaveClass('hydrated');
  });

});
