package com.ibcs.idsdp.rpm.services.implementation;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.request.UserDtl;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.model.domain.AgreementJamanatnama;
import com.ibcs.idsdp.rpm.model.domain.AgreementParty;
import com.ibcs.idsdp.rpm.model.domain.AgreementUploadSignatureFiles;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessExpenditureItems;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.AgreementInstallmentRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementJamanatnamaRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementPartyRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementUploadSignatureFilesRepository;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.AgreementWithResearcherService;
import com.ibcs.idsdp.rpm.services.InstallmentProcessExpenditureItemsService;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementWithResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.StatusRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class AgreementWithResearcherServiceImpl extends
		BaseService<AgreementWithResearcher, AgreementWithResearcherRequestDto, AgreementWithResearcherResponseDto>
		implements AgreementWithResearcherService {

	// tab1
	private final AgreementWithResearcherRepository agreementWithResearcherRepository;
	// tab2
	private final AgreementInstallmentRepository agreementInstallmentRepository;
	// tab3
	private final AgreementJamanatnamaRepository agreementJamanatnamaRepository;

	// tab4
	private final AgreementPartyRepository agreementPartyRepository;

	// tab5
	private final AgreementUploadSignatureFilesRepository signatureFilesRepository;

	final private ResearcherProposalRepository proposalRepository;

	final private RmsConfigurationClientService rmsConfigurationClientService;

	final private UaaClientService uaaClientService;
	final private InstallmentProcessService installmentProcessService;
	final private InstallmentProcessExpenditureItemsService installmentProcessExpenditureItemsService;

	public AgreementWithResearcherServiceImpl(ServiceRepository<AgreementWithResearcher> repository,
			AgreementWithResearcherRepository agreementWithResearcherRepository,
			AgreementInstallmentRepository agreementInstallmentRepository,
			AgreementJamanatnamaRepository agreementJamanatnamaRepository,
			AgreementPartyRepository agreementPartyRepository,
			AgreementUploadSignatureFilesRepository signatureFilesRepository,
			ResearcherProposalRepository proposalRepository,
			RmsConfigurationClientService rmsConfigurationClientService, UaaClientService uaaClientService,
			InstallmentProcessService installmentProcessService,
			InstallmentProcessExpenditureItemsService installmentProcessExpenditureItemsService) {
		super(repository);
		this.agreementWithResearcherRepository = agreementWithResearcherRepository;
		this.agreementInstallmentRepository = agreementInstallmentRepository;
		this.agreementJamanatnamaRepository = agreementJamanatnamaRepository;
		this.agreementPartyRepository = agreementPartyRepository;
		this.signatureFilesRepository = signatureFilesRepository;
		this.proposalRepository = proposalRepository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.uaaClientService = uaaClientService;
		this.installmentProcessService = installmentProcessService;
		this.installmentProcessExpenditureItemsService = installmentProcessExpenditureItemsService;
	}

	@Override
	public Response<AgreementWithResearcherResponseDto> createAgreementWithResearcher(
			AgreementWithResearcherRequestDto agreementWithResearcherRequestDto) {
		Optional<ResearcherProposal> byId = proposalRepository.findById(agreementWithResearcherRequestDto.getInfoId());

		ResearcherProposal proposal = byId.get();

		//
		List<AgreementWithResearcher> byResearcherProposalId = agreementWithResearcherRepository
				.findAllByResearcherProposalIdAndIsDeleted(proposal, false);

		if (!byResearcherProposalId.isEmpty()) {
			Response<AgreementWithResearcherResponseDto> r = new Response<>();
			r.setSuccess(false);
			r.setMessage("Agreement Already Exist with this Proposal ");
			return r;
		}

		agreementWithResearcherRequestDto.setResearcherProposalId(proposal);

		return create(agreementWithResearcherRequestDto);
	}

	@Override
	public BooleanValueHolderDTO updateAgreementWithResearcher(
			AgreementWithResearcherRequestDto agreementWithResearcherRequestDto) {

		BooleanValueHolderDTO holderDTO = new BooleanValueHolderDTO();
		// retrieving info data
		Optional<ResearcherProposal> byId = proposalRepository.findById(agreementWithResearcherRequestDto.getInfoId());
		agreementWithResearcherRequestDto.setResearcherProposalId(byId.get());

		// retrieving own data
		AgreementWithResearcher agreement = agreementWithResearcherRepository
				.findById(agreementWithResearcherRequestDto.getId()).get();
		AgreementWithResearcher agreementWithResearcher = new AgreementWithResearcher();
		BeanUtils.copyProperties(agreementWithResearcherRequestDto, agreementWithResearcher);

		agreementWithResearcher.setIsDeleted(agreement.getIsDeleted());
		agreementWithResearcher.setCreatedBy(agreement.getCreatedBy());
		agreementWithResearcher.setCreatedOn(agreement.getCreatedOn());
		try {
			AgreementWithResearcher save = agreementWithResearcherRepository.save(agreementWithResearcher);
			holderDTO.setSuccess(true);
			holderDTO.setMessage("Update Success");

		} catch (Exception e) {
			holderDTO.setSuccess(false);
			holderDTO.setMessage("Update failed");

		}
		return holderDTO;
	}

	@Override
	public Response<Map<String, Object>> getAllTabData(String uuid) {

		Map<String, Object> allAgreementTabData = new HashMap<String, Object>();
		Response<Map<String, Object>> response = new Response<Map<String, Object>>();

		// calling Tab1
		AgreementWithResearcher agreement = agreementWithResearcherRepository.findByUuid(uuid);
		Response<FiscalResponseDto> byFiscalYearId = rmsConfigurationClientService
				.getByFiscalYearId(agreement.getResearcherProposalId().getStFiscalYearId());
		agreement.getResearcherProposalId().setStFiscalYear(byFiscalYearId.getObj().getFiscalYear());
		;

		// calling Tab2
		List<AgreementInstallment> installments = agreementInstallmentRepository
				.findAllByAgreementWithResearcherId(agreement);

		Response<InstallmentTypeResponseDto> allInstallmentType = rmsConfigurationClientService.getAllInstallmentType();

		allInstallmentType.getItems().forEach(instType -> {
			installments.forEach(inst -> {
				if (inst.getStInstallmentTypeId() == instType.getId()) {
					inst.setStInstallmentType(instType.getInstallmentType());
				}
			});
		});

		// calling Tab3
		Optional<AgreementJamanatnama> jamanatnama = agreementJamanatnamaRepository
				.findByAgreementWithResearcherId(agreement);
		AgreementJamanatnama agreementJamanatnama = new AgreementJamanatnama();
		if (jamanatnama.isPresent()) {
			agreementJamanatnama = jamanatnama.get();
		}

		// calling Tab4
		Optional<AgreementParty> agreementParty = agreementPartyRepository.findByAgreementWithResearcherId(agreement);
		AgreementParty party = new AgreementParty();
		if (agreementParty.isPresent()) {
			party = agreementParty.get();
		}

		// calling Tab5
		List<AgreementUploadSignatureFiles> uploadSignatureFiles = signatureFilesRepository
				.findAllByAgreementWithResearcherId(agreement);

		List<UserDtl> allUsers = uaaClientService.getAllUsers();
		for (UserDtl user : allUsers) {
			if (user.getId() == Long.parseLong(agreement.getRecipientUserId().toString())) {
				agreement.setRecipientUser(user.getName());
			}
			if (user.getId() == party.getFirstPartyUserId()) {
				party.setFirstPartyUser(user.getName());
			}
			if (user.getId() == party.getFirstPartyWitnessUserId()) {
				party.setFirstPartyWitnessUser(user.getName());
			}
			if (user.getId() == party.getSecondPartyUserId()) {
				party.setSecondPartyUser(user.getName());
			}
		}
		;

		allAgreementTabData.put("tabOne", agreement);
		allAgreementTabData.put("tabTwo", installments);
		allAgreementTabData.put("tabThree", agreementJamanatnama);
		allAgreementTabData.put("tabFour", party);
		allAgreementTabData.put("tabFive", uploadSignatureFiles);

		response.setSuccess(true);
		response.setObj(allAgreementTabData);

		return response;
	}

	@Override
	public BooleanValueHolderDTO updateAgreementWithResearcherStatus(StatusRequestDto withResearcher) {

		BooleanValueHolderDTO holderDTO = new BooleanValueHolderDTO();
		try {
			// retrieving info data
			Optional<ResearcherProposal> byId = proposalRepository.findById(withResearcher.getInfoId());

			// retrieving own data
			AgreementWithResearcher agreement = agreementWithResearcherRepository.findById(withResearcher.getId())
					.get();

			agreement.setResearcherProposalId(byId.get());
			agreement.setApprovalStatus(withResearcher.getApprovalStatus());

			AgreementWithResearcher save = agreementWithResearcherRepository.save(agreement);
			holderDTO.setSuccess(true);
			holderDTO.setMessage("Update Success");

		} catch (Exception e) {
			holderDTO.setSuccess(false);
			holderDTO.setMessage("Update failed");

		}
		return holderDTO;
	}

	@Override
	public Response<AgreementWithResearcherResponseDto> findByResearcherProposalId(Long id) {
		Response<AgreementWithResearcherResponseDto> response = new Response<>();
		ResearcherProposal r = new ResearcherProposal();
		r.setId(id);
		AgreementWithResearcherResponseDto dto = new AgreementWithResearcherResponseDto();
		List<AgreementWithResearcher> a = agreementWithResearcherRepository.findAllByResearcherProposalIdAndIsDeleted(r,false);
		if (a == null || a.isEmpty()) {
			response.setSuccess(false);
			response.setObj(null);
			response.setMessage("Data not found");
			return response;
		}

		BeanUtils.copyProperties(a.get(0), dto);
		dto.setExpenseAmount(Double.valueOf(0));
		dto.setReceivableAmount(Double.valueOf(0));

		// calculate receivable amount and expense amount;
		List<InstallmentProcess> ips = installmentProcessService.findAllByM1ResearcherProposalId(id);
		if (ips != null && !ips.isEmpty()) {

			for (InstallmentProcess ip : ips) {

				List<InstallmentProcessExpenditureItems> ipeis = installmentProcessExpenditureItemsService.findAllByM2InstallmentProcessId(ip.getId());
				if (ipeis != null && !ipeis.isEmpty()) {
					for (InstallmentProcessExpenditureItems i : ipeis) {
						dto.setExpenseAmount(dto.getExpenseAmount() + i.getExpenseAmount());
						dto.setReceivableAmount(dto.getReceivableAmount() + i.getReceivableAmount());
					}
				}

			}

		}

		response.setSuccess(true);
		response.setObj(dto);
		response.setMessage("Data found");
		return response;
	}

	@Override
	public AgreementWithResearcher getByResearcherProposalId(Long id) {
		ResearcherProposal r = new ResearcherProposal();
		r.setId(id);
		List<AgreementWithResearcher> list = agreementWithResearcherRepository
				.findAllByResearcherProposalIdAndIsDeleted(r, false);
		return list != null ? list.get(0) : null;
	}

	@Override
	public Response<AgreementWithResearcherResponseDto> findByResearcherProposalIdAndIsDeleted(Long researcherProposalId) {
		Optional<ResearcherProposal> optional = proposalRepository.findByIdAndIsDeleted(researcherProposalId, false);
		
		if(!optional.isPresent()) {
			return getErrorResponse("Data not found !.");
		}
		
		AgreementWithResearcher agreement =  agreementWithResearcherRepository.findByResearcherProposalId(optional.get());
		if(agreement !=null) {
			
			return new Response<AgreementWithResearcherResponseDto>() {{
				setMessage("Data found!.");
				setSuccess(true);
				setObj(convertForRead(agreement));
			}};
		}

		return getErrorResponse("Data not found!.");
	}

}
