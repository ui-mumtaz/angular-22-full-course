import { TestBed } from '@angular/core/testing';
import CheckoutForm from './checkout-form';

async function setup() {
  const fixture = TestBed.createComponent(CheckoutForm);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const input = (name: string) => el.querySelector(`[formControlName="${name}"]`) as HTMLInputElement;
  const type = async (name: string, value: string) => {
    input(name).value = value;
    input(name).dispatchEvent(new Event('input'));
    input(name).dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };
  const button = (text: string) => Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes(text)) as HTMLButtonElement;
  const fill = async () => {
    await type('name', 'Aisha');
    await type('email', 'aisha@example.com');
    await type('city', 'Mumbai');
    await type('pin', '411001');
    await type('qty', '3');
  };
  return { fixture, el, input, type, button, fill };
}

describe('CheckoutForm (reactive)', () => {
  it('starts invalid and shows field errors', async () => {
    const { el, type, button } = await setup();
    expect(button('Place order').disabled).toBe(true);
    await type('name', 'Al');
    await type('pin', '4110');
    expect(el.textContent).toContain('At least 3 characters.');
    expect(el.textContent).toContain('PIN code: 6 digits.');
  });

  it('computes the live total from valueChanges', async () => {
    const { el, fill } = await setup();
    await fill();
    expect(el.textContent).toContain('Total: ₹1497');
  });

  it('places the order with getRawValue(), even when email is disabled', async () => {
    const { el, fill, button, fixture } = await setup();
    await fill();
    button('Gift').click();
    await fixture.whenStable();
    button('Place order').click();
    await fixture.whenStable();
    expect(el.textContent).toContain('"email":"aisha@example.com"');
    expect(el.textContent).toContain('"qty":3');
  });

  it('resets back to the start values, not null', async () => {
    const { el, fill, button, fixture, input } = await setup();
    await fill();
    button('Reset').click();
    await fixture.whenStable();
    expect(input('qty').value).toBe('1');
    expect(input('name').value).toBe('');
    expect(el.textContent).toContain('Total: ₹499');
  });
});
