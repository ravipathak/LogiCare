import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface UserRow {
  id: string;
  imageUrl: string | null;
  firstName: string;
  lastName: string;
  roles: string[];
  email: string;
  /** Display string e.g. "26 Mar 24" */
  statusUpdatedOn: string;
  status: 'Active' | 'Inactive';
}

const MOCK_USERS: UserRow[] = [
  {
    id: '1',
    imageUrl: null,
    firstName: 'Afua',
    lastName: 'Doumassi',
    roles: ['Operator'],
    email: 'afua.doumassi@valogicbio.com',
    statusUpdatedOn: '26 Mar 24',
    status: 'Active',
  },
  {
    id: '2',
    imageUrl: null,
    firstName: 'Albina',
    lastName: 'Benson',
    roles: ['Reviewer'],
    email: 'albina.benson@valogicbio.com',
    statusUpdatedOn: '18 Feb 24',
    status: 'Active',
  },
  {
    id: '3',
    imageUrl: null,
    firstName: 'Alexandra',
    lastName: 'Bezilla',
    roles: ['Admin'],
    email: 'alexandra.bezilla@valogicbio.com',
    statusUpdatedOn: '03 Jan 24',
    status: 'Active',
  },
  {
    id: '4',
    imageUrl: null,
    firstName: 'Marcus',
    lastName: 'Chen',
    roles: ['Admin', 'Reviewer', 'Operator', 'SuperAdmin'],
    email: 'marcus.chen@valogicbio.com',
    statusUpdatedOn: '12 Apr 24',
    status: 'Active',
  },
  {
    id: '5',
    imageUrl: null,
    firstName: 'Priya',
    lastName: 'Nair',
    roles: ['Reviewer'],
    email: 'priya.nair@valogicbio.com',
    statusUpdatedOn: '26 Mar 24',
    status: 'Active',
  },
  {
    id: '6',
    imageUrl: null,
    firstName: 'James',
    lastName: 'Ortiz',
    roles: ['Operator'],
    email: 'james.ortiz@valogicbio.com',
    statusUpdatedOn: '01 Mar 24',
    status: 'Inactive',
  },
  {
    id: '7',
    imageUrl: null,
    firstName: 'Sofia',
    lastName: 'Patel',
    roles: ['Admin'],
    email: 'sofia.patel@valogicbio.com',
    statusUpdatedOn: '15 Feb 24',
    status: 'Active',
  },
  {
    id: '8',
    imageUrl: null,
    firstName: 'Daniel',
    lastName: 'Reed',
    roles: ['Operator'],
    email: 'daniel.reed@valogicbio.com',
    statusUpdatedOn: '22 Jan 24',
    status: 'Active',
  },
  {
    id: '9',
    imageUrl: null,
    firstName: 'Elena',
    lastName: 'Volkov',
    roles: ['SuperAdmin'],
    email: 'elena.volkov@valogicbio.com',
    statusUpdatedOn: '08 Apr 24',
    status: 'Active',
  },
  {
    id: '10',
    imageUrl: null,
    firstName: 'Chris',
    lastName: 'Wong',
    roles: ['Reviewer', 'Operator'],
    email: 'chris.wong@valogicbio.com',
    statusUpdatedOn: '19 Dec 23',
    status: 'Active',
  },
  {
    id: '11',
    imageUrl: null,
    firstName: 'Nina',
    lastName: 'Kumar',
    roles: ['Admin'],
    email: 'nina.kumar@valogicbio.com',
    statusUpdatedOn: '05 Nov 23',
    status: 'Inactive',
  },
  {
    id: '12',
    imageUrl: null,
    firstName: 'Oliver',
    lastName: 'Grant',
    roles: ['Operator'],
    email: 'oliver.grant@valogicbio.com',
    statusUpdatedOn: '30 Oct 23',
    status: 'Active',
  },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  getUsers(): Observable<UserRow[]> {
    return of(MOCK_USERS);
  }
}
