package com.ibcs.idsdp.idsdpconfigration.constants;

import com.ibcs.idsdp.common.constants.BaseConstant;

public interface ApprovalStatusConstant {
    String APPROVAL_STATUS = "approval/";

    String GET_APPROVAL_STATUS = "fetchActiveApprovalStatus/";

    String GET_ALL = "get-all";

    String uuid = "uuid";

    String GET_BY_UUID_FOUND = "getUUId/{"+uuid+"}";

    String UPDATE_ALL = BaseConstant.UPDATE +"/"+GET_BY_UUID_FOUND;

    String DELETE_ALL_BY = BaseConstant.DELETE +"/"+GET_BY_UUID_FOUND;
}
