package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.client.dto.response.UserResponse;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResult;
import com.ibcs.idsdp.idsdpconfigration.web.dto.UserGroupDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.NotifyUserRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupDetailResponse;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupResponse;
import org.springframework.data.domain.Page;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UserGroup;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface UserGroupService {

    Page<UserGroupDTO> getActiveUserGroup(PageableRequestBodyDTO pageableRequestBodyDTO);

    List<UserGroupResponse> getListByMininstryAndIsChecked(Long ministryId);

    List<UserGroupResponse> getListByAgencyAndIsChecked(Long agencyId);

    List<UserGroup> getUserGroupByMinistryDivisionId(Long ministryDivisionId);

    List<UserGroup> getUserGroupByByAgencyId(Long agencyId);

    List<UserGroupResponse> findBySectorDivison(Long sectorDivisonId);

    List<UserGroupResponse> findUserByEcnec(String ecnec);

    UserGroupResponse findUserByPlanningMinister(String planningMinister);

    UserGroup getUserByUserId(Long userId);

    public List<UserGroup> getUserByUserIds(IdSetRequestBodyDTO requestBodyDTO);

    ResponseWithResult create(List<UserGroupDTO> userGroupList);

    List<UserGroupResponse> getListWhichNotInMinistry(Long ministryId);

    List<UserGroupResponse> getListWhichNotInAgency(Long agencyId);

    List<UserGroupDetailResponse> getAllByDesk(String groupType, String token);

    List<UserGroupResponse> getListWhichNotInSectorDivison(Long sectorDivisonId);

    List<UserGroupResponse> geUserWhichNotInEcnec(String ecnec);

    List<UserGroupResponse> getUserWhichNotInPlanningMinister(String planningMinister);

    UserGroup removeUserByUserId(Long id);

    List<UserResponse> findUserGroupsByUserIdAndUserType(NotifyUserRequest type);
}
