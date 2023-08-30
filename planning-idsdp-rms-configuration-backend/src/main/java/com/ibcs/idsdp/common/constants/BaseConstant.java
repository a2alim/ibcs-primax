package com.ibcs.idsdp.common.constants;

public interface BaseConstant {

    String CREATE = "create";

    String UPDATE = "update";

    String GET_LIST = "get-list";

    String GET_BY_UUID = "get-by-uuid";

    String GET_BY_UUID_SET = "get-by-uuid-set";

    String GET_BY_ID = "get-by-id";

    String GET_BY_ID_SET = "get-by-id-set";

    String DELETE = "delete";

    String SAFE_DELETE = "safe-delete";

    String uuid = "uuid";

    String GET_BY_UUID_FOUND = "getUUId/{"+uuid+"}";

    String UPDATE_ALL = UPDATE +"/"+GET_BY_UUID_FOUND;

    String DELETE_ALL_BY = DELETE +"/"+GET_BY_UUID_FOUND;
}
