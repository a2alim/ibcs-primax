package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.client.UUAClient;
import com.ibcs.idsdp.common.client.dto.response.UserResponse;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResult;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SectorDivision;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UserGroup;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.AgencyRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.MinistryDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.SectorDivisionRepository;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.UserGroupRepository;
import com.ibcs.idsdp.idsdpconfigration.services.UserGroupService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.UserGroupDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.NotifyUserRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupDetailResponse;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.UserGroupResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserGroupServiceImp extends BaseService<UserGroup, UserGroupDTO> implements UserGroupService {


    @Value("${feign.client.uaa}")
    private String uaaUrl;

    private final UserGroupRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final MinistryDivisionRepository ministryDivisionRepository;
    private final AgencyRepository agencyRepository;
    private final SectorDivisionRepository sectorDivisionRepository;
    private final UUAClient uuaClientService;

    public UserGroupServiceImp(UserGroupRepository repository,
                               IdGeneratorComponent idGeneratorComponent,
                               MinistryDivisionRepository ministryDivisionRepository,
                               AgencyRepository agencyRepository,
                               SectorDivisionRepository sectorDivisionRepository, UUAClient uuaClientService) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.ministryDivisionRepository = ministryDivisionRepository;
        this.agencyRepository = agencyRepository;
        this.sectorDivisionRepository = sectorDivisionRepository;
        this.uuaClientService = uuaClientService;
    }

    /**
     * for convertForCreate
     *
     * @param userGroupDTO
     * @return
     */
    @Override
    protected UserGroup convertForCreate(UserGroupDTO userGroupDTO) {
        UserGroup userGroup = super.convertForCreate(userGroupDTO);
        return userGroup;
    }

    /**
     * for convertForUpdate
     *
     * @param userGroupDTO
     * @param userGroup
     */
    @Override
    protected void convertForUpdate(UserGroupDTO userGroupDTO, UserGroup userGroup) {
        super.convertForUpdate(userGroupDTO, userGroup);
    }

    /**
     * for get ActiveUser Group
     *
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<UserGroupDTO> getActiveUserGroup(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<UserGroup> ePage = repository.findAllByCheckedAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public List<UserGroupResponse> getListByMininstryAndIsChecked(Long ministryId) {

        Optional<MinistryDivision> ministryDivisionOptional = ministryDivisionRepository.findById(ministryId);

        MinistryDivision ministryDivision = null;
        if (ministryDivisionOptional.isPresent()) {
            ministryDivision = ministryDivisionOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllByMinistryDivisionAndChecked(ministryDivision, true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setMinistry(e.getMinistryDivision().getId());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;
    }


    @Override
    public List<UserGroupResponse> getListByAgencyAndIsChecked(Long agencyId) {

        Optional<Agency> agencyOptional = agencyRepository.findById(agencyId);

        Agency agency = null;
        if (agencyOptional.isPresent()) {
            agency = agencyOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllByAgencyAndChecked(agency, true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;
    }

    @Override
    public List<UserGroup> getUserGroupByMinistryDivisionId(Long ministryDivisionId) {
        Optional<MinistryDivision> ministryDivisionOptional = ministryDivisionRepository.findById(ministryDivisionId);

        MinistryDivision ministryDivision = null;
        if (ministryDivisionOptional.isPresent()) {
            ministryDivision = ministryDivisionOptional.get();
        }
        return repository.findAllByMinistryDivisionAndChecked(ministryDivision, true);
    }

    @Override
    public List<UserGroup> getUserGroupByByAgencyId(Long agencyId) {
        Optional<Agency> agencyOptional = agencyRepository.findById(agencyId);

        Agency agency = null;
        if (agencyOptional.isPresent()) {
            agency = agencyOptional.get();
        }
        return repository.findAllByAgencyAndChecked(agency, true);
    }

    @Override
    public List<UserGroupResponse> findBySectorDivison(Long sectorDivisonId) {

        Optional<SectorDivision> sectorDivisionOptional = sectorDivisionRepository.findById(sectorDivisonId);

        SectorDivision sectorDivision = null;
        if (sectorDivisionOptional.isPresent()) {
            sectorDivision = sectorDivisionOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllBySectorDivisionAndChecked(sectorDivision, true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;
    }


    @Override
    public List<UserGroupResponse> findUserByEcnec(String ecnec) {
        List<UserGroup> userGroupList = repository.findAllByEcnecAndChecked(ecnec, true);
        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setPlanningMinister(e.getPlanningMinister());
            userGroupResponse.setEcnec(e.getEcnec());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;

    }


    @Override
    public UserGroupResponse findUserByPlanningMinister(String planningMinister) {
        UserGroupResponse userGroupResponse = new UserGroupResponse();
        Optional<UserGroup> userGroupOptional = repository.findByPlanningMinisterAndChecked(planningMinister, true);
        if(userGroupOptional.isPresent()) {
            UserGroup userGroup = userGroupOptional.get();
            userGroupResponse.setUserId(userGroup.getUserId());
            userGroupResponse.setId(userGroup.getId());
            userGroupResponse.setChecked(userGroup.getChecked());
            userGroupResponse.setEcnec(userGroup.getEcnec());
        }
        return userGroupResponse;
    }

    @Override
    @Transactional
    public ResponseWithResult create(List<UserGroupDTO> userGroupList) {
        userGroupList.forEach(userGroupDTO -> {
            Optional<UserGroup> userGroupExistingOptional = repository.findByUserId(userGroupDTO.getUserId());
            if (userGroupExistingOptional.isPresent()) {
                UserGroup userGroupExisting = userGroupExistingOptional.get();
                userGroupExisting.setChecked(userGroupDTO.getChecked());

                if (userGroupDTO.getMinistry() != null) {
                    Optional<MinistryDivision> ministryDivision = ministryDivisionRepository.findById(userGroupDTO.getMinistry());
                    if (ministryDivision.isPresent()) {
                        userGroupExisting.setMinistryDivision(ministryDivision.get());
                    }
                }
                if (userGroupDTO.getAgency() != null) {
                    Optional<Agency> agencyOptional = agencyRepository.findById(userGroupDTO.getAgency());
                    if (agencyOptional.isPresent()) {
                        userGroupExisting.setAgency(agencyOptional.get());
                    }
                }
                if (userGroupDTO.getSectorDivison() != null) {
                    Optional<SectorDivision> sectorDivisionOptional = sectorDivisionRepository.findById(userGroupDTO.getSectorDivison());
                    if (sectorDivisionOptional.isPresent()) {
                        userGroupExisting.setSectorDivision(sectorDivisionOptional.get());
                    }
                }
                if (userGroupDTO.getEcnec() != null) {
                    userGroupExisting.setEcnec(userGroupDTO.getEcnec());
                    userGroupExisting.setPlanningMinister(null);
                }
                if (userGroupDTO.getPlanningMinister() != null) {
                    userGroupExisting.setPlanningMinister(userGroupDTO.getPlanningMinister());
                    userGroupExisting.setEcnec(null);
                }


                repository.save(userGroupExisting);
            } else {
                UserGroup userGroup = new UserGroup();
                Optional<MinistryDivision> ministryDivision = ministryDivisionRepository.findById(userGroupDTO.getMinistry());
                if (ministryDivision.isPresent()) {
                    userGroup.setMinistryDivision(ministryDivision.get());
                }
                Optional<Agency> agencyOptional = agencyRepository.findById(userGroupDTO.getAgency());
                if (agencyOptional.isPresent()) {
                    userGroup.setAgency(agencyOptional.get());
                }
                Optional<SectorDivision> sectorDivisionOptional = sectorDivisionRepository.findById(userGroupDTO.getSectorDivison());
                if (sectorDivisionOptional.isPresent()) {
                    userGroup.setSectorDivision(sectorDivisionOptional.get());
                }
                if (userGroupDTO.getEcnec() != null) {
                    userGroup.setEcnec(userGroupDTO.getEcnec());
                }
                if (userGroupDTO.getPlanningMinister() != null) {
                    userGroup.setPlanningMinister(userGroupDTO.getPlanningMinister());
                }
                userGroup.setChecked(userGroupDTO.getChecked());
                userGroup.setUserId(userGroupDTO.getUserId());
                userGroup.setUuid(idGeneratorComponent.generateUUID());
                userGroup.setIsDeleted(false);
                userGroup.setCreatedOn(LocalDate.now());
                repository.save(userGroup);
            }
        });

        return new ResponseWithResult(200, "Successfully save Data", "");
    }

    @Override
    public List<UserGroupResponse> getListWhichNotInMinistry(Long ministryId) {
        Optional<MinistryDivision> ministryDivisionOptional = ministryDivisionRepository.findById(ministryId);

        MinistryDivision ministryDivision = null;
        if (ministryDivisionOptional.isPresent()) {
            ministryDivision = ministryDivisionOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllByMinistryDivisionNotAndChecked(ministryDivision, true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });
        return userGroupResponses;
    }

    @Override
    public List<UserGroupResponse> geUserWhichNotInEcnec(String ecnec) {
        List<UserGroup> userGroupList = repository.findAllByEcnecIsNullAndChecked(true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });
        return userGroupResponses;
    }

    @Override
    public List<UserGroupResponse> getUserWhichNotInPlanningMinister(String planningMinister) {

        List<UserGroup> userGroupList = repository.findAllByPlanningMinisterIsNullAndChecked(true);

        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });
        return userGroupResponses;
    }

    @Override
    public List<UserGroupResponse> getListWhichNotInAgency(Long agencyId) {
        Optional<Agency> agencyOptional = agencyRepository.findById(agencyId);
        Agency agency = null;
        if (agencyOptional.isPresent()) {
            agency = agencyOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllByAgencyNotAndChecked(agency, true);
        List<UserGroupResponse> userGroupResponses = new ArrayList<>();
        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;
    }



    @Override
    public List<UserGroupResponse> getListWhichNotInSectorDivison(Long sectorDivisonId) {
        Optional<SectorDivision> sectorDivisionOptional = sectorDivisionRepository.findById(sectorDivisonId);
        SectorDivision sectorDivision = null;
        if (sectorDivisionOptional.isPresent()) {
            sectorDivision = sectorDivisionOptional.get();
        }
        List<UserGroup> userGroupList = repository.findAllBySectorDivisionNotAndCheckedOrEcnecNotNullOrPlanningMinisterNotNull(sectorDivision, true);
        List<UserGroupResponse> userGroupResponses = new ArrayList<>();

        userGroupList.forEach(e -> {
            UserGroupResponse userGroupResponse = new UserGroupResponse();
            userGroupResponse.setId(e.getId());
            if (e.getAgency() != null) {
                userGroupResponse.setAgency(e.getAgency().getId());
            }
            userGroupResponse.setChecked(e.getChecked());
            userGroupResponse.setUserId(e.getUserId());
            userGroupResponses.add(userGroupResponse);
        });

        return userGroupResponses;
    }

    @Override
    public List<UserGroupDetailResponse> getAllByDesk(String groupType, String token) {
        List<UserGroupDetailResponse> userGroupResponseList = new ArrayList<UserGroupDetailResponse>();
        List<UserGroup> userGroupList = null;

        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Optional<UserGroup> optUserGroup = repository.findByUserIdAndChecked(Long.parseLong(accessTokenDetail.getId()), true);
        UserGroup loggedUserGroup = optUserGroup.isPresent()?optUserGroup.get():null;

        if(groupType.equals("Agency")) {
            Agency agency = loggedUserGroup.getAgency();
            userGroupList = repository.findAllByAgencyAndChecked(loggedUserGroup.getAgency(), true);
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse = getUserByIdFromUaa(userGroup.getUserId(),token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Desk_Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),userGroup.getAgency().getId(), null, null);
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        } else if(groupType.equals("Ministry")) {
            MinistryDivision ministryDivision = loggedUserGroup.getMinistryDivision();
            userGroupList = repository.findAllByMinistryDivisionAndMinistryDivisionNotNull(ministryDivision);
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse = getUserByIdFromUaa(userGroup.getUserId(), token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Desk_Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),null, userGroup.getMinistryDivision().getId(), null);
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        } else if (groupType.equals("Planning_Commission")) {
            SectorDivision sectorDivision = loggedUserGroup.getSectorDivision();
            userGroupList = repository.findAllBySectorDivisionAndSectorDivisionNotNull(sectorDivision);
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse =  getUserByIdFromUaa(userGroup.getUserId(), token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Desk_Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),null, null, userGroup.getSectorDivision().getId());
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        } else if(groupType.equals("Ecnec_Head")) {
            userGroupList = repository.findAllByEcnecAndChecked("Ecnec",true);
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse = getUserByIdFromUaa(userGroup.getUserId(), token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),null, null, null);
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        } else if(groupType.equals("Ecnec_Officer")) {
            userGroupList = repository.findAllByEcnecAndChecked("Ecnec",true);
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse = getUserByIdFromUaa(userGroup.getUserId(), token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Desk_Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),null, null, null);
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        } else {
            userGroupList = repository.findAllBySectorDivisionNotNull();
            userGroupList.forEach(userGroup -> {
                UserResponse userResponse = getUserByIdFromUaa(userGroup.getUserId(), token);
                if(userResponse!=null && userResponse.getDutyTypeId()!=null && userResponse.getDutyTypeId().name().equals("Desk_Officer")){
                    UserGroupDetailResponse userGroupDetailResponse = new UserGroupDetailResponse(userGroup.getUserId(),userResponse.getName(),userResponse.getDesignation(),null, null, null);
                    userGroupResponseList.add(userGroupDetailResponse);
                }
            });
        }
        return userGroupResponseList;
    }



    @Override
    public UserGroup getUserByUserId(Long userId) {
        Optional<UserGroup> userGroupOptionanl = repository.findByUserIdAndChecked(userId, true);
        UserGroup userGroup = null;
        if(userGroupOptionanl.isPresent()) {
            userGroup = userGroupOptionanl.get();
        }
        return userGroup;

    }

    @Override
    public List<UserGroup> getUserByUserIds(IdSetRequestBodyDTO requestBodyDTO) {
        return repository.findAllByUserIdInAndChecked(requestBodyDTO.getIds(), true);
    }

    public UserResponse getUserByIdFromUaa(Long id,String token){
        HttpHeaders headers = new HttpHeaders();
        headers.set("Header", token);
        RestTemplate restTemplate = new RestTemplate();
        HttpEntity entity = new HttpEntity(headers);

        ResponseEntity<UserResponse> response = restTemplate.exchange(
                uaaUrl+"/users/"+id, HttpMethod.GET, entity, UserResponse.class, 1);
        return response.getBody();
    }

    @Override
    public UserGroup removeUserByUserId(Long id){
        Optional<UserGroup> userGroupOptional = repository.findByUserIdAndChecked(id, true);
        if(userGroupOptional.isPresent()) {
            UserGroup userGroup = userGroupOptional.get();
            userGroup.setChecked(false);
            userGroup.setPlanningMinister(null);
            userGroup.setEcnec(null);
            userGroup.setSectorDivision(null);
            userGroup.setAgency(null);
            userGroup.setMinistryDivision(null);
            repository.save(userGroup);
            return userGroup;
        }
        return null;
    }

    @Override
    public List<UserResponse> findUserGroupsByUserIdAndUserType(NotifyUserRequest request) {

        List<UserResponse> responseUsers = new ArrayList<UserResponse>();

        List<UserGroup> allAgencyUserGroup = repository.findAllByAgencyId(request.getAgencyId());
        Set<Long> agencyUserIds = allAgencyUserGroup.stream().map(UserGroup::getUserId).collect(Collectors.toSet());
        ResponseEntity<List<UserResponse>> agencyUsers = uuaClientService.getUsersByIdSet(agencyUserIds);
        List<UserResponse> agencyBody = agencyUsers.getBody();
        List<UserResponse> agencyHeadUsers = agencyBody.stream().filter(f -> f.getDutyTypeId().name().equals("Head")).collect(Collectors.toList());
        List<UserResponse> agencyDeskUsers = agencyBody.stream().filter(f -> f.getDutyTypeId().name().equals("Desk_Officer")).collect(Collectors.toList());

        List<UserGroup> allByMinistryDivisionUserGroup = repository.findAllByMinistryDivisionId(request.getMinistryDivisionId());
        Set<Long> ministryUserIds = allByMinistryDivisionUserGroup.stream().map(UserGroup::getUserId).collect(Collectors.toSet());
        ResponseEntity<List<UserResponse>> ministryUsers = uuaClientService.getUsersByIdSet(ministryUserIds);
        List<UserResponse> ministryBody = ministryUsers.getBody();
        List<UserResponse> ministryHeadUsers = ministryBody.stream().filter(f -> f.getDutyTypeId().name().equals("Head")).collect(Collectors.toList());
        List<UserResponse> ministryDeskUsers = ministryBody.stream().filter(f -> f.getDutyTypeId().name().equals("Desk_Officer")).collect(Collectors.toList());

        List<UserGroup> allBySectorDivisionUserGroup = repository.findAllBySectorDivisionId(request.getSectorDivisionId());
        Set<Long> sectorDivisionUserIds = allBySectorDivisionUserGroup.stream().map(UserGroup::getUserId).collect(Collectors.toSet());
        ResponseEntity<List<UserResponse>> sectorDivisionUsers = uuaClientService.getUsersByIdSet(sectorDivisionUserIds);
        List<UserResponse> sectorDivisionBody = sectorDivisionUsers.getBody();
        List<UserResponse> sectorDivisionHeadUsers = sectorDivisionBody.stream().filter(f -> f.getDutyTypeId().name().equals("Head")).collect(Collectors.toList());
        List<UserResponse> sectorDivisionDeskUsers = sectorDivisionBody.stream().filter(f -> f.getDutyTypeId().name().equals("Desk_Officer")).collect(Collectors.toList());


        AccessTokenDetail loginUserTokenDetails = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Optional<UserGroup> loginUserGroup = repository.findByUserId(Long.parseLong(loginUserTokenDetails.getId()));
        ResponseEntity<UserResponse> loginUserInfo = uuaClientService.getUserById(Long.parseLong(loginUserTokenDetails.getId()));

        /*INTERNAL_MOVEMENT*/
        if(loginUserGroup.get().getAgency() != null){
            if(request.getType().equals("ATTACH_POTROJARI")
                    || request.getType().equals("SEND_TO_E_NOTHI")
                    || request.getType().equals("INTERNAL_MOVEMENT")){
                if(Objects.requireNonNull(loginUserInfo.getBody()).getDutyTypeId().name().equals("Head")){
                    responseUsers.addAll(agencyDeskUsers);
                    return responseUsers;
                }else{
                    return agencyHeadUsers;
                }
            }else if(request.getType().equals("PROJECT_FORWARD")){
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                return responseUsers;
            }
        }else if(loginUserGroup.get().getMinistryDivision() != null){
            if(request.getType().equals("ATTACH_POTROJARI")
                    || request.getType().equals("SEND_TO_E_NOTHI")
                    || request.getType().equals("ADMINISTRATIVE_ORDER")
                    || request.getType().equals("KARJOPATRA_UPLOAD")
                    || request.getType().equals("INTERNAL_MOVEMENT")){
                if(Objects.requireNonNull(loginUserInfo.getBody()).getDutyTypeId().name().equals("Head")){
                    responseUsers.addAll(ministryDeskUsers);
                    return responseUsers;
                }else{
                    return ministryHeadUsers;
                }
            }else if(request.getType().equals("PROJECT_FORWARD")){
                responseUsers.addAll(sectorDivisionDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                return responseUsers;
            }else if(request.getType().equals("PROJECT_RECAST")){
                responseUsers.addAll(agencyDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                return responseUsers;
            }else if(request.getType().equals("PROJECT_APPROVED")){
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                responseUsers.addAll(agencyDeskUsers);
                return responseUsers;
            }
        }else if(loginUserGroup.get().getSectorDivision() != null){
            if(request.getType().equals("ATTACH_POTROJARI")
                    || request.getType().equals("SEND_TO_E_NOTHI")
                    || request.getType().equals("KARJOPATRA_UPLOAD")
                    || request.getType().equals("GOVT_ORDER")
                    || request.getType().equals("INTERNAL_MOVEMENT")){
                if(Objects.requireNonNull(loginUserInfo.getBody()).getDutyTypeId().name().equals("Head")){
                    responseUsers.addAll(sectorDivisionDeskUsers);
                    return responseUsers;
                }else{
                    return sectorDivisionHeadUsers;
                }
            }else if(request.getType().equals("PROJECT_REJECTED")){
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                responseUsers.addAll(agencyDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                responseUsers.addAll(sectorDivisionDeskUsers);
                return responseUsers;
            }else if(request.getType().equals("PROJECT_FORWARD")){
                responseUsers.addAll(sectorDivisionDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                return responseUsers;
            }else if(request.getType().equals("PROJECT_RECAST")){
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(ministryHeadUsers);
                return responseUsers;
            }else if(request.getType().equals("PROJECT_APPROVED")){
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                responseUsers.addAll(agencyDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                responseUsers.addAll(sectorDivisionDeskUsers);
                return responseUsers;
            }
        }else if(loginUserGroup.get().getPlanningMinister() != null) {
            if (request.getType().equals("PROJECT_APPROVED") || request.getType().equals("PROJECT_REJECTED")) {
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                responseUsers.addAll(agencyDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                responseUsers.addAll(sectorDivisionDeskUsers);
                return responseUsers;
            }
        }else if(loginUserGroup.get().getEcnec() != null) {
            if (request.getType().equals("PROJECT_APPROVED") || request.getType().equals("PROJECT_REJECTED") || request.getType().equals("PROJECT_APPROVAL_WITH_CONDITION")) {
                responseUsers.addAll(ministryHeadUsers);
                responseUsers.addAll(ministryDeskUsers);
                responseUsers.addAll(agencyHeadUsers);
                responseUsers.addAll(agencyDeskUsers);
                responseUsers.addAll(sectorDivisionHeadUsers);
                responseUsers.addAll(sectorDivisionDeskUsers);
                return responseUsers;
            }
        }
        return responseUsers;
    }

}


