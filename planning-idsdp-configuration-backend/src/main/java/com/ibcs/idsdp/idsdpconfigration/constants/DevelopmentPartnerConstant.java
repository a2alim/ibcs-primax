package com.ibcs.idsdp.idsdpconfigration.constants;

import com.ibcs.idsdp.common.constants.BaseConstant;

public interface DevelopmentPartnerConstant {
    String DEVELOPMENT_PARTNER = "developmentPartner/";
    String GET_DEVELOPMENT_PARTNER = "fetchActivedevelopmentPartner/";

    String uuid = "uuid";

    String GET_BY_UUID_FOUND = "getUUId/{"+uuid+"}";

    String UPDATE_ALL = BaseConstant.UPDATE +"/"+GET_BY_UUID_FOUND;

    String DELETE_ALL_BY = BaseConstant.DELETE +"/"+GET_BY_UUID_FOUND;

    String GET_BY_ID = "get-by-id";
}
