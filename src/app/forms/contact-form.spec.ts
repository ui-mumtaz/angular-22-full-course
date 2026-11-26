import { TestBed } from '@angular/core/testing';
import ContactForm from './contact-form';

async function setup() {
  const fixture = TestBed.createComponent(ContactForm);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const input = (name: string) => el.querySelector(`[name="${name}"]`) as HTMLInputElement;
  const type = async (name: string, value: string) => {
    input(name).value = value;
    input(name).dispatchEvent(new Event('input'));
    input(name).dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };
  const button = () => el.querySelector('button[type="submit"]') as HTMLButtonElement;
  return { fixture, el, input, type, button };
}

describe('ContactForm (template-driven)', () => {
  it('starts invalid with the Send button disabled', async () => {
    const { input, button } = await setup();
    expect(button().disabled).toBe(true);
    expect(input('name').classList).toContain('ng-untouched');
    expect(input('name').classList).toContain('ng-invalid');
  });

  it('shows the minlength error after the field is touched', async () => {
    const { el, type } = await setup();
    await type('name', 'Al');
    expect(el.textContent).toContain('At least 3 characters (2/3).');
  });

  it('submits f.value and resets the form', async () => {
    const { el, type, button, input, fixture } = await setup();
    await type('name', 'Aisha');
    await type('email', 'aisha@example.com');
    expect(button().disabled).toBe(false);
    button().click();
    await fixture.whenStable();
    expect(el.textContent).toContain('"name":"Aisha"');
    expect(input('name').value).toBe('');
    expect(input('name').classList).toContain('ng-untouched');
  });
});
