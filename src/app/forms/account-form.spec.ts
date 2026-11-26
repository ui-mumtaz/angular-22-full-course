import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import AccountForm from './account-form';
import { matchPasswords, noSpaces } from './validators';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function setup() {
  TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
  const fixture = TestBed.createComponent(AccountForm);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const [username, password, confirm, business, gst] = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
  const type = async (input: HTMLInputElement, value: string, ms = 0) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    if (ms) await wait(ms);
    fixture.detectChanges();
    await fixture.whenStable();
  };
  return { fixture, el, username, password, confirm, business, gst, type, http: TestBed.inject(HttpTestingController) };
}

describe('AccountForm (validation)', () => {
  it('custom rule: no spaces in the username (after the debounce)', async () => {
    const { el, username, type } = await setup();
    await type(username, 'ali khan', 500);
    expect(el.textContent).toContain('No spaces allowed.');
  });

  it('server rule: a taken username', async () => {
    const { el, username, http, fixture } = await setup();
    username.value = 'emilys';
    username.dispatchEvent(new Event('input'));
    await wait(500);                       // debounce(400); don't use whenStable: it waits for the pending request
    fixture.detectChanges();
    const req = http.expectOne((r) => r.url.includes('users/filter?key=username&value=emilys'));
    expect(el.textContent).toContain('Checking…');
    req.flush({ users: [{ id: 1 }], total: 1 });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.textContent).toContain('This username is taken.');
  });

  it('cross-field rule: passwords must match', async () => {
    const { el, password, confirm, type } = await setup();
    await type(password, 'secret123');
    await type(confirm, 'secret12');
    expect(el.textContent).toContain("Passwords don't match.");
    await type(confirm, 'secret123');
    expect(el.textContent).not.toContain("Passwords don't match.");
  });

  it('conditional rule: GST only for businesses', async () => {
    const { el, business, fixture } = await setup();
    expect(el.textContent).not.toContain('GST number is required for businesses.');
    business.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.textContent).toContain('GST number is required for businesses.');
  });
});

describe('reactive ValidatorFns', () => {
  it('noSpaces on a control', () => {
    expect(new FormControl('ali khan', [noSpaces]).errors).toEqual({ noSpaces: true });
  });

  it('matchPasswords on the group (the error lives on the group)', () => {
    const g = new FormGroup({ password: new FormControl('secret123'), confirm: new FormControl('secret12') }, { validators: matchPasswords });
    expect(g.errors).toEqual({ mismatch: true });
    expect(g.controls.confirm.errors).toBeNull();
  });
});
