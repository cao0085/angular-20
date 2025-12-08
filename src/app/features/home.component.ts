import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="home-container">
      <div class="welcome-section">
        <h1>歡迎來到 NPCS 系統</h1>
        <p class="subtitle">Neighborhood Parking Control System</p>
      </div>
    </div>
  `,
    styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 60px;
    }

    .welcome-section .icon {
      font-size: 80px;
      margin-bottom: 20px;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    .welcome-section h1 {
      color: #2c3e50;
      font-size: 36px;
      font-weight: 600;
      margin: 0 0 10px 0;
    }

    .welcome-section .subtitle {
      color: #7f8c8d;
      font-size: 18px;
      margin: 0;
    }

    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      text-align: center;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .card-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .card h3 {
      color: #2c3e50;
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 10px 0;
    }

    .card p {
      color: #7f8c8d;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }
  `]
})
export class HomeComponent { }
