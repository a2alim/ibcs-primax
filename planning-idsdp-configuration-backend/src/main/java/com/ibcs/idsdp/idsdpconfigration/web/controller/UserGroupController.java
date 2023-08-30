package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResult;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.idsdpconfigration.constants.UserGroupConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UserGroup;
import com.ibcs.idsdp.idsdpconfigration.services.UserGroupService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.UserGroupDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.NotifyUserRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupDetailResponse;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupResponse;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupStatusResponse;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestApiController
@RequestMapping(UserGroupConstant.USER_GROUP)
public class UserGroupController extends BaseController<UserGroup, UserGroupDTO> {

    private final UserGroupService userGroupService;

    public UserGroupController(BaseService<UserGroup, UserGroupDTO> baseService, UserGroupService userGroupService) {
        super(baseService);
        this.userGroupService = userGroupService;
    }

    @Value("${feign.client.uaa}")
    private String uaaUrl;

    @Autowired
    Environment environment;


    /**
     * for get Active UserGroup
     *
     * @param page
     * @param size
     * @return
     */
    @GetMapping(path = UserGroupConstant.GET_ACTIVE_USER_GROUP + "/{page}" + "/{size}", produces = "application/json")
    public Page<UserGroupDTO> getActiveUserGroup(@PathVariable("page") int page, @PathVariable("size") int size) {
        return userGroupService.getActiveUserGroup(new PageableRequestBodyDTO() {{
            setPage(page);
            setSize(size);
        }});
    }


    @GetMapping(path = UserGroupConstant.GET_LIST_BY_MINISTRY + "/{ministryId}")
    List<UserGroupResponse> findCheckedUserByMinistry(@PathVariable("ministryId") Long ministryId) {
        return userGroupService.getListByMininstryAndIsChecked(ministryId);
    }

    @GetMapping(path = UserGroupConstant.GET_LIST_BY_AGENCY + "/{agencyId}")
    List<UserGroupResponse> findCheckedUserByAgencyId(@PathVariable("agencyId") Long agencyId) {
        return userGroupService.getListByAgencyAndIsChecked(agencyId);
    }

    @GetMapping(path = UserGroupConstant.GET_BY_MINISTRY_DIVISION_ID + "/{ministryDivisionId}")
    List<UserGroup> getUserGroupByMinistryDivisionId(@PathVariable("ministryDivisionId") Long ministryDivisionId) {
        return userGroupService.getUserGroupByMinistryDivisionId(ministryDivisionId);
    }

    @GetMapping(path = UserGroupConstant.GET_BY_AGENCY_ID + "/{agencyId}")
    List<UserGroup> getUserGroupByByAgencyId(@PathVariable("agencyId") Long agencyId) {
        return userGroupService.getUserGroupByByAgencyId(agencyId);
    }

    @GetMapping(path = UserGroupConstant.GET_LIST_BY_SECTOR_DIVISON + "/{sectorDivisonId}")
    List<UserGroupResponse> findBySectorDivison(@PathVariable("sectorDivisonId") Long sectorDivisonId) {
        return userGroupService.findBySectorDivison(sectorDivisonId);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_BY_ECNCE + "/{ecnec}")
    List<UserGroupResponse> findUserByEcnec(@PathVariable("ecnec") String ecnec) {
        return userGroupService.findUserByEcnec(ecnec);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_BY_PLANNING_MINISTER + "/{planningMinister}")
    UserGroupResponse findUserByPlanningMinister(@PathVariable("planningMinister") String planningMinister) {
        return userGroupService.findUserByPlanningMinister(planningMinister);
    }


    @PostMapping(path = UserGroupConstant.CREATE_USER_GROUP)
    public ResponseWithResult create(@RequestBody List<UserGroupDTO> userGroupDTOList) {
        return userGroupService.create(userGroupDTOList);
    }


    @GetMapping(path = UserGroupConstant.GET_USER_BY_USER_ID + "/{userId}")
    UserGroup findByUserId(@PathVariable("userId") Long userId) {
        return userGroupService.getUserByUserId(userId);
    }

    @PostMapping(path = UserGroupConstant.GET_BY_USER_ID_SET)
    List<UserGroup> findByUserIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return userGroupService.getUserByUserIds(requestBodyDTO);
    }

    @GetMapping(path = UserGroupConstant.GET_LIST_NOT_IN_MINISTRY + "/{ministryId}")
    List<UserGroupResponse> findAllByNotInMinistry(@PathVariable("ministryId") Long ministryId) {
        return userGroupService.getListWhichNotInMinistry(ministryId);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_BY_NOT_IN_PLANNING_MINISTER + "/{planningMinister}")
    List<UserGroupResponse> findUserByNotInPlanningMinister(@PathVariable("planningMinister") String planningMinister) {
        return userGroupService.getUserWhichNotInPlanningMinister(planningMinister);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_BY_NOT_IN_ECNEC + "/{ecnec}")
    List<UserGroupResponse> findUserByNotInEcnec(@PathVariable("ecnec") String ecnec) {
        return userGroupService.geUserWhichNotInEcnec(ecnec);
    }

    @GetMapping(path = UserGroupConstant.GET_LIST_NOT_IN_AGENCY + "/{agencyId}")
    List<UserGroupResponse> findAllByNotInAgency(@PathVariable("agencyId") Long agencyId) {
        return userGroupService.getListWhichNotInAgency(agencyId);
    }

    @GetMapping(path = UserGroupConstant.GET_LIST_NOT_IN_SECTOR_DIVISON + "/{sectorDivisonId}")
    List<UserGroupResponse> findAllByNotInSectorDivison(@PathVariable("sectorDivisonId") Long sectorDivisonId) {
        return userGroupService.getListWhichNotInSectorDivison(sectorDivisonId);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_GROUP)
    ResponseWithResult getUserGroupStatusResponse(@RequestHeader("Authorization") String token){
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        System.out.println(environment.getProperty("feign.client.pps-configuration"));
        HttpHeaders headers = new HttpHeaders();
        headers.set("Header", token);
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity entity = new HttpEntity(headers);
        String uaaUserUrl = uaaUrl.toString() + "users/";
        ResponseEntity<UserResponse> response = restTemplate.exchange(
                uaaUserUrl + accessTokenDetail.getId(), HttpMethod.GET, entity, UserResponse.class, 1);
        UserGroup userGroup = userGroupService.getUserByUserId(Long.parseLong(accessTokenDetail.getId()));

        UserResponse userResponse = response.getBody();

        if(userGroup!=null){
            if(userGroup.getAgency()!=null){
                if(userResponse.getDutyTypeId().name().equals("Head"))
                    return new ResponseWithResult(200,"Data Found", new UserGroupStatusResponse("AGENCY-HEAD", userResponse.getId()));
                else
                    return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("AGENCY-DESK",userResponse.getId()));
            }

            else if(userGroup.getMinistryDivision()!=null){
                if(userResponse.getDutyTypeId().name().equals("Head"))
                    return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("MINISTRY-HEAD",userResponse.getId()));
                else
                    return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("MINISTRY-DESK", userResponse.getId()));
            }

            else{
                if(userGroup.getSectorDivision()!=null){
                    if(userResponse.getDutyTypeId().name().equals("Head"))
                        return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("PLANNING-HEAD", userResponse.getId()));
                    else
                        return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("PLANNING-DESK", userResponse.getId()));
                }
                else{
                    if(userGroup.getPlanningMinister()!=null)
                        return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("PLANNING-MINISTER",null));
                    else if(userGroup.getEcnec()!=null){
                        if(userResponse.getDutyTypeId().name().equals("Head"))
                            return new ResponseWithResult(200,"Data Found", new UserGroupStatusResponse("ECNEC-HEAD", userResponse.getId()));
                        else if(userResponse.getDutyTypeId().name().equals("Officer"))
                            return new ResponseWithResult(200,"Data Found", new UserGroupStatusResponse("ECNEC-OFFICER", userResponse.getId()));
                        else
                            return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("ECNEC-DESK",userResponse.getId()));
                    }
//                        return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("ECNEC",null));
                    else
                        return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse(null,null));
                }

            }

        }
        else
            return new ResponseWithResult(200,"Data Found",new UserGroupStatusResponse("OTHER",null));

    }

    @GetMapping(path = UserGroupConstant.GET_LIST_BY_DESK + "/{groupType}", produces = "application/json")
    public ResponseEntity<List<UserGroupDetailResponse>> getAllByDesk(@PathVariable("groupType") String groupType, @RequestHeader("Authorization") String token) {
        List<UserGroupDetailResponse> userGroupResponseList = userGroupService.getAllByDesk(groupType, token);
        return new ResponseEntity<>(userGroupResponseList, HttpStatus.OK);
    }

    @GetMapping(path = UserGroupConstant.GET_USER_GROUP_BY_USER_ID, produces = "application/json")
    public UserGroup getUserGroupByUserId() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        return userGroupService.getUserByUserId(Long.parseLong(accessTokenDetail.getId()));
    }

    @GetMapping(path = UserGroupConstant.REMOVE_USER_BY_USER_ID + "/{id}", produces = "application/json")
    public ResponseWithResult removeUserByUserId(@PathVariable("id") Long id) {
        UserGroup userGroup = userGroupService.removeUserByUserId(id);
        if(userGroup != null) {
            return new ResponseWithResult(200, "Successfully Remove", "");
        } else {
            return new ResponseWithResult(404, "Data Not Found", "");
        }

    }

    @GetMapping(path = UserGroupConstant.FIND_USER_GROUP_BY_USER_ID + "/{userId}", produces = "application/json")
    public ResponseWithResult findUserGroupByUserId(@PathVariable("userId") Long userId){
        UserGroup userGroup = userGroupService.getUserByUserId(userId);
        if(userGroup!=null)
            return new ResponseWithResult(200, "Data Found", userGroup);
        else
            return new ResponseWithResult(200, "Data Not Found", null);
    }

    @PostMapping(UserGroupConstant.FIND_USER_GROUPS_BY_USER_ID_TYPE)
    public List<com.ibcs.idsdp.common.client.dto.response.UserResponse> findUserGroupsByUserIdAndUserType(@RequestBody NotifyUserRequest request){
        return userGroupService.findUserGroupsByUserIdAndUserType(request);
    }

}
