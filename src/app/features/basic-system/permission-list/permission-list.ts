import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-permission-list',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.scss',
})
export class PermissionList {
  protected readonly searchForm = new FormGroup({
    siteCode: new FormControl<string>('', [Validators.required]),
    userCode: new FormControl<string>('', [Validators.required, Validators.pattern(/^\d+$/)]),
    dateRange: new FormControl<Date[] | null>(null, [Validators.required]),
  });

  constructor() {
    this.searchForm.controls.siteCode.setValue('2255');
    this.setDefaultDateRange();
  }

  private setDefaultDateRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.searchForm.controls.dateRange.setValue([firstDay, lastDay]);
  }

  protected onSubmit() {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      const dateRange = formValue.dateRange;

      console.log('表單資料:', {
        siteCode: formValue.siteCode,
        userCode: formValue.userCode,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
      });
      // 在這裡處理送出邏輯
    } else {
      console.log('表單驗證失敗');
      // 標記所有欄位為 touched，顯示錯誤訊息
      Object.keys(this.searchForm.controls).forEach((key) => {
        this.searchForm.get(key)?.markAsTouched();
      });
    }
  }

  protected onReset() {
    this.searchForm.reset();
    this.searchForm.controls.siteCode.setValue('2255');
    this.setDefaultDateRange();
  }
}
