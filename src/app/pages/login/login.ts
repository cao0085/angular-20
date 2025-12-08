import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
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
        this.router.navigate(['']);
      } else {
        // 顯示錯誤訊息
        this.errorMessage.set(result.message || '登入失敗');
      }
    }
  }
}