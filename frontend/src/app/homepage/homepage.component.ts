import { Component } from '@angular/core';
import * as ExifReader from 'exifreader';
import { Navbar } from './navbar/navbar.component';
import { Map } from './map/map.component';
import { UploadPhotoButton } from './upload-photo-button/upload-photo-button.component';

@Component({
  selector: 'homepage',
  imports: [Navbar, Map, UploadPhotoButton],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class Homepage {}
