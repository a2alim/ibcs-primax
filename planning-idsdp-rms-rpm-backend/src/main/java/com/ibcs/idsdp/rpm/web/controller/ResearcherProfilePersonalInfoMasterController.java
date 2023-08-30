package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.constants.ResearcherProposalConstant;
import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.PublicationInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.services.ResearcherProfilePersonalInfoMasterService;
import com.ibcs.idsdp.rpm.web.dto.request.DeclarationPersonalProfileRequest;
import com.ibcs.idsdp.rpm.web.dto.request.EducationInfoRequest;
import com.ibcs.idsdp.rpm.web.dto.response.APIResponse;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProfileResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

@RestApiController
@AllArgsConstructor
@RequestMapping("researcher-profile")
public class ResearcherProfilePersonalInfoMasterController {

	private final ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService;

	@PostMapping(value = "/tab-one", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response saveResearcherProfilePersonal(@RequestParam("file") Optional<MultipartFile[]> files,@RequestParam("body") String body) {
		return researcherProfilePersonalInfoMasterService.saveTabOne(files, body);

	}

	@PostMapping(value = "/tab-one-institutional", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response saveResearcherProfilePersonalInstitutionalInfo(@RequestParam("body") String body,
																   @RequestParam("file") Optional<MultipartFile> files) {
		return researcherProfilePersonalInfoMasterService.saveResearcherProfilePersonalInstitutionalInfo(files, body);
	}

	@PutMapping(value = "/tab-one/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response updateResearcherProfilePersonal(@PathVariable("id") String id,
													@RequestParam("file") Optional<MultipartFile[]> files, @RequestParam("fileIndex") Number fileIndex, @RequestParam("body") String body) {
		System.out.println("==reoort path ======");
		return researcherProfilePersonalInfoMasterService.updateTabOne(id, files, fileIndex, body);
	}

	@PutMapping(value = "/tab-one/update/declaration")
	public Response updateResearcherProfilePersonal(@RequestBody DeclarationPersonalProfileRequest declarationPersonalProfileRequest) {
		return researcherProfilePersonalInfoMasterService.updateDeclarationTabOne(declarationPersonalProfileRequest);
	}

	@PutMapping(value = "/tab-one-institutional/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response updateResearcherProfilePersonalInstitutionalInfo(@PathVariable("id") String id,@RequestParam("body") String body, @RequestParam("file") Optional<MultipartFile> files) {
		return researcherProfilePersonalInfoMasterService.updateResearcherProfilePersonalInstitutionalInfo(id, files, body);
	}

	@PostMapping(value = "/others-tab/{tabName}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response saveResearcherProfilePersonal(@RequestParam("body") String body,@RequestParam("file") Optional<MultipartFile[]> files, @PathVariable String tabName) {
		return researcherProfilePersonalInfoMasterService.saveOtherTabByTabName(tabName, body, files);
	}

	@PostMapping(value = "save-research-experience/{profileId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Response saveResearcherProfilePersonal(@RequestBody ResearchExperience [] researchExperience , @PathVariable Long profileId) {
		return researcherProfilePersonalInfoMasterService.saveRresearcherExperience(researchExperience, profileId);
	}

	@PutMapping(value = "/others-tab/{tabName}/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response updateOtherTabByTabName(@PathVariable("id") Long id, @RequestParam("body") String body,
											@RequestParam("file") Optional<MultipartFile[]> files, @PathVariable String tabName) {
		return researcherProfilePersonalInfoMasterService.updateOtherTabByTabName(id, tabName, body, files);
	}

	@PostMapping(value = "/educationSaveOrUpdate/{profileId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Response saveOrUpdateEducation(@RequestBody EducationInfo[] educationInfoRequest, @PathVariable Long profileId) {
		return researcherProfilePersonalInfoMasterService.doSaveOrUpdateEducation(educationInfoRequest,profileId);
	}

	@PostMapping(value = "/publicationSaveOrUpdate/{profileId}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Response saveOrUpdatePublication(@RequestBody PublicationInfo[] educationInfoRequest, @PathVariable Long profileId) {
		return researcherProfilePersonalInfoMasterService.doSaveOrUpdatePublication(educationInfoRequest,profileId);
	}


	@PutMapping(value = "/others-tab/{tabName}/{researcherProfileId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response updateResearcherProfilePersonal(@RequestParam("body") String body,
													@RequestParam("file") Optional<MultipartFile[]> files, @PathVariable String tabName,
													@PathVariable("researcherProfileId") Long researcherProfileId) {
		return researcherProfilePersonalInfoMasterService.updateResearcherProfilePersonal(researcherProfileId, tabName,
				body, files);
	}

	// tokenAccess
	@GetMapping("/pagination/{offset}/{pageSize}")
	public APIResponse<Page<ResearcherProfilePersonalInfoMaster>> getProductsWithPagination(@PathVariable int offset,
																							@PathVariable int pageSize) {

		AccessTokenDetail accessTokenDetail = researcherProfilePersonalInfoMasterService.tokenDetails();

		if (accessTokenDetail.getUserType().equalsIgnoreCase("Rms_DO")) {
			Page<ResearcherProfilePersonalInfoMaster> productsWithPagination = researcherProfilePersonalInfoMasterService
					.findAll(offset, pageSize);
			return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);

		} else {
			Page<ResearcherProfilePersonalInfoMaster> productsWithPagination = researcherProfilePersonalInfoMasterService
					.findAllByLoggedUser(accessTokenDetail.getId(), offset, pageSize);
			return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);

		}

	}

	@DeleteMapping("tab-one/delete/{uuid}")
	public ResponseEntity<BooleanValueHolderDTO> DeleteTabOne(@PathVariable("uuid") String uuId) {
		BooleanValueHolderDTO response = researcherProfilePersonalInfoMasterService.deletePersonInfoData(uuId);
		return new ResponseEntity<BooleanValueHolderDTO>(response, HttpStatus.OK);
	}

	@GetMapping(path = ResearcherProposalConstant.GET_BY_UUID + "/{uuid}", produces = "application/json")
	public Response<ResearcherProfilePersonalInfoMaster> getResearcherProfileByUuId(@PathVariable String uuid) {
		return researcherProfilePersonalInfoMasterService.getByUuid(uuid);
	}

	@GetMapping(path = ResearcherProposalConstant.GET_BY_ID + "/{id}", produces = "application/json")
	public Response<ResearcherProfilePersonalInfoMaster> getResearcherProfileByUuId(@PathVariable Long id) {
		return researcherProfilePersonalInfoMasterService.getById(id);
	}

	@GetMapping(path = "by-userId/{userId}", produces = "application/json")
	public ResearcherProfileResponse getResearcherUuidByUserId(@PathVariable Long userId) {
		return researcherProfilePersonalInfoMasterService.getResearcherProfileUuidByUserId(userId);
	}

	@GetMapping(path = "by-email-and-researcher-type/{email}/{isInstitutional}", produces = "application/json")
	public ResearcherProfileResponse getResearcherProfileByEmail(@PathVariable String email, @PathVariable boolean isInstitutional) {
		return researcherProfilePersonalInfoMasterService.getResearcherProfileByEmailAndType(email, isInstitutional);
	}


	@GetMapping(path = "profile-status-find-by-uuid/{uuid}", produces = "application/json")
	public Response getProfileStatusFindByUuid(@PathVariable String uuid) {
		return researcherProfilePersonalInfoMasterService.getProfileStatusFindByUuid(uuid);
	}




}
