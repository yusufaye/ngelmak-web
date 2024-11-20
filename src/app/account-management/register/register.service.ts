import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  save(registration: Registration): Observable<void> {
    return this.http.post<void>(this.applicationConfigService.getEndpointFor('api/register'), registration);
  }
}
