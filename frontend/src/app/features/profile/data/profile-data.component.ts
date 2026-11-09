import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-data',
  imports: [],
  templateUrl: './profile-data.component.html',
  styleUrl: './profile-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDataComponent {}
