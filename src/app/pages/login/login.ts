import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
// material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');

  isFormValid = computed(() =>
    this.username().length >= 3 && this.password().length >= 6
  );

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit() {
    if (this.isFormValid()) {
      // 清除之前的錯誤訊息
      this.errorMessage.set('');

      const result = this.authService.login(this.username(), this.password());

      if (result.success) {
        // 登入成功後導向主系統
        this.router.navigate(['/main']);
      } else {
        // 顯示錯誤訊息
        this.errorMessage.set(result.message || '登入失敗');
      }
    }
  }
}