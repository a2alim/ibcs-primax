package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.PublicationInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.web.dto.request.DeclarationPersonalProfileRequest;
import com.ibcs.idsdp.rpm.web.dto.request.EducationInfoRequest;
import com.ibcs.idsdp.rpm.web.dto.request.NotApplicableFormsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProfilePersonalInfoMasterRequest;
import com.ibcs.idsdp.rpm.web.dto.response.NotApplicableFormsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearchProfileWithRelatedInfoResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface ResearcherProfilePersonalInfoMasterService {
	Response save(MultipartFile profilePic,
			ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest);

	Response saveOtherTabByTabName(String tabName, String body, Optional<MultipartFile[]> files);

	Response updateOtherTabByTabName(Long id, String tabName, String body, Optional<MultipartFile[]> files);

	Response updateResearcherProfilePersonal(Long researcherProfileId, String tabName, String body,
			Optional<MultipartFile[]> files);

	Response saveTabOne(Optional<MultipartFile[]> files, String body);

	Response saveResearcherProfilePersonalInstitutionalInfo(Optional<MultipartFile> files, String body);

	Response updateResearcherProfilePersonalInstitutionalInfo(String id, Optional<MultipartFile> files, String body);

	Page<ResearcherProfilePersonalInfoMaster> findAll(int offset, int pageSize);

	Page<ResearcherProfilePersonalInfoMaster> findAllByLoggedUser(String createdBy, int offset, int pageSize);

	Map<String, Object> getProfileView(String uuId) throws ExecutionException, InterruptedException;

	BooleanValueHolderDTO deletePersonInfoData(String uuId);

	Response<ResearcherProfilePersonalInfoMaster> getByUuid(String researcherProfileInfoUuid);

	Response<ResearcherProfilePersonalInfoMaster> getById(Long id);

	Response updateTabOne(String id, Optional<MultipartFile[]> files, Number fileIndex, String body);

	ResearcherProfileResponse getResearcherProfileUuidByUserId(Long userId);
	ResearcherProfileResponse getResearcherProfileByEmailAndType(String userId, boolean isInstitutional);

	AccessTokenDetail tokenDetails();

	Response<ResearchProfileWithRelatedInfoResponse> getEducationInfoByProfileUuid(String uuid) throws ExecutionException, InterruptedException;

	Response saveUpdateNotApplicable(NotApplicableFormsRequestDto notApplicableFormsRequestDto);

	Response getNotApplicable(Long rmsProfileId, String modelName);
	Response updateDeclarationTabOne(DeclarationPersonalProfileRequest declarationPersonalProfileRequest);

	List<ResearcherProfilePersonalInfoMaster> findResearcherProfilePersonalInfoByUserId(Long id);

	Response getProfileStatusFindByUuid(String uuid);

	Response doSaveOrUpdateEducation(EducationInfo[] educationInfoRequest, Long profileId);

	Response doSaveOrUpdatePublication(PublicationInfo[] educationInfoRequest, Long profileId);

	Response saveRresearcherExperience(ResearchExperience [] researchExperience, Long profileId);
}
