import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { PracticeMenuSection } from '../../models/practice.models';
import { PracticeStoreService } from '../../services/practice-store.service';

@Component({
  selector: 'app-menu-config',
  standalone: false,
  templateUrl: './menu-config.component.html',
  styleUrls: ['./menu-config.component.scss']
})
export class MenuConfigComponent implements OnInit {
  sections: PracticeMenuSection[] = [];

  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: PracticeStoreService
  ) {
    this.form = this.fb.nonNullable.group({
      sectionId: ['', Validators.required],
      label: ['', [Validators.required, Validators.minLength(2)]],
      path: ['', [Validators.required, Validators.pattern('^/.+')]],
      active: [false]
    });
  }

  ngOnInit(): void {
    this.store.menu$.subscribe((sections) => {
      this.sections = sections;

      if (!this.form.value.sectionId && sections.length > 0) {
        this.form.patchValue({ sectionId: sections[0].id });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();
    this.store.addMenuItem(values.sectionId, {
      label: values.label,
      path: values.path,
      active: values.active
    });

    this.form.patchValue({
      label: '',
      path: '',
      active: false
    });
  }
}
