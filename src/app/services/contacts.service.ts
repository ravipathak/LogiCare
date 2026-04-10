import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

export type ContactStatus = 'Active' | 'Inactive';

export interface ContactRow {
  locationName: string;
  contactName: string;
  phone: string;
  email: string;
  status: ContactStatus;
}

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly http = inject(HttpClient);

  private readonly contactsShared$ = this.http
    .get<ContactRow[]>(environment.endpoints.contacts)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getContacts(): Observable<ContactRow[]> {
    return this.contactsShared$;
  }
}
