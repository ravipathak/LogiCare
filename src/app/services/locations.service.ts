import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

import { environment } from '../../environments/environment';

export type LocationStatus = 'Active' | 'Inactive';

export interface LocationRow {
  locationName: string;
  description: string;
  status: LocationStatus;
}

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly http = inject(HttpClient);

  /** Shared stream so summary + grid (and other consumers) share one HTTP call. */
  private readonly locationsShared$ = this.http
    .get<LocationRow[]>(environment.endpoints.locations)
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  /**
   * Switch to real API by changing `environment.endpoints.locations`
   * (or set it to `${environment.apiUrl}/...`).
   */
  getLocations(): Observable<LocationRow[]> {
    return this.locationsShared$;
  }
}

