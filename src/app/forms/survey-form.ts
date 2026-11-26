import { Component, signal } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';

interface FieldConfig { key: string; label: string; type: 'text' | 'email' | 'number'; required?: boolean; }

// In a real app this list could come from a server.
const SURVEY: FieldConfig[] = [
  { key: 'city', label: 'City', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'age', label: 'Age', type: 'number' },
];

@Component({
  selector: 'app-survey-form',
  imports: [FormField],
  template: `
    <h2 class="text-xl font-semibold">Survey</h2>
    @for (cfg of survey; track cfg.key) {
      <label class="mt-2 block">
        <span class="text-sm font-medium">{{ cfg.label }}</span>
        <input [type]="cfg.type" [formField]="surveyForm[cfg.key]" class="mt-1 block rounded-lg border border-slate-300 px-3 py-2" />
      </label>
    }
    <p class="mt-2 text-sm text-slate-600">valid={{ surveyForm().valid() }}</p>
  `,
})
export default class SurveyForm {
  protected readonly survey = SURVEY;
  protected readonly model = signal<Record<string, string>>(Object.fromEntries(SURVEY.map((c) => [c.key, ''])));
  protected readonly surveyForm = form(this.model, (s) => {
    for (const cfg of SURVEY) {
      if (cfg.required) required(s[cfg.key]);
    }
  });
}
