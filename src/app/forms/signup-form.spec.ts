import { TestBed } from '@angular/core/testing';
import SignupForm from './signup-form';

async function setup() {
  const fixture = TestBed.createComponent(SignupForm);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const inputs = () => Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
  const [name, mail, age, terms] = inputs();
  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };
  const submit = () => el.querySelector('button[type="submit"]') as HTMLButtonElement;
  return { fixture, el, name, mail, age, terms, type, submit };
}

describe('SignupForm (Signal Forms)', () => {
  it('adds native attributes and starts invalid', async () => {
    const { el, name, submit } = await setup();
    expect(el.querySelector('form')?.hasAttribute('novalidate')).toBe(true);
    expect(name.required).toBe(true);
    expect(submit().disabled).toBe(true);
  });

  it('shows the custom minLength message after touch', async () => {
    const { el, name, type } = await setup();
    await type(name, 'Al');
    expect(el.textContent).toContain('At least 3 characters.');
    expect(el.textContent).not.toContain('Name is required.');
  });

  it('submits a typed value (age is a number) through the submission action', async () => {
    const { el, name, mail, age, terms, type, submit, fixture } = await setup();
    await type(name, 'Aisha');
    await type(mail, 'aisha@example.com');
    await type(age, '25');
    terms.click();
    await fixture.whenStable();
    expect(submit().disabled).toBe(false);
    submit().click();
    await new Promise((r) => setTimeout(r, 900));
    await fixture.whenStable();
    expect(el.textContent).toContain('{"name":"Aisha","email":"aisha@example.com","age":25,"terms":true}');
  });

  it('model.set updates every input', async () => {
    const { el, name, mail, age, terms, fixture } = await setup();
    (Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes('Load Ravi')) as HTMLButtonElement).click();
    await fixture.whenStable();
    expect([name.value, mail.value, age.value, terms.checked]).toEqual(['Ravi', 'ravi@example.com', '30', true]);
  });
});
