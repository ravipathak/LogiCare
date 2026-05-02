import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { map } from 'rxjs';

import { ContactsService } from '../../services/contacts.service';
import { DepartmentsService } from '../../services/departments.service';
import { GroupsService } from '../../services/groups.service';
import { LocationsService } from '../../services/locations.service';
import { PageLoaderService } from '../../services/page-loader.service';
import { ContactsTabComponent } from './tabs/contacts-tab.component';
import { DepartmentsTabComponent } from './tabs/departments-tab.component';
import { GroupsTabComponent } from './tabs/groups-tab.component';
import { LocationsTabComponent } from './tabs/locations-tab.component';
import { SetupStatCardComponent } from './components/setup-stat-card/setup-stat-card.component';

@Component({
  selector: 'app-client-setup',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule,
    SetupStatCardComponent,
    LocationsTabComponent,
    ContactsTabComponent,
    DepartmentsTabComponent,
    GroupsTabComponent,
  ],
  templateUrl: './client-setup.component.html',
  styleUrl: './client-setup.component.scss',
})
export class ClientSetupComponent {
  private readonly locationsService = inject(LocationsService);
  private readonly contactsService = inject(ContactsService);
  private readonly departmentsService = inject(DepartmentsService);
  private readonly groupsService = inject(GroupsService);
  private readonly pageLoader = inject(PageLoaderService);

  /** 0 = Locations, 1 = Contacts, 2 = Departments, 3 = Groups */
  selectedTabIndex = 0;

  readonly locationCount$ = this.locationsService.getLocations().pipe(map(rows => rows.length));

  readonly contactCount$ = this.contactsService.getContacts().pipe(map(rows => rows.length));

  readonly departmentCount$ = this.departmentsService.getDepartments().pipe(map(rows => rows.length));

  readonly groupCount$ = this.groupsService.getGroups().pipe(map(rows => rows.length));

  onTabSelected(index: number): void {
    if (this.selectedTabIndex === index) {
      return;
    }
    this.selectedTabIndex = index;
    this.pageLoader.flash(1100);
  }
}
