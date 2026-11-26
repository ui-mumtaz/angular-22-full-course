import { TestBed } from '@angular/core/testing';
import OrderForm from './order-form';
import SurveyForm from './survey-form';

async function order() {
  const fixture = TestBed.createComponent(OrderForm);
  await fixture.whenStable();
  const el = fixture.nativeElement as HTMLElement;
  const summary = () => el.querySelector('.summary')!.textContent!.trim();
  const products = () => Array.from(el.querySelectorAll('input[placeholder="Product"]')) as HTMLInputElement[];
  const qtys = () => Array.from(el.querySelectorAll('input[type="number"]')) as HTMLInputElement[];
  const click = async (text: string, nth = 0) => {
    (Array.from(el.querySelectorAll('button')).filter((b) => b.textContent?.includes(text))[nth] as HTMLButtonElement).click();
    await fixture.whenStable();
  };
  const type = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
  };
  return { el, summary, products, qtys, click, type };
}

describe('OrderForm (dynamic rows)', () => {
  it('adds a line with its rules applied', async () => {
    const { el, summary, click } = await order();
    expect(summary()).toBe('1 lines · 1 items · valid=true');
    await click('Add line');
    expect(summary()).toBe('2 lines · 2 items · valid=false');
    expect(el.textContent).toContain('Product is required.');
  });

  it('removing the middle line keeps values and errors on the right rows', async () => {
    const { el, summary, products, qtys, click, type } = await order();
    await click('Add line');
    await type(products()[1], 'Calvin Klein CK One');
    await type(qtys()[1], '3');
    await click('Add line');
    await type(products()[2], 'Mascara');
    await type(qtys()[2], '0');
    expect(summary()).toBe('3 lines · 4 items · valid=false');
    await click('✕', 1);                                  // remove the MIDDLE line
    expect(products().map((p) => p.value)).toEqual(['Red Nail Polish', 'Mascara']);
    expect(qtys().map((q) => q.value)).toEqual(['1', '0']);
    expect(el.textContent).toContain('At least 1.');
    expect(summary()).toBe('2 lines · 1 items · valid=false');
  });
});

describe('SurveyForm (fields from config)', () => {
  it('renders the configured inputs, required only where configured', async () => {
    const fixture = TestBed.createComponent(SurveyForm);
    await fixture.whenStable();
    const inputs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('input')) as HTMLInputElement[];
    expect(inputs.map((i) => i.type)).toEqual(['text', 'email', 'number']);
    expect(inputs.map((i) => i.required)).toEqual([true, false, false]);
  });
});
