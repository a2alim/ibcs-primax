package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.rpm.enums.Status;
import com.ibcs.idsdp.rpm.model.domain.Latter;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.UserSignature;
import com.ibcs.idsdp.rpm.model.repositories.LatterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.UserSignatureRepository;
import com.ibcs.idsdp.rpm.services.LatterService;
import com.ibcs.idsdp.rpm.web.dto.request.LatterRequest;
import com.ibcs.idsdp.rpm.web.dto.response.LetterDetailsResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.AllArgsConstructor;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
public class LatterServiceImpl implements LatterService {

	@Autowired
	private LatterRepository latterRepository;

	@Autowired
	private ResearcherProposalRepository researcherProposalRepository;

	@Autowired
	private UserSignatureRepository userSignatureRepository;

	@Autowired
	private RmsConfigurationClientService rmsConfigurationClientService;

	@Autowired
	private UaaClientService uaaClientService;

	@Value("${minio.host}")
	private String minIOHost;

	@Override
	public Response saveLatter(LatterRequest latterRequest) {
		Response<Latter> response = new Response<>();
		try {
			Latter latter = new Latter();
			BeanUtils.copyProperties(latterRequest, latter);
			Optional<ResearcherProposal> researcherProposalOptional = researcherProposalRepository
					.findById(latterRequest.getResearcherProposalId());
			if (!researcherProposalOptional.isPresent()) {
				throw new ResourceNotFoundException("Researcher Proposal Not Found");
			}
			latter.setResearcherProposalId(researcherProposalOptional.get());
			Optional<UserSignature> userSignatureOptional = userSignatureRepository.findById(1l);
			if (!userSignatureOptional.isPresent()) {
				latter.setRmsUserSignatureId(null);
			} else {
				latter.setRmsUserSignatureId(userSignatureOptional.get());
			}

			latter.setStatus(Status.Pending);
			//System.out.println(latter);
			latterRepository.save(latter);

			response.setMessage("Saved Successfully!");
			response.setSuccess(true);
			response.setObj(latter);
		} catch (Exception e) {
			System.err.println(e);
			response.setMessage("Save Failed!");
			response.setSuccess(false);
			response.setObj(new Latter());
		}
		return response;
	}

	@Override
	public Response getLatter() {
		Response<Latter> response = new Response<>();
		try {
			List<Latter> latterList = latterRepository.findAllByIsDeleted(false);

			response.setMessage("Data found");
			response.setSuccess(true);
			response.setItems(latterList);
		} catch (Exception exception) {
			response.setMessage(exception.getMessage());
			response.setSuccess(false);

		}

		return response;
	}

	@Override
	public Response getLatterList(Long catId) {
		Response<Latter> response = new Response<>();
		try {
			List<Latter> latterList = new ArrayList<>();
			if (catId != 0) {
				latterList = latterRepository.getLetterByResearcherCategory(catId);
			} else {
				latterList = latterRepository.findAllByIsDeleted(false);
			}
			response.setMessage("Data found");
			response.setSuccess(true);
			response.setItems(latterList);

		} catch (Exception exception) {
			response.setMessage(exception.getMessage());
			response.setSuccess(false);

		}

		return response;
	}

	@Override
	public Response getLetterById(Long id) {
		Response<Latter> response = new Response<>();
		try {
			Optional<Latter> latterOption = latterRepository.findById(id);
			if (!latterOption.isPresent()) {
				response.setMessage("Data found by this id");
				response.setSuccess(false);
				return response;
			}
			response.setMessage("Data found");
			response.setSuccess(true);
			response.setObj(latterOption.get());
		} catch (Exception exception) {
			response.setMessage(exception.getMessage());
			response.setSuccess(false);

		}

		return response;
	}

	@Override
	public Response deleteLatter(Long id) {
		Response<Latter> response = new Response<>();
		try {
			Optional<Latter> latterOption = latterRepository.findById(id);
			if (!latterOption.isPresent()) {
				response.setMessage("Data found by this id");
				response.setSuccess(false);
				return response;
			}
			Latter latter = latterOption.get();
			latter.setIsDeleted(true);
			latterRepository.save(latter);

			response.setMessage("Delete successfully");
			response.setSuccess(true);
			response.setObj(latterOption.get());
		} catch (Exception exception) {
			response.setMessage(exception.getMessage());
			response.setSuccess(false);

		}

		return response;
	}

	@Override
	public Response updateLetter(Long id, LatterRequest latterRequest) {
		Response<Latter> response = new Response<>();
		try {
			Optional<Latter> latterOptional = latterRepository.findById(id);
			if (!latterOptional.isPresent()) {
				response.setMessage("Update unsuccessfully");
				response.setSuccess(false);
				return response;
			}
			Latter latter = latterOptional.get();
			BeanUtils.copyProperties(latterRequest, latter);
			Optional<ResearcherProposal> researcherProposalOptional = researcherProposalRepository
					.findById(latterRequest.getResearcherProposalId());
			if (!researcherProposalOptional.isPresent()) {
				throw new ResourceNotFoundException("Researcher Proposal Not Found");
			}
			latter.setResearcherProposalId(researcherProposalOptional.get());
			Optional<UserSignature> userSignatureOptional = userSignatureRepository.findById(1l);
			if (!userSignatureOptional.isPresent()) {
				latter.setRmsUserSignatureId(null);
			} else {
				latter.setRmsUserSignatureId(userSignatureOptional.get());
			}

			//System.out.println(latter);
			latterRepository.save(latter);

			response.setMessage("Updated Successfully");
			response.setSuccess(true);
			response.setObj(latter);
		} catch (Exception e) {
			System.err.println(e);
			response.setMessage("Update unsuccessfully");
			response.setSuccess(false);
			response.setObj(new Latter());
		}
		return response;
	}

	@Override
	public Response getLetterDetailsById(Long id) {

		try {
			Object[] response = (Object[]) latterRepository.getLetterDetailsById(id);

			LetterDetailsResponseDto dto = new LetterDetailsResponseDto();

			if (response[0] != null) {
				dto.setResearchTitle(response[0].toString());
			}

			if (response[1] != null) {
				dto.setStResearchCatTypeId(Long.parseLong(response[1].toString()));
				Response<ResearchCategoryTypeResponseDto> res = rmsConfigurationClientService
						.getByResearchCategoryTypeId(dto.getStResearchCatTypeId());
				dto.setResearchCategoryTypeResponseDto(res.getObj());
			}

			if (response[2] != null) {
				dto.setStSectorTypeId(Long.parseLong(response[2].toString()));
				Response<SectorTypeResponseDto> res = rmsConfigurationClientService
						.getBySectorTypeId(dto.getStSectorTypeId());
				dto.setSectorTypeResponseDto(res.getObj());
			}

			if (response[3] != null) {
				dto.setStSubSectorsId(Long.parseLong(response[3].toString()));
				Response<SubSectorResponseDto> res = rmsConfigurationClientService
						.getBySubSectorId(dto.getStSubSectorsId());
				dto.setSubSectorResponseDto(res.getObj());
			}

			if (response[4] != null) {
				dto.setStFiscalYearId(Long.parseLong(response[4].toString()));
				Response<FiscalResponseDto> res = rmsConfigurationClientService
						.getByFiscalYearId(dto.getStFiscalYearId());
				dto.setFiscalResponseDto(res.getObj());
			}

			if (response[5] != null) {
				dto.setStSdgsGoalsId(response[5].toString());
			}

			if (response[6] != null) {
				dto.setEmailAddress(response[6].toString());

			}

			if (response[7] != null) {
				dto.setMobileNo(response[7].toString());
			}

			if (response[8] != null) {
				dto.setInstTelephoneNo(response[8].toString());
			}

			if (response[9] != null) {
				dto.setRegNumber(response[9].toString());
			}

			if (response[10] != null) {
				dto.setUserImageUrl(response[10].toString());
			}

			if (response[11] != null) {
				dto.setSignatureImageUr(response[11].toString());
			}

			if (response[12] != null) {
				dto.setMemorandumNo(response[12].toString());
			}
			if (response[13] != null) {
				dto.setNothiDateEn(response[13].toString());
			}
			if (response[14] != null) {
				dto.setNothiDateBn(response[14].toString());
			}
			if (response[15] != null) {
				dto.setUserId(Long.parseLong(response[15].toString()));
				dto.setUserDto(uaaClientService.getUser(dto.getUserId()).getBody());
			}
			if (response[16] != null) {
				dto.setPreDivisionId(Long.parseLong(response[16].toString()));
				dto.setPreDivisionDto(rmsConfigurationClientService.findByDivisionId(dto.getPreDivisionId()).getObj());
			}
			if (response[17] != null) {
				dto.setPreDistrictId(Long.parseLong(response[17].toString()));
				dto.setPreDistrictDto(rmsConfigurationClientService.findByZillaId(dto.getPreDistrictId()).getObj());
			}
			if (response[18] != null) {
				dto.setPreUpzilaId(Long.parseLong(response[18].toString()));
				dto.setPreUpzilaDto(rmsConfigurationClientService.findByUpazillaId(dto.getPreUpzilaId()).getObj());
			}
			if (response[19] != null) {
				dto.setIsInstitutional(Boolean.parseBoolean(response[19].toString()));
			}
			if (response[20] != null) {
				dto.setInstAddressDetails(response[20].toString());
			}
			if (response[21] != null) {
				dto.setSubject(response[21].toString());
			}
			if (response[22] != null) {
				dto.setMailBody(response[22].toString());
			}
			if (response[23] != null) {
				dto.setMailStatus(Boolean.parseBoolean(response[23].toString()));
			}

			dto.setMinio(minIOHost);

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
}
