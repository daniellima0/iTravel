import { Component } from '@angular/core';
import { Navbar } from "./navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  imports: [Navbar],
})
export class Homepage {}
