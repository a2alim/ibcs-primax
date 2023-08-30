package com.ibcs.idsdp.constants;

public interface ApiAccessConstants extends ApiConstants {

    String API_ACCESS_ENDPOINTS = PRIVATE_API_ENDPOINT + "/api-endpoints";
    String API_ACCESS_ENDPOINT = PRIVATE_API_ENDPOINT + "/api-endpoint";
    String API_ACCESS_PAGEABLE_ENDPOINT = PRIVATE_API_ENDPOINT + "/apiPageable";
    String APPLY_FILTER = API_ACCESS_ENDPOINT + "/applyFilter";
    String API_BY_ROLE = PRIVATE_API_ENDPOINT + "/api-access-byrole";
    String API_BY_USER_BY_ROLE = PRIVATE_API_ENDPOINT + "/api-access-byuser-byrole";
    String API_ENDPOINT_BY_SUBMODULE = PRIVATE_API_ENDPOINT + "/api-endpoint-bySubModule";
    String API_ENDPOINT_BY_PERMISSION = PRIVATE_API_ENDPOINT + "/api-endpoint-bypermission";

}
