import { HttpClient, HttpResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { IUserPrivilege } from "app/entities/user-privilege/user-privilege.model";
import { IPrivilege, UserPrivilege } from "../privilege.model";

export type EntityResponseType = HttpResponse<IPrivilege>;
export type EntityArrayResponseType = HttpResponse<IPrivilege[]>;

@Injectable({ providedIn: "root" })
export class PrivilegeService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl =
    this.applicationConfigService.getEndpointFor("api/privileges");

  grant(userPrivilege: UserPrivilege): Observable<HttpResponse<IUserPrivilege>> {
    return this.http.post<IUserPrivilege>(this.resourceUrl, userPrivilege, {
      observe: "response",
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPrivilege>(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPrivilege[]>(this.resourceUrl, {
      params: options,
      observe: "response",
    });
  }
}
