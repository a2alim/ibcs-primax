package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.ibcs.idsdp.rpm.model.domain.notApplicable.NotApplicableForms;
import com.ibcs.idsdp.rpm.model.repositories.*;
import com.ibcs.idsdp.rpm.web.dto.request.*;
import com.ibcs.idsdp.rpm.web.dto.response.*;
import org.apache.commons.lang.StringEscapeUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.model.domain.EducationInfo;
import com.ibcs.idsdp.rpm.model.domain.ProfessionalExperience;
import com.ibcs.idsdp.rpm.model.domain.ProfileTraining;
import com.ibcs.idsdp.rpm.model.domain.PublicationInfo;
import com.ibcs.idsdp.rpm.model.domain.RelativeInfo;
import com.ibcs.idsdp.rpm.model.domain.ResearchExperience;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileRscWorkingInOrg;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfileUploadAcknowledgementIncomeTax;
import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import com.ibcs.idsdp.rpm.services.ResearcherProfilePersonalInfoMasterService;
import com.ibcs.idsdp.rpm.services.UploadUsersImageService;
import com.ibcs.idsdp.util.CommonFunctions;
import com.ibcs.idsdp.util.Response;

import lombok.NonNull;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
@Transactional
public class ResearcherProfilePersonalInfoMasterServiceImp
		implements ResearcherProfilePersonalInfoMasterService, CommonFunctions {

	private final ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository;
	private final UploadUsersImageService uploadUsersImageService;

	private final RelativeInfoRepository relativeInfoRepository;
	private final EducationInfoRepository educationInfoRepository;
	private final PublicationRepository publicationRepository;
	private final ProfileTrainingRepository profileTrainingRepository;
	private final ProfessionalExperienceRepository professionalExperienceRepository;
	private final ResearchExperienceRepository researchExperienceRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final ResearcherProfileRscWorkingInOrgRepository researcherProfileRscWorkingInOrgRepository;

	private final MinioServerService minioServerService;

	private ProfileViewServiceImpl profileViewService;

	private final NotApplicableFormsRepository notApplicableFormsRepository;

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	@Value("${minio.host}")
	private String minIOHost;

	public ResearcherProfilePersonalInfoMasterServiceImp(
			ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository,
			UploadUsersImageService uploadUsersImageService, RelativeInfoRepository relativeInfoRepository,
			EducationInfoRepository educationInfoRepository, PublicationRepository publicationRepository,
			ProfileTrainingRepository profileTrainingRepository,
			ProfessionalExperienceRepository professionalExperienceRepository,
			ResearchExperienceRepository researchExperienceRepository, MinioServerService minioServerService,
			ProfileViewServiceImpl profileViewService, IdGeneratorComponent idGeneratorComponent,
			ResearcherProposalRepository researcherProposalRepository,
			RmsConfigurationClientService rmsConfigurationClientService,
			ResearcherProfileRscWorkingInOrgRepository researcherProfileRscWorkingInOrgRepository,
			NotApplicableFormsRepository notApplicableFormsRepository) {
		this.researcherProfilePersonalInfoMasterRepository = researcherProfilePersonalInfoMasterRepository;
		this.uploadUsersImageService = uploadUsersImageService;
		this.relativeInfoRepository = relativeInfoRepository;
		this.educationInfoRepository = educationInfoRepository;
		this.publicationRepository = publicationRepository;
		this.profileTrainingRepository = profileTrainingRepository;
		this.professionalExperienceRepository = professionalExperienceRepository;
		this.researchExperienceRepository = researchExperienceRepository;
		this.minioServerService = minioServerService;
		this.profileViewService = profileViewService;
		this.idGeneratorComponent = idGeneratorComponent;
		this.researcherProposalRepository = researcherProposalRepository;
		this.researcherProfileRscWorkingInOrgRepository = researcherProfileRscWorkingInOrgRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.notApplicableFormsRepository = notApplicableFormsRepository;
	}

	@Override
	public Response save(MultipartFile profilePic,
			ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest) {

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster();
		BeanUtils.copyProperties(researcherProfilePersonalInfoMasterRequest, researcherProfilePersonalInfoMaster);

		researcherProfilePersonalInfoMaster
				.setRmsUserImageId((UploadUsersImage) uploadUsersImageService.uploadUsersImage(profilePic).getObj());
		researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);

		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		response.setMessage("Saved Successfully!");
		response.setSuccess(true);
		response.setObj(researcherProfilePersonalInfoMaster);

		return response;
	}

	@Override
	public Response saveOtherTabByTabName(String tabName, String body, Optional<MultipartFile[]> files) {
		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		try {
			switch (tabName) {
			case "ProfassionalExprience":
				ProfassionalExprienceRequest[] profassionalExprienceRequestList = new Gson().fromJson(body,
						ProfassionalExprienceRequest[].class);
				Arrays.stream(profassionalExprienceRequestList).forEach(profassionalExprienceRequest -> {
					ProfessionalExperience professionalExperience = new ProfessionalExperience();
					professionalExperience.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(profassionalExprienceRequest, professionalExperience);
					professionalExperienceRepository.save(professionalExperience);
				});
				break;
			case "ProfileTraining":
				List<ProfileTrainingRequest> requestList = objectMapperReadArrayValue(body,
						ProfileTrainingRequest.class);
				requestList.forEach(reqObj -> {
					if (reqObj.getUuid() != null) {
						if (reqObj.getIsDeleted() == 1) {
							ProfileTraining profileTraining = new ProfileTraining();
							BeanUtils.copyProperties(reqObj, profileTraining);
							profileTrainingRepository.delete(profileTraining);
						} else {
							String uuid = reqObj.getUuid();
							if (uuid == null)
								throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
										"No Id Provided for ");
							ProfileTraining e = getByUuidForReadTwo(reqObj.getId());
							reqObj.setId(e.getId());
							reqObj.setUuid(e.getUuid());
							ProfileTraining profileTraining = new ProfileTraining();
							BeanUtils.copyProperties(reqObj, profileTraining);
							profileTraining.setUpdatedOn(LocalDate.now());
							profileTraining.setIsDeleted(false);
							profileTraining.setCreatedBy(e.getCreatedBy());
							profileTraining.setCreatedOn(e.getCreatedOn());
							profileTraining.setEditable(false);
							profileTrainingRepository.save(profileTraining);
						}
					} else {
						ProfileTraining profileTraining = new ProfileTraining();
						BeanUtils.copyProperties(reqObj, profileTraining);
						profileTraining.setUuid(UUID.randomUUID().toString());
						profileTrainingRepository.save(profileTraining);
					}
				});
				break;
			case "PublicationInfo":
				PublicationInfoRequest[] publicationInfoRequestList = new Gson().fromJson(body,
						PublicationInfoRequest[].class);
				for (int i = 0; i < publicationInfoRequestList.length; i++) {
					PublicationInfo publicationInfo = new PublicationInfo();
					publicationInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(publicationInfoRequestList[i], publicationInfo);
					FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
							"rms");
//					publicationInfo.setCertificateImage(UploadRelevantDoc.builder()
//							.relevantDocUrl(fileUploadResponse.getDownloadUrl()).isEditable(false).bucketName("rms")
//							.fileName(fileUploadResponse.getFileName()).build());
					publicationRepository.save(publicationInfo);
				}
				break;
			case "RelativeInfo":

				List<RelativeInfoRequest> relativeInfoRequestList = objectMapperReadArrayValue(body,
						RelativeInfoRequest.class);
				Optional<ResearcherProfilePersonalInfoMaster> infoData = researcherProfilePersonalInfoMasterRepository
						.findById(relativeInfoRequestList.get(0).getProfilePersonalInfoId());
				ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = infoData.get();
				researcherProfilePersonalInfoMaster.setDeclaration("true");
				researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);

				relativeInfoRequestList.forEach(relativeInfoRequest -> {
					if (relativeInfoRequest.getUuid() != null) {
						if (relativeInfoRequest.getIsDeleted() == 1) {
							RelativeInfo relativeInfo = new RelativeInfo();
							BeanUtils.copyProperties(relativeInfoRequest, relativeInfo);
							relativeInfoRepository.delete(relativeInfo);
						} else {
							String uuid = relativeInfoRequest.getUuid();
							if (uuid == null)
								throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
										"No Id Provided for ");
							RelativeInfo e = getByUuidForRead(relativeInfoRequest.getId());

							relativeInfoRequest.setId(e.getId());
							relativeInfoRequest.setUuid(e.getUuid());
							RelativeInfo relativeInfo = new RelativeInfo();
							BeanUtils.copyProperties(relativeInfoRequest, relativeInfo);
							relativeInfo.setUpdatedOn(LocalDate.now());
							relativeInfo.setIsDeleted(false);
							relativeInfo.setCreatedBy(e.getCreatedBy());
							relativeInfo.setCreatedOn(e.getCreatedOn());
							relativeInfo.setEditable(false);
							relativeInfoRepository.save(relativeInfo);
						}
					} else {
						RelativeInfo relativeInfo = new RelativeInfo();
						BeanUtils.copyProperties(relativeInfoRequest, relativeInfo);
						relativeInfo.setUuid(UUID.randomUUID().toString());
						relativeInfoRepository.save(relativeInfo);
					}
				});
				break;
			case "ResearchExpriance":
				ResearchExperienceRequest[] researchExprianceRequestList = new Gson().fromJson(body,
						ResearchExperienceRequest[].class);
				Arrays.stream(researchExprianceRequestList).forEach(researchExprianceRequest -> {
					ResearchExperience researchExperience = new ResearchExperience();
					researchExperience.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(researchExprianceRequest, researchExperience);
					researchExperienceRepository.save(researchExperience);
				});

				break;
			case "EducationInfo":
				EducationInfoRequest[] educationInfoRequestsList = new Gson().fromJson(body,
						EducationInfoRequest[].class);

				for (int i = 0; i < educationInfoRequestsList.length; i++) {
					EducationInfo educationInfo = new EducationInfo();
					educationInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(educationInfoRequestsList[i], educationInfo);
					FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
							"rms");
//					educationInfo.setCertificateImage(UploadCertificateImage.builder()
//							.userCertificateUrl(fileUploadResponse.getDownloadUrl()).isEditable(false).bucketName("rms")
//							.fileName(fileUploadResponse.getFileName()).build());
					educationInfoRepository.save(educationInfo);
				}
				break;
			}

			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		} catch (Exception e) {
			response.setMessage("Save Failed!");
			response.setSuccess(false);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		}
		return response;
	}

	public RelativeInfo getByUuidForRead(@NonNull Long oid) {
		return relativeInfoRepository.findById(oid).orElse(null);
	}

	@Override
	public Response updateOtherTabByTabName(Long researcherProfileId, String tabName, String body,
			Optional<MultipartFile[]> files) {
		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		try {
			switch (tabName) {
			case "ProfassionalExprience":
				professionalExperienceRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				ProfassionalExprienceRequest[] profassionalExprienceRequestList = new Gson().fromJson(body,
						ProfassionalExprienceRequest[].class);
				Arrays.stream(profassionalExprienceRequestList).forEach(profassionalExprienceRequest -> {
					ProfessionalExperience professionalExperience = new ProfessionalExperience();
					professionalExperience.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(profassionalExprienceRequest, professionalExperience);
					professionalExperienceRepository.save(professionalExperience);
				});
				break;
			case "ProfileTraining":
				profileTrainingRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				ProfileTrainingRequest[] profileTrainingRequestList = new Gson().fromJson(body,
						ProfileTrainingRequest[].class);
				Arrays.stream(profileTrainingRequestList).forEach(profileTrainingRequest -> {
					ProfileTraining profileTraining = new ProfileTraining();
					profileTraining.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(profileTrainingRequest, profileTraining);
					profileTrainingRepository.save(profileTraining);
				});
				break;
			case "PublicationInfo":
				publicationRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				PublicationInfoRequest[] publicationInfoRequestList = new Gson().fromJson(body,
						PublicationInfoRequest[].class);
				for (int i = 0; i < publicationInfoRequestList.length; i++) {
					PublicationInfo publicationInfo = new PublicationInfo();
					publicationInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(publicationInfoRequestList[i], publicationInfo);
					if (files.isPresent()) {
						FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
								"rms");
//						publicationInfo.setCertificateImage(UploadRelevantDoc.builder()
//								.relevantDocUrl(fileUploadResponse.getDownloadUrl()).isEditable(false).bucketName("rms")
//								.fileName(fileUploadResponse.getFileName()).build());
					}
					publicationRepository.save(publicationInfo);
				}
				break;
			case "RelativeInfo":
				relativeInfoRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				RelativeInfoRequest[] relativeInfoRequestList = new Gson().fromJson(body, RelativeInfoRequest[].class);
				Arrays.stream(relativeInfoRequestList).forEach(relativeInfoRequest -> {
					RelativeInfo relativeInfo = new RelativeInfo();
					relativeInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(relativeInfoRequest, relativeInfo);
					relativeInfoRepository.save(relativeInfo);

				});
				break;
			case "ResearchExpriance":
				// researchExperienceRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				List<ResearchExperience> researchExperienceList = researchExperienceRepository
						.findAllByProfilePersonalInfoId(researcherProfileId);
				ResearchExperienceRequest[] researchExprianceRequestList = new Gson().fromJson(body,
						ResearchExperienceRequest[].class);

				for (int i = 0; i < researchExprianceRequestList.length; i++) {

					if (researchExprianceRequestList[i].getId() > 0) {

						if (researchExprianceRequestList[i].getIsDeleted() == 1) {
							ResearchExperience researchExperience = new ResearchExperience();
							BeanUtils.copyProperties(researchExprianceRequestList[i], researchExperience);
							researchExperienceRepository.delete(researchExperience);
						} else {
							ResearchExperience researchExperience = researchExperienceList.get(i);
							BeanUtils.copyProperties(researchExprianceRequestList[i], researchExperience);
//									if (!files.get()[i].isEmpty()) {
//										FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],"rms");
//										researchExperience.setResearcherExpObjective(UploadResearcherExpObjectiveImage.builder()
//												.researcherObjectivesUrl(fileUploadResponse.getDownloadUrl()).isEditable(false)
//												.bucketName("rms").fileName(fileUploadResponse.getFileName()).build());
//									}
							researchExperienceRepository.save(researchExperience);
						}
					} else {
						ResearchExperience researchExperience = new ResearchExperience();
						researchExperience.setUuid(UUID.randomUUID().toString());
						BeanUtils.copyProperties(researchExprianceRequestList[i], researchExperience);
//							if (!files.get()[i].isEmpty()) {
//								FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
//										"rms");
//								researchExperience.setResearcherExpObjective(UploadResearcherExpObjectiveImage.builder()
//										.researcherObjectivesUrl(fileUploadResponse.getDownloadUrl()).isEditable(false)
//										.bucketName("rms").fileName(fileUploadResponse.getFileName()).build());
//							}
						researchExperienceRepository.save(researchExperience);
					}

				}
				break;
			case "EducationInfo":

				// educationInfoRepository.deleteAllByProfilePersonalInfoId(researcherProfileId);
				EducationInfoRequest[] educationInfoRequestsList = new Gson()
						.fromJson(this.removeQuotesAndUnescape(body), EducationInfoRequest[].class);
				for (int i = 0; i < educationInfoRequestsList.length; i++) {
					EducationInfo educationInfo = new EducationInfo();
					BeanUtils.copyProperties(educationInfoRequestsList[i], educationInfo);
					if (educationInfo.getUuid() == null) {
						educationInfo.setUuid(UUID.randomUUID().toString());
					}

					if (files.isPresent()) {
						FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
								"rms");
//						educationInfo.setCertificateImage(UploadCertificateImage.builder()
//								.userCertificateUrl(fileUploadResponse.getDownloadUrl()).isEditable(false)
//								.bucketName("rms").fileName(fileUploadResponse.getFileName()).build());
					}
					educationInfoRepository.save(educationInfo);
				}
				break;
			}

			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		} catch (Exception e) {
			response.setMessage("Save Failed!");
			response.setSuccess(false);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		}
		return response;
	}

	private String removeQuotesAndUnescape(String uncleanJson) {
		String noQuotes = uncleanJson.replaceAll("^\"|\"$", "");

		return StringEscapeUtils.unescapeJava(noQuotes);
	}

	@Override
	public Response updateResearcherProfilePersonal(Long researcherProfileId, String tabName, String body,
			Optional<MultipartFile[]> files) {
		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		try {
			switch (tabName) {
			case "ProfassionalExprience":
				ProfassionalExprienceRequest[] profassionalExprienceRequestList = new Gson().fromJson(body,
						ProfassionalExprienceRequest[].class);

				List<ProfessionalExperience> professionalExperienceList = professionalExperienceRepository
						.findAllByProfilePersonalInfoId(researcherProfileId);
				// Delete
				for (int i = 0; i < professionalExperienceList.size(); i++) {
					try {
						if (professionalExperienceList.get(i)
								.getProfilePersonalInfoId() != profassionalExprienceRequestList[i]
										.getProfilePersonalInfoId()) {

						}
					} catch (Exception ex) {
						professionalExperienceRepository.deleteByProfilePersonalInfoId(
								professionalExperienceList.get(i).getProfilePersonalInfoId());
					}

				}

				// Update and add
				for (int i = 0; i < profassionalExprienceRequestList.length; i++) {
					try {
						ProfessionalExperience professionalExperience = professionalExperienceList.get(i);
						BeanUtils.copyProperties(profassionalExprienceRequestList[i], professionalExperience);
						professionalExperienceRepository.save(professionalExperience);
					} catch (Exception ex) {
						ProfessionalExperience professionalExperience = new ProfessionalExperience();
						professionalExperience.setUuid(UUID.randomUUID().toString());
						BeanUtils.copyProperties(profassionalExprienceRequestList[i], professionalExperience);
						professionalExperienceRepository.save(professionalExperience);
					}

				}
				break;
			case "ProfileTraining":
				ProfileTrainingRequest[] profileTrainingRequestList = new Gson().fromJson(body,
						ProfileTrainingRequest[].class);

				Arrays.stream(profileTrainingRequestList).forEach(profileTrainingRequest -> {
					ProfileTraining profileTraining = new ProfileTraining();
					profileTraining.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(profileTrainingRequest, profileTraining);
					profileTrainingRepository.save(profileTraining);
				});
				break;
			case "PublicationInfo":
				PublicationInfoRequest[] publicationInfoRequestList = new Gson().fromJson(body,
						PublicationInfoRequest[].class);
				for (int i = 0; i < publicationInfoRequestList.length; i++) {
					PublicationInfo publicationInfo = new PublicationInfo();
					publicationInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(publicationInfoRequestList[i], publicationInfo);
					FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
							"rms");
//					publicationInfo.setCertificateImage(UploadRelevantDoc.builder()
//							.relevantDocUrl(fileUploadResponse.getDownloadUrl()).isEditable(false).bucketName("rms")
//							.fileName(fileUploadResponse.getFileName()).build());
					publicationRepository.save(publicationInfo);
				}
				break;
			case "RelativeInfo":
				RelativeInfoRequest[] relativeInfoRequestList = new Gson().fromJson(body, RelativeInfoRequest[].class);
				Arrays.stream(relativeInfoRequestList).forEach(relativeInfoRequest -> {
					RelativeInfo relativeInfo = new RelativeInfo();
					relativeInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(relativeInfoRequest, relativeInfo);
					relativeInfoRepository.save(relativeInfo);
				});
				break;
			case "ResearchExpriance":
				ResearchExperienceRequest[] researchExprianceRequestList = new Gson().fromJson(body,
						ResearchExperienceRequest[].class);
				Arrays.stream(researchExprianceRequestList).forEach(researchExprianceRequest -> {
					ResearchExperience researchExperience = new ResearchExperience();
					researchExperience.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(researchExprianceRequest, researchExperience);
					researchExperienceRepository.save(researchExperience);
				});

				break;
			case "EducationInfo":
				EducationInfoRequest[] educationInfoRequestsList = new Gson().fromJson(body,
						EducationInfoRequest[].class);

				for (int i = 0; i < educationInfoRequestsList.length; i++) {
					EducationInfo educationInfo = new EducationInfo();
					educationInfo.setUuid(UUID.randomUUID().toString());
					BeanUtils.copyProperties(educationInfoRequestsList[i], educationInfo);
					FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(files.get()[i],
							"rms");
//					educationInfo.setCertificateImage(UploadCertificateImage.builder()
//							.userCertificateUrl(fileUploadResponse.getDownloadUrl()).isEditable(false).bucketName("rms")
//							.fileName(fileUploadResponse.getFileName()).build());
					educationInfoRepository.save(educationInfo);
				}
				break;
			}

			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		} catch (Exception e) {
			response.setMessage("Save Failed!");
			response.setSuccess(false);
			response.setObj(new ResearcherProfilePersonalInfoMaster());
		}
		return response;
	}

	@Override
	public Response saveTabOne(Optional<MultipartFile[]> files, String body) {

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster();

		ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest = new Gson()
				.fromJson(body, ResearcherProfilePersonalInfoMasterRequest.class);
		BeanUtils.copyProperties(researcherProfilePersonalInfoMasterRequest, researcherProfilePersonalInfoMaster);

		UploadUsersImage uploadUsersImage = null;
		UserSignature userSignature = null;
		if (files.isPresent() && files.get().length > 0) {

			FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
			uploadUsersImage = new UploadUsersImage();

			uploadUsersImage.setBucketName(profilePicDetails.getBucketName());
			uploadUsersImage.setFileName(profilePicDetails.getFileName());
			uploadUsersImage.setUserImageUrl(profilePicDetails.getDownloadUrl());
			uploadUsersImage.setActive(true);
			researcherProfilePersonalInfoMaster.setRmsUserImageId(uploadUsersImage);

			FileUploadResponse signaturePicDetails = minioServerService.getFileDownloadUrl(files.get()[1], "rms");
			userSignature = new UserSignature();
			userSignature.setBucketName(signaturePicDetails.getBucketName());
			userSignature.setFileName(signaturePicDetails.getFileName());
			userSignature.setSignatureImageUrl(signaturePicDetails.getDownloadUrl());
			userSignature.setActive(true);
			researcherProfilePersonalInfoMaster.setRmsUserSignatureId(userSignature);
		}

		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		if (uploadUsersImage != null && userSignature != null) {
			researcherProfilePersonalInfoMaster.setUuid(idGeneratorComponent.generateUUID());
			researcherProfilePersonalInfoMaster
					.setUserId(Long.parseLong(researcherProfilePersonalInfoMasterRequest.getUserId()));
			researcherProfilePersonalInfoMaster.setRegNumber("RMS-" + System.currentTimeMillis());
			researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);
			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(researcherProfilePersonalInfoMaster);

		} else {
			response.setMessage("Saving Failed");
			response.setSuccess(false);
		}

		return response;
	}

	@Override
	public Page<ResearcherProfilePersonalInfoMaster> findAll(int offset, int pageSize) {
		return researcherProfilePersonalInfoMasterRepository.findAllByIsDeletedOrderByIdDesc(false,
				PageRequest.of(offset, pageSize));
	}

	@Override
	public Page<ResearcherProfilePersonalInfoMaster> findAllByLoggedUser(String createdBy, int offset, int pageSize) {
		return researcherProfilePersonalInfoMasterRepository.findAllByIsDeletedAndCreatedByOrderByIdDesc(false,
				createdBy, PageRequest.of(offset, pageSize));
	}

	@Override
	public Map<String, Object> getProfileView(String uuId) throws ExecutionException, InterruptedException {

		// calling tab one
		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = profileViewService
				.getPersonalInfo(uuId).get();

		ResearcherProfilePersonalInfoMasterResponse personalInfoMasterResponse = new ModelMapper()
				.map(researcherProfilePersonalInfoMaster, ResearcherProfilePersonalInfoMasterResponse.class);

		if (researcherProfilePersonalInfoMaster.getDivisionId() != null) {

			Response<DivisionResponse> response = rmsConfigurationClientService
					.findByDivisionId(researcherProfilePersonalInfoMaster.getDivisionId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setDivisionDto(response.getObj());
			}

		}

		if (researcherProfilePersonalInfoMaster.getDistrictId() != null) {

			Response<ZillaResponse> response = rmsConfigurationClientService
					.findByZillaId(researcherProfilePersonalInfoMaster.getDistrictId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setDistrictDto(response.getObj());
			}
		}

		if (researcherProfilePersonalInfoMaster.getUpzilaId() != null) {

			Response<UpaZillaResponse> response = rmsConfigurationClientService
					.findByUpazillaId(researcherProfilePersonalInfoMaster.getUpzilaId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setUpzilaDto(response.getObj());
			}
		}

//		if (researcherProfilePersonalInfoMaster.getUnionId() != null) {
//
//		}

		/* pre */

		if (researcherProfilePersonalInfoMaster.getPreDivisionId() != null) {

			Response<DivisionResponse> response = rmsConfigurationClientService
					.findByDivisionId(researcherProfilePersonalInfoMaster.getPreDivisionId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setPreDivisionDto(response.getObj());
			}
		}

		if (researcherProfilePersonalInfoMaster.getPreDistrictId() != null) {

			Response<ZillaResponse> response = rmsConfigurationClientService
					.findByZillaId(researcherProfilePersonalInfoMaster.getPreDistrictId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setPreDistrictDto(response.getObj());
			}

		}

		if (researcherProfilePersonalInfoMaster.getPreUpzilaId() != null) {

			Response<UpaZillaResponse> response = rmsConfigurationClientService
					.findByUpazillaId(researcherProfilePersonalInfoMaster.getPreUpzilaId());

			if (response.isSuccess() && response.getObj() != null) {
				personalInfoMasterResponse.setPreUpzilaDto(response.getObj());
			}

		}

//		if (researcherProfilePersonalInfoMaster.getPreUnionId() != null) {
//
//		}

		List<ResearcherProposalDto> researcherProposalList = findAllByResearcherProfileUuid(uuId);

		// id for others tab
		Long id = researcherProfilePersonalInfoMaster.getId();

		// calling tab two
		List<RelativeInfo> relativeInfos = profileViewService.getRelativeInfo(id).get();

		// calling tab three
		List<EducationInfo> educationInfos = profileViewService.getEducationInfo(id).get();

		// calling tab four

		List<PublicationInfo> publicationInfos = profileViewService.getPublicationInfo(id).get();

		// calling tab five

		List<ProfessionalExperience> professionalExperiences = profileViewService.professionalExperience(id).get();

		// calling tab six
		List<ResearchExperience> researchExperiences = profileViewService.researchExperience(id).get();

		// calling tab seven

		List<ProfileTraining> trainings = profileViewService.getTrainingInfo(id).get();

		List<ResearcherProfileRscWorkingInOrg> researcherProfileRscWorkingInOrgList = researcherProfileRscWorkingInOrgRepository
				.findAllByResearcherProfileIdAndIsDeleted(researcherProfilePersonalInfoMaster, false);

		Map<String, Object> allTab = new HashMap<>();
		allTab.put("personalInfo", personalInfoMasterResponse);
		allTab.put("relativeInfos", relativeInfos);
		allTab.put("educationInfos", educationInfos);
		allTab.put("publicationInfos", publicationInfos);
		allTab.put("professionalExperiences", professionalExperiences);
		allTab.put("researchExperiences", researchExperiences);
		allTab.put("trainings", trainings);
		allTab.put("minio", minIOHost);
		allTab.put("researcherProposalList", researcherProposalList);
		allTab.put("researcherProfileRscWorkingInOrgList", researcherProfileRscWorkingInOrgList);
		return allTab;
	}

	@Override
	public BooleanValueHolderDTO deletePersonInfoData(String uuId) {

		Optional<ResearcherProfilePersonalInfoMaster> personalInfos = researcherProfilePersonalInfoMasterRepository
				.findByUuid(uuId);

		if (personalInfos.isPresent()) {
			BooleanValueHolderDTO booleanValueHolderDTO = new BooleanValueHolderDTO();
			ResearcherProfilePersonalInfoMaster infoMaster = personalInfos.get();
			infoMaster.setIsDeleted(true);
			try {
				researcherProfilePersonalInfoMasterRepository.save(infoMaster);
				booleanValueHolderDTO.setSuccess(true);
				booleanValueHolderDTO.setMessage("Deleted Successfully");
				return booleanValueHolderDTO;
			} catch (Exception e) {
				booleanValueHolderDTO.setSuccess(false);
				booleanValueHolderDTO.setMessage("Delete failed !!");
				return booleanValueHolderDTO;
			}

		} else {
			new RuntimeException("No data Found ");
		}

		return null;
	}

	@Override
	public Response<ResearcherProfilePersonalInfoMaster> getByUuid(String researcherProfileInfoUuid) {
		Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterRepository
				.findByUuidAndIsDeleted(researcherProfileInfoUuid, false);

		if (researcherProfilePersonalInfoMaster.isPresent()) {
			return new Response<>() {
				{
					setSuccess(true);
					setMessage("Data Found");
					setObj(researcherProfilePersonalInfoMaster.get());
				}
			};
		}
		return new Response<>() {
			{
				setSuccess(false);
				setMessage("Data Not Found");
			}
		};
	}

	public ResearcherProfileResponse getResearcherProfileUuidByUserId(Long userId) {

		Optional<ResearcherProfilePersonalInfoMaster> researcherProfileResponse = researcherProfilePersonalInfoMasterRepository
				.findByUserIdAndIsDeleted(userId, false);
		ResearcherProfileResponse data = new ResearcherProfileResponse();
		if (researcherProfileResponse.isPresent()) {
			ResearcherProfilePersonalInfoMaster researcherProfileResponse1 = researcherProfileResponse.get();
			BeanUtils.copyProperties(researcherProfileResponse1, data);
			data.setMinio(minIOHost);
			return data;
		}
		return null;
	}

	public ResearcherProfileResponse getResearcherProfileByEmailAndType(String email, boolean isInstitutional) {

		Optional<ResearcherProfilePersonalInfoMaster> researcherProfileResponse = researcherProfilePersonalInfoMasterRepository
				.findByEmailAddressAndIsInstitutionalAndIsDeleted(email, isInstitutional, false);
		ResearcherProfileResponse data = new ResearcherProfileResponse();
		if (researcherProfileResponse.isPresent()) {
			ResearcherProfilePersonalInfoMaster researcherProfileResponse1 = researcherProfileResponse.get();
			BeanUtils.copyProperties(researcherProfileResponse1, data);
			data.setMinio(minIOHost);
			return data;
		}
		return null;
	}

	@Override
	public AccessTokenDetail tokenDetails() {
		return (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication()
				.getDetails()).getDecodedDetails();
	}

	@Override
	public Response<ResearcherProfilePersonalInfoMaster> getById(Long id) {
		Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterRepository
				.findByIdAndIsDeleted(id, false);

		if (researcherProfilePersonalInfoMaster.isPresent()) {
			return new Response<>() {
				{
					setSuccess(true);
					setMessage("Data Found");
					setObj(researcherProfilePersonalInfoMaster.get());
				}
			};
		}
		return new Response<>() {
			{
				setSuccess(false);
				setMessage("Data Not Found");
			}
		};
	}

	@Override
	public Response updateTabOne(String id, Optional<MultipartFile[]> files, Number fileIndex, String body) {

		Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMasterOptional = researcherProfilePersonalInfoMasterRepository
				.findByUuid(id);
		if (!researcherProfilePersonalInfoMasterOptional.isPresent()) {

		}
		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterOptional
				.get();

		ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest = new Gson()
				.fromJson(body, ResearcherProfilePersonalInfoMasterRequest.class);
		BeanUtils.copyProperties(researcherProfilePersonalInfoMasterRequest, researcherProfilePersonalInfoMaster);
		UploadUsersImage uploadUsersImage = null;
		UserSignature userSignature = null;
		if (files.isPresent()) {
			if (files.isPresent() && files.get().length > 0) {

				if(fileIndex.intValue() == 0 || files.get().length == 2) {
					FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
					uploadUsersImage = new UploadUsersImage();

					uploadUsersImage.setBucketName(profilePicDetails.getBucketName());
					uploadUsersImage.setFileName(profilePicDetails.getFileName());
					uploadUsersImage.setUserImageUrl(profilePicDetails.getDownloadUrl());
					uploadUsersImage.setActive(true);
					researcherProfilePersonalInfoMaster.setRmsUserImageId(uploadUsersImage);
				}
				if(fileIndex.intValue() == 1 || files.get().length == 2){
					Integer index = (files.get().length == 1) ? 0 : 1;
					FileUploadResponse signaturePicDetails = minioServerService.getFileDownloadUrl(files.get()[index], "rms");
					userSignature = new UserSignature();
					userSignature.setBucketName(signaturePicDetails.getBucketName());
					userSignature.setFileName(signaturePicDetails.getFileName());
					userSignature.setSignatureImageUrl(signaturePicDetails.getDownloadUrl());
					userSignature.setActive(true);
					researcherProfilePersonalInfoMaster.setRmsUserSignatureId(userSignature);
				}
			}
		}
		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
//        if (uploadUsersImage != null && userSignature != null) {
		// researcherProfilePersonalInfoMaster.setUuid(idGeneratorComponent.generateUUID());
		// researcherProfilePersonalInfoMaster
		// .setUserId(Long.parseLong(researcherProfilePersonalInfoMasterRequest.getUserId()));
		// researcherProfilePersonalInfoMaster.setRegNumber("RMS-" +
		// System.currentTimeMillis());
		researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);
		response.setMessage("Saved Successfully!");
		response.setSuccess(true);
		response.setObj(researcherProfilePersonalInfoMaster);

		return response;
	}

	public List<ResearcherProposalDto> findAllByResearcherProfileUuid(String uuid) {
		List<Object> list = researcherProposalRepository.findAllByResearcherProfileUuid(uuid);
		List<ResearcherProposalDto> responseList = new ArrayList<ResearcherProposalDto>();

		if (list != null) {

			for (Object l : list) {

				ResearcherProposalDto object = new ResearcherProposalDto();
				Object[] m = (Object[]) l;

				if (m[0] != null) {
					object.setId(Long.parseLong(m[0].toString()));
				}

				if (m[1] != null) {
					object.setResearchTitle(m[1].toString());
				}

				if (m[2] != null) {
					object.setStResearchCatTypeId(Long.parseLong(m[2].toString()));
					object.setResearchCatTypeName(rmsConfigurationClientService
							.getByResearchCategoryTypeId(object.getStResearchCatTypeId()).getObj().getCategoryName());
				}

				if (m[3] != null) {
					object.setStFiscalYearId(Long.parseLong(m[3].toString()));
					object.setFiscalYearName(rmsConfigurationClientService.getByFiscalYearId(object.getStFiscalYearId())
							.getObj().getFiscalYear());
				}

				if (m[4] != null) {
					object.setApprovalStatus(Long.parseLong(m[4].toString()));
				}

				if (m[5] != null) {
					object.setSupervisorName(m[5].toString());
				}

				if (m[6] != null) {
					object.setStProfileOfExpertEvaluatorsId(Long.parseLong(m[6].toString()));
					Response<ExpertEvaluatorResponseDto> response = rmsConfigurationClientService
							.getByExpertEvaluatorId(object.getStProfileOfExpertEvaluatorsId());

					if (response.getObj() != null) {
						object.setProfileOfExpertEvaluatorsName(response.getObj().getName());
					}

				}
				responseList.add(object);
			}

		}
		return responseList;
	}

	@Override
	public Response saveResearcherProfilePersonalInstitutionalInfo(Optional<MultipartFile> files, String body) {

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = new ResearcherProfilePersonalInfoMaster();

		ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest = new Gson()
				.fromJson(body, ResearcherProfilePersonalInfoMasterRequest.class);

		BeanUtils.copyProperties(researcherProfilePersonalInfoMasterRequest, researcherProfilePersonalInfoMaster);

		ResearcherProfileUploadAcknowledgementIncomeTax uploadUsersImage = null;

		if (files.isPresent()) {
			FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get(), "rms");
			uploadUsersImage = new ResearcherProfileUploadAcknowledgementIncomeTax();
			uploadUsersImage.setBucketName(profilePicDetails.getBucketName());
			uploadUsersImage.setFileName(profilePicDetails.getFileName());
			uploadUsersImage.setDownloadUrl(profilePicDetails.getDownloadUrl());
			researcherProfilePersonalInfoMaster.setResearcherProfileUploadAcknowledgementIncomeTaxId(uploadUsersImage);
		}

		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();
		//if (uploadUsersImage != null) {
			researcherProfilePersonalInfoMaster.setUuid(idGeneratorComponent.generateUUID());
			researcherProfilePersonalInfoMaster
					.setUserId(Long.parseLong(researcherProfilePersonalInfoMasterRequest.getUserId()));
			researcherProfilePersonalInfoMaster.setRegNumber("RMS-" + System.currentTimeMillis());
			researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);
			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(researcherProfilePersonalInfoMaster);
//		} else {
//			response.setMessage("Saving Failed");
//			response.setSuccess(false);
//		}
		return response;
	}

	@Override
	public Response updateResearcherProfilePersonalInstitutionalInfo(String id, Optional<MultipartFile> files,
			String body) {

		Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMasterOptional = researcherProfilePersonalInfoMasterRepository
				.findByUuid(id);

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterOptional
				.get();

		ResearcherProfilePersonalInfoMasterRequest researcherProfilePersonalInfoMasterRequest = new Gson()
				.fromJson(body, ResearcherProfilePersonalInfoMasterRequest.class);
		BeanUtils.copyProperties(researcherProfilePersonalInfoMasterRequest, researcherProfilePersonalInfoMaster);
		ResearcherProfileUploadAcknowledgementIncomeTax uploadUsersImage = null;

		if (files.isPresent()) {
			FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get(), "rms");
			uploadUsersImage = new ResearcherProfileUploadAcknowledgementIncomeTax();
			uploadUsersImage.setBucketName(profilePicDetails.getBucketName());
			uploadUsersImage.setFileName(profilePicDetails.getFileName());
			uploadUsersImage.setDownloadUrl(profilePicDetails.getDownloadUrl());
			researcherProfilePersonalInfoMaster.setResearcherProfileUploadAcknowledgementIncomeTaxId(uploadUsersImage);
		}
		Response<ResearcherProfilePersonalInfoMaster> response = new Response<>();

//		researcherProfilePersonalInfoMaster.setUuid(idGeneratorComponent.generateUUID());
//		researcherProfilePersonalInfoMaster.setUserId(Long.parseLong(researcherProfilePersonalInfoMasterRequest.getUserId()));
//		researcherProfilePersonalInfoMaster.setRegNumber("RMS-" + System.currentTimeMillis());

		researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);
		response.setMessage("Saved Successfully!");
		response.setSuccess(true);
		response.setObj(researcherProfilePersonalInfoMaster);
		return response;
	}

	@Override
	public Response<ResearchProfileWithRelatedInfoResponse> getEducationInfoByProfileUuid(String uuid)
			throws ExecutionException, InterruptedException {

		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = profileViewService
				.getPersonalInfo(uuid).get();

		if (researcherProfilePersonalInfoMaster == null) {
			return new Response<>() {
				{
					setMessage("Data Empty");
				}
			};
		}

//      ResearcherProfilePersonalInfoMasterResponse personalInfoMasterResponse = new ModelMapper().map(researcherProfilePersonalInfoMaster, ResearcherProfilePersonalInfoMasterResponse.class);

		List<EducationInfo> educationInfos = profileViewService
				.getEducationInfo(researcherProfilePersonalInfoMaster.getId()).get();

		ResearchProfileWithRelatedInfoResponse response = new ModelMapper().map(researcherProfilePersonalInfoMaster,
				ResearchProfileWithRelatedInfoResponse.class);

		response.setTotalResearch(researcherProfilePersonalInfoMasterRepository
				.findTotalResearchByProfileId(researcherProfilePersonalInfoMaster.getId()));
		response.setEmployeeType(researcherProfilePersonalInfoMasterRepository
				.findEmpTypeByProfileId(researcherProfilePersonalInfoMaster.getId()));

		if (!educationInfos.isEmpty()) {
			response.setEducationInfoList(educationInfos.stream()
					.map(m -> new ModelMapper().map(m, EducationInfoResponse.class)).collect(Collectors.toList()));
		}

		return new Response<>() {
			{
				setMessage("Data Found");
				setObj(response);
			}
		};
	}

	@Override
	public Response updateDeclarationTabOne(DeclarationPersonalProfileRequest declarationPersonalProfileRequest) {
		Optional<ResearcherProfilePersonalInfoMaster> infoData = researcherProfilePersonalInfoMasterRepository
				.findByUuid(declarationPersonalProfileRequest.getId());
		ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = infoData.get();

		researcherProfilePersonalInfoMaster.setDeclaration(declarationPersonalProfileRequest.getDeclaration());

		researcherProfilePersonalInfoMasterRepository.save(researcherProfilePersonalInfoMaster);

		return new Response() {
			{
				setSuccess(true);
				setMessage("Save successfully");
				setObj(researcherProfilePersonalInfoMaster);
			}
		};
	}

	@Override
	public List<ResearcherProfilePersonalInfoMaster> findResearcherProfilePersonalInfoByUserId(Long id) {
		return researcherProfilePersonalInfoMasterRepository.findAllByUserIdAndIsDeleted(id, false);
	}

	@Override
	public Response getProfileStatusFindByUuid(String uuid) {

		try {
			Object[] response = (Object[]) researcherProfilePersonalInfoMasterRepository
					.getProfileStatusFindByUuid(uuid);

			ProfileStatusResponeDto dto = new ProfileStatusResponeDto();

			if (response[0] != null) {
				dto.setId(Long.parseLong(response[0].toString()));
			}

			if (response[1] != null) {
				dto.setEducationInfoId(Long.parseLong(response[1].toString()));
			}

			if (response[2] != null) {
				dto.setProfessionalExpId(Long.parseLong(response[2].toString()));
			}

			if (response[3] != null) {
				dto.setPublicationInfoId(Long.parseLong(response[3].toString()));
			}

			if (response[4] != null) {
				dto.setRelativeInfoId(Long.parseLong(response[4].toString()));
			}

			if (response[5] != null) {
				dto.setResearchExpId(Long.parseLong(response[5].toString()));
			}

			if (response[6] != null) {
				dto.setTrainingInfoId(Long.parseLong(response[6].toString()));

			}

			if (response[7] != null) {
				dto.setRscWorkingInOrgId(Long.parseLong(response[7].toString()));
			}

			return new Response() {
				{
					setMessage("Data Found !");
					setSuccess(true);
					setObj(dto);
				}
			};
		} catch (Exception e) {
			return new Response() {
				{
					setMessage(e.getMessage());
					setSuccess(false);
				}
			};
		}

	}

	@Override
	public Response doSaveOrUpdateEducation(EducationInfo[] educationInfoRequest, Long profileId) {
		Response<EducationInfo> educationInfoResponse = new Response<>();
		List<EducationInfo> educationInfos = new ArrayList<>();

		for (EducationInfo infoRequest : educationInfoRequest) {
			infoRequest.setProfilePersonalInfoId(profileId);
			if (infoRequest.getUuid() == null) {
				infoRequest.setUuid(UUID.randomUUID().toString());
			}
			educationInfos.add(infoRequest);
		}
		List<EducationInfo> educationInfos1 = educationInfoRepository.saveAll(educationInfos);
		educationInfoResponse.setSuccess(true);
		educationInfoResponse.setMessage("Data Found");
		educationInfoResponse.setItems(educationInfos1);
		return educationInfoResponse;
	}

	@Override
	public Response doSaveOrUpdatePublication(PublicationInfo[] publication, Long profileId) {
		Response<PublicationInfo> educationInfoResponse = new Response<>();
		List<PublicationInfo> publicationInfos = new ArrayList<>();

		for (PublicationInfo infoRequest : publication) {
			infoRequest.setProfilePersonalInfoId(profileId);

			if (infoRequest.getUuid() == null) {
				infoRequest.setUuid(UUID.randomUUID().toString());
			}
			publicationInfos.add(infoRequest);
		}
		List<PublicationInfo> infos = publicationRepository.saveAll(publicationInfos);
		educationInfoResponse.setSuccess(true);
		educationInfoResponse.setMessage("Data Found");
		educationInfoResponse.setItems(infos);

		return educationInfoResponse;
	}

	@Override
	public Response saveRresearcherExperience(ResearchExperience[] researchExperience, Long profileId) {
		Response<ResearchExperience> researchExperienceResponse = new Response<>();
		List<ResearchExperience> researchExperiences = new ArrayList<>();

//		if (researchExperience != null && researchExperience.length > 0) {
//
//		 List<Long> idList=	Arrays.asList(researchExperience).stream().filter(f->f.getIsDeleted()).map(m->m.getId()).collect(Collectors.toList());
//		 researchExperienceRepository.deleteAll(idList);;
//		}

		for (ResearchExperience infoRequest : researchExperience) {
			infoRequest.setProfilePersonalInfoId(profileId);

			if (infoRequest.getUuid() == null) {
				infoRequest.setUuid(UUID.randomUUID().toString());
			}
			researchExperiences.add(infoRequest);
		}
		List<ResearchExperience> infos = researchExperienceRepository.saveAll(researchExperiences);
		infos = infos.stream().filter(f-> !f.getIsDeleted()).collect(Collectors.toList());
		researchExperienceResponse.setSuccess(true);
		researchExperienceResponse.setMessage("Data Found");
		researchExperienceResponse.setItems(infos);

		return researchExperienceResponse;
	}

	public ProfileTraining getByUuidForReadTwo(@NonNull Long oid) {
		return profileTrainingRepository.findById(oid).orElse(null);
	}

	public Response saveUpdateNotApplicable(NotApplicableFormsRequestDto notApplicableFormsRequestDto){

		Optional<NotApplicableForms> forms = notApplicableFormsRepository.findByM1ResearcherProfilePersonalInfoIdAndModelName(notApplicableFormsRequestDto.getM1ResearcherProfilePersonalInfoId(), notApplicableFormsRequestDto.getModelName());

		if(forms.isPresent()){
			NotApplicableForms notApplicableForms = forms.get();
			BeanUtils.copyProperties(notApplicableFormsRequestDto, notApplicableForms);
			notApplicableForms.setId(notApplicableFormsRequestDto.getId());

			notApplicableForms.setUpdatedBy("user");
			notApplicableForms.setUpdatedOn(LocalDate.now());
			notApplicableForms.setIsDeleted(false);
			notApplicableFormsRepository.save(notApplicableForms);
			return new Response() {
				{
					setMessage("Update Successfull");
					setSuccess(true);
					setObj(forms);
				}
			};
		}
		else
		{
			NotApplicableForms notApplicableForms = new NotApplicableForms();
			BeanUtils.copyProperties(notApplicableFormsRequestDto, notApplicableForms);

			notApplicableForms.setUuid(UUID.randomUUID().toString());
			notApplicableForms.setCreatedBy("user");
			notApplicableForms.setCreatedOn(LocalDate.now());
			notApplicableForms.setIsDeleted(false);

			NotApplicableForms notApplicableData = notApplicableFormsRepository.save(notApplicableForms);

			return new Response() {
				{
					setMessage("Saved Successfull !");
					setSuccess(true);
					setObj(notApplicableData);
				}
			};
		}
	}

	public Response getNotApplicable(Long rmsProfileId, String modelName){
		Optional<NotApplicableForms> forms = notApplicableFormsRepository.findByM1ResearcherProfilePersonalInfoIdAndModelName(rmsProfileId, modelName);
		if(forms.isPresent()){
			return new Response() {
				{
					setMessage("Data found");
					setSuccess(true);
					setObj(forms.get());
				}
			};
		}
		else
		{
			return new Response() {
				{
					setMessage("Data not found");
					setSuccess(false);
				}
			};
		}

	}



}
