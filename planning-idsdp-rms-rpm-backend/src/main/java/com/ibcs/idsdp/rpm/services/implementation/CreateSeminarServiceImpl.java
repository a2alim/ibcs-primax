package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.apache.commons.collections.ListUtils;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.DivisionResponse;
import com.ibcs.idsdp.rpm.client.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.rpm.client.dto.response.ZillaResponse;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarParticipating;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarTimeSchedule;
import com.ibcs.idsdp.rpm.model.domain.MemberInSeminar;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarTimeScheduleRepository;
import com.ibcs.idsdp.rpm.model.repositories.MemberInSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.ParticipatingSeminarRepository;
import com.ibcs.idsdp.rpm.services.CreateSeminarService;
import com.ibcs.idsdp.rpm.services.LinkupProposalWithEvaluatorsService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class CreateSeminarServiceImpl extends	BaseService<CreateSeminar, CreateSeminarRequestDto, CreateSeminarResponseDto> implements CreateSeminarService {

	private final CreateSeminarRepository createSeminarRepository;
	private final ParticipatingSeminarRepository participatingSeminarRepository;
	private final CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository;
	private final UaaClientService uaaClientService;
	private final MemberInSeminarRepository memberInSeminarRepository;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService;

	public CreateSeminarServiceImpl(ServiceRepository<CreateSeminar> repository,
			CreateSeminarRepository createSeminarRepository,
			ParticipatingSeminarRepository participatingSeminarRepository,
			CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository, UaaClientService uaaClientService,
			MemberInSeminarRepository memberInSeminarRepository,
			RmsConfigurationClientService rmsConfigurationClientService,
			LinkupProposalWithEvaluatorsService linkupProposalWithEvaluatorsService) {
		super(repository);
		this.createSeminarRepository = createSeminarRepository;
		this.participatingSeminarRepository = participatingSeminarRepository;
		this.createSeminarTimeScheduleRepository = createSeminarTimeScheduleRepository;
		this.uaaClientService = uaaClientService;
		this.memberInSeminarRepository = memberInSeminarRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.linkupProposalWithEvaluatorsService = linkupProposalWithEvaluatorsService;
	}

	@Override
	public Response<Map<String, Object>> getSeminarView(Long id) {

		Optional<CreateSeminar> createSeminarOptional = createSeminarRepository.findById(id);
		Optional<CreateSeminarParticipating> createSeminarParticipating = participatingSeminarRepository.findByM2CreateSeminarIdAndIsDeleted(createSeminarOptional.get(), false);
		List<CreateSeminarTimeSchedule> createSeminarTimeScheduleOptional = createSeminarTimeScheduleRepository.findAllByM2CreateSeminarIdAndIsDeleted(createSeminarOptional.get(), false);

		Map<String, Object> map = new HashMap<>();

		if (createSeminarOptional.isPresent()) {
			map.put("createSeminarOptional", createSeminarOptional.get());

		}
		if (createSeminarParticipating.isPresent()) {
			map.put("createSeminarParticipating", createSeminarParticipating.get());
		}

		if (!createSeminarTimeScheduleOptional.isEmpty()) {
			List<CreateSeminarTimeSchedule> createSeminarTimeScheduleList = new ArrayList<CreateSeminarTimeSchedule>();
			createSeminarTimeScheduleOptional.forEach(createSeminarTimeSchedule -> {

				if (createSeminarTimeSchedule.getConcernedPersonUserId() != 0) {
					createSeminarTimeSchedule.setUser(uaaClientService.getUser(createSeminarTimeSchedule.getConcernedPersonUserId()).getBody());
				}

				if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null
						&& createSeminarTimeSchedule.getM1ResearcherProposalId().getStResearchCatTypeId() != null) {
					createSeminarTimeSchedule.getM1ResearcherProposalId()
							.setCategoryType(rmsConfigurationClientService.getByResearchCategoryTypeId(
									createSeminarTimeSchedule.getM1ResearcherProposalId().getStResearchCatTypeId())
									.getObj());
				}

				if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null
						&& createSeminarTimeSchedule.getM1ResearcherProposalId().getStSectorTypeId() != null) {
					createSeminarTimeSchedule.getM1ResearcherProposalId()
							.setFieldName(rmsConfigurationClientService
									.getBySectorTypeId(
											createSeminarTimeSchedule.getM1ResearcherProposalId().getStSectorTypeId())
									.getObj());
				}

				if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null && createSeminarTimeSchedule
						.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster() != null) {

					createSeminarTimeSchedule.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster()
							.setUserDto(uaaClientService.getUser(createSeminarTimeSchedule.getM1ResearcherProposalId()
									.getResearcherProfilePersonalInfoMaster().getUserId()).getBody());
				}

				if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null) {
					Response<LinkupProposalWithEvaluatorsResponseDto> response = linkupProposalWithEvaluatorsService
							.findByResearcherProposal(createSeminarTimeSchedule.getM1ResearcherProposalId().getId());
					if (response.isSuccess() && response.getObj() != null) {
						createSeminarTimeSchedule.setLinkupProposalWithEvaluatorsResponseDto(response.getObj());
					}

				}

				createSeminarTimeScheduleList.add(createSeminarTimeSchedule);
			});

			Collections.sort(createSeminarTimeScheduleList,
					(o1, o2) -> Integer.parseInt(o1.getId().toString()) - Integer.parseInt(o2.getId().toString()));
			map.put("createSeminarTimeScheduleOptional", createSeminarTimeScheduleList);
		}

		Response<Map<String, Object>> response = new Response<>();
		response.setSuccess(true);
		response.setMessage("Data found");
		response.setObj(map);
		return response;
	}

	@Override
	public Response<Map<String, Object>> seminarDetailsFindBySeminarId(Long seminarId) {

		try {

			Map<String, Object> map = new HashMap<>();
			Optional<CreateSeminar> createSeminarOptional = createSeminarRepository.findById(seminarId);
			List<CreateSeminarTimeSchedule> createSeminarTimeScheduleList = createSeminarTimeScheduleRepository.findAllByM2CreateSeminarIdAndIsDeleted(createSeminarOptional.get(), false);
			List<CreateSeminarTimeSchedule> createSeminarTimeScheduleResearcherList = new ArrayList<CreateSeminarTimeSchedule>();
			List<CreateSeminarTimeSchedule> createSeminarTimeScheduleLeadList = new ArrayList<CreateSeminarTimeSchedule>();
			List<MemberInSeminar> memberInSeminarList = memberInSeminarRepository.findAllByCreateSeminarIdAndIsDeleted(new CreateSeminar() {{setId(seminarId);}}, false);


			List<CreateSeminarTimeSchedule> timeScheduleLeadList = new ArrayList<CreateSeminarTimeSchedule>();
			List<CreateSeminarTimeSchedule> timeScheduleResearcherList = new ArrayList<CreateSeminarTimeSchedule>();
			List<CreateSeminarTimeSchedule>  timeScheduleOthersList = new ArrayList<CreateSeminarTimeSchedule>();

			List<CreateSeminarTimeSchedule> workshopParticipantList = new ArrayList<CreateSeminarTimeSchedule>();

			if (!createSeminarTimeScheduleList.isEmpty()) {

				createSeminarTimeScheduleList.forEach(createSeminarTimeSchedule -> {

					if (createSeminarTimeSchedule.getConcernedPersonUserId() != 0) {
						createSeminarTimeSchedule.setUser(uaaClientService.getUser(createSeminarTimeSchedule.getConcernedPersonUserId()).getBody());
					}

					if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null && createSeminarTimeSchedule.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster() != null) {

						createSeminarTimeSchedule.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster()
								.setUserDto(	uaaClientService
												.getUser(createSeminarTimeSchedule.getM1ResearcherProposalId()
												.getResearcherProfilePersonalInfoMaster().getUserId())
												.getBody());

						if (createSeminarTimeSchedule.getM1ResearcherProposalId()
								                     .getResearcherProfilePersonalInfoMaster()
								                     .getDivisionId() != null) {

							Response<DivisionResponse> response = rmsConfigurationClientService
									         .findByDivisionId(createSeminarTimeSchedule.getM1ResearcherProposalId()
											 .getResearcherProfilePersonalInfoMaster().getDivisionId());

							if (response.isSuccess() && response.getObj() != null) {
								createSeminarTimeSchedule.setDivisionDto(response.getObj());
							}

						}

						if (createSeminarTimeSchedule.getM1ResearcherProposalId()
								                     .getResearcherProfilePersonalInfoMaster().getDistrictId() != null) {

							Response<ZillaResponse> response = rmsConfigurationClientService
									                       .findByZillaId(createSeminarTimeSchedule.getM1ResearcherProposalId()
											               .getResearcherProfilePersonalInfoMaster().getDistrictId());

							if (response.isSuccess() && response.getObj() != null) {
								createSeminarTimeSchedule.setDistrictDto(response.getObj());
							}
						}

						if (createSeminarTimeSchedule.getM1ResearcherProposalId()
								                     .getResearcherProfilePersonalInfoMaster().getUpzilaId() != null) {

							Response<UpaZillaResponse> response = rmsConfigurationClientService
									                   .findByUpazillaId(createSeminarTimeSchedule.getM1ResearcherProposalId()
											          .getResearcherProfilePersonalInfoMaster().getUpzilaId());

							if (response.isSuccess() && response.getObj() != null) {
								createSeminarTimeSchedule.setUpzilaDto(response.getObj());
							}
						}

					}


					if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null
							&& createSeminarTimeSchedule.getM1ResearcherProposalId().getStResearchCatTypeId() != null) {
						createSeminarTimeSchedule.getM1ResearcherProposalId()
								.setCategoryType(rmsConfigurationClientService.getByResearchCategoryTypeId(
										createSeminarTimeSchedule.getM1ResearcherProposalId().getStResearchCatTypeId())
										.getObj());
					}

					if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null
							&& createSeminarTimeSchedule.getM1ResearcherProposalId().getStSectorTypeId() != null) {
						createSeminarTimeSchedule.getM1ResearcherProposalId()
								           .setFieldName(rmsConfigurationClientService
										   .getBySectorTypeId(
										    createSeminarTimeSchedule.getM1ResearcherProposalId().getStSectorTypeId())
										   .getObj());
					}

					if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null && createSeminarTimeSchedule
							.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster() != null) {

						createSeminarTimeSchedule.getM1ResearcherProposalId().getResearcherProfilePersonalInfoMaster()
								.setUserDto(uaaClientService.getUser(createSeminarTimeSchedule.getM1ResearcherProposalId()
										.getResearcherProfilePersonalInfoMaster().getUserId()).getBody());
					}

					if (createSeminarTimeSchedule.getM1ResearcherProposalId() != null) {
						Response<LinkupProposalWithEvaluatorsResponseDto> response = linkupProposalWithEvaluatorsService
								.findByResearcherProposal(createSeminarTimeSchedule.getM1ResearcherProposalId().getId());
						if (response.isSuccess() && response.getObj() != null) {
							createSeminarTimeSchedule.setLinkupProposalWithEvaluatorsResponseDto(response.getObj());
						}

					}

				});

				Collections.sort(createSeminarTimeScheduleList,	(o1, o2) -> Integer.parseInt(o1.getId().toString()) - Integer.parseInt(o2.getId().toString()));
				createSeminarTimeScheduleResearcherList = createSeminarTimeScheduleList.stream()
						                                                               .filter(f -> f.getPositionInSeminar().equalsIgnoreCase("Researcher"))
						                                                               .collect(Collectors.toList());


				createSeminarTimeScheduleLeadList = createSeminarTimeScheduleList.stream()
                                                                                  .filter(f -> f.getPositionInSeminar().equalsIgnoreCase("Lead"))
                                                                                  .collect(Collectors.toList());

				 timeScheduleLeadList =createSeminarTimeScheduleList.stream()
                                                                    .filter(f -> f.getPositionInSeminar().equalsIgnoreCase("Lead"))
                                                                    .collect(Collectors.toList());
				timeScheduleResearcherList = createSeminarTimeScheduleList.stream()
                                                                          .filter(f -> f.getPositionInSeminar().equalsIgnoreCase("Researcher"))
                                                                          .collect(Collectors.toList());
				timeScheduleOthersList = createSeminarTimeScheduleList.stream()
                                                                      .filter(f -> f.getPositionInSeminar().equalsIgnoreCase("Others"))
                                                                      .collect(Collectors.toList());
			}




			workshopParticipantList = ListUtils.union(createSeminarTimeScheduleLeadList,createSeminarTimeScheduleResearcherList);

			map.put("createSeminarOptional", createSeminarOptional.orElse(null));
			map.put("createSeminarTimeScheduleResearcherList", createSeminarTimeScheduleResearcherList);
			map.put("createSeminarTimeScheduleList", createSeminarTimeScheduleList);
			map.put("memberInSeminarList", memberInSeminarList);
			map.put("workshopParticipantList", workshopParticipantList);

			map.put("timeScheduleLeadList", timeScheduleLeadList);
			map.put("timeScheduleResearcherList", timeScheduleResearcherList);
			map.put("timeScheduleOthersList", timeScheduleOthersList);

			return new Response<Map<String, Object>>() {
				{
					setMessage("Data found !");
					setSuccess(true);
					setObj(map);
				}
			};

		} catch (Exception e) {
			return getErrorResponse(e.getMessage());
		}

	}


}
