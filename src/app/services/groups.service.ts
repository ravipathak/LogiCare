import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

export type GroupStatus = 'Active' | 'Inactive';

export interface GroupRow {
  groupName: string;
  description: string;
  status: GroupStatus;
}

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly http = inject(HttpClient);

  private readonly groupsShared$ = this.http
    .get<GroupRow[]>(environment.endpoints.groups)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  getGroups(): Observable<GroupRow[]> {
    return this.groupsShared$;
  }
}
