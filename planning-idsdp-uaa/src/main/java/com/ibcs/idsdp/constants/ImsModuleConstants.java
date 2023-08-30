package com.ibcs.idsdp.constants;

public interface ImsModuleConstants extends ApiConstants {
    String IMS_MODULE_ENDPOINT = PRIVATE_API_ENDPOINT + "/ims-module/";
    String FAQ_ENDPOINT = PRIVATE_API_ENDPOINT + "/faq/";
    String GUIDELINE_ENDPOINT = PRIVATE_API_ENDPOINT + "/guideline/";
    String RESOURCES_ENDPOINT = PRIVATE_API_ENDPOINT + "/resources/";
    String NOTICE_ENDPOINT = PRIVATE_API_ENDPOINT + "/notice/";

    String HELP_ENDPOINT = PRIVATE_API_ENDPOINT + "/help/";
    String SEARCH_NOTICE = "search-by-notice";
    String GET_ACTIVE_LIST = "get-active-list";
    String GET_DEVELOPMENT_MODULE_LIST = "get-development_module-list";
    String SEARCH_BY_QUESTION = "search-by-question";
    String SEARCH_BY_QUESTION_PAGEABLE = "search-by-question-pageable";
    String GET_ACTIVE_LIST_BY_MODULE_ID = "get-active-list-by-module-id";
    String SEARCH_RESOURCES = "search-resources";
    String GET_FILTER_LIST = "get-filter-list";
    String GET_ALL_MODULE = "get-all-module";
    String APPLY_PAGE_FILTER = "apply-page-filter";
    String GET_YEAR_LIST_BY_CATEGORY = "get-year-list-by-category";
    String GET_MONTH_LIST_BY_YEAR = "get-month-list-by-year";

}
