import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  BASE_URL : string = environment.ibcs.baseApiEndPoint;
  IMS_MODULE_LIST_URL : string = `${this.BASE_URL}api/ims-module/get-active-list`;
  DEV_MODULE_LIST_URL : string = `${this.BASE_URL}api/ims-module/get-development_module-list`;
  QUESTION_LIST_URL : string = `${this.BASE_URL}api/faq/search-by-question`;
  GUIDELINE_LIST_URL : string = `${this.BASE_URL}api/guideline/get-active-list-by-module-id`;
  SEARCH_RESOURCES : string = `${this.BASE_URL}api/resources/search-resources`;
  RESOURCES_GET_ACTIVE_LIST : string = `${this.BASE_URL}api/resources/get-active-list`;
  RESOURCES_GET_FILTER_LIST : string = `${this.BASE_URL}api/resources/get-filter-list`;
  RESOURCES_GET_YEAR_LIST_BY_CATEGORY : string = `${this.BASE_URL}api/resources/get-year-list-by-category`;
  RESOURCES_GET_MONTH_LIST_BY_YEAR : string = `${this.BASE_URL}api/resources/get-month-list-by-year`;

  constructor(
    private http: HttpClient,
  ) { }

  getImsModuleList(): any {
    return this.http.get(this.IMS_MODULE_LIST_URL);
  }

  getDevModuleList(): any {
    return this.http.get(this.DEV_MODULE_LIST_URL);
  }

  getQuestionList(reqObj): any {
    return this.http.post(this.QUESTION_LIST_URL, reqObj);
  }

  getGuidelineList(moduleId): any {
    return this.http.post(this.GUIDELINE_LIST_URL, moduleId);
  }

  searchResources(data: any): any {
      return this.http.post(this.SEARCH_RESOURCES, data);
  }

  getResourceActiveList(): any {
      return this.http.get(this.RESOURCES_GET_ACTIVE_LIST);
  }

    getResourceFilterList(): any {
        return this.http.get(this.RESOURCES_GET_FILTER_LIST);
    }

    getResourceYearListByCategory(category: string): any {
      return this.http.get(this.RESOURCES_GET_YEAR_LIST_BY_CATEGORY + '/' + category);
    }

    getResourceMonthListByYear(year: string): any {
      return this.http.get(this.RESOURCES_GET_MONTH_LIST_BY_YEAR + '/' + year);
    }

}
