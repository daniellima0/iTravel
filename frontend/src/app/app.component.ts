import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Homepage } from './homepage/homepage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Homepage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
