import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class Navbar {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const menu = document.querySelector('.menu') as HTMLElement;
    menu.style.display = this.menuOpen ? 'block' : 'none';
  }
}
