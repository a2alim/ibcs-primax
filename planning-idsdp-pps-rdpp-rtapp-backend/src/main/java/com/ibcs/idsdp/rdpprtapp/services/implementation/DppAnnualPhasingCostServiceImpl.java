package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.client.PpsDppTappClientService;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.model.domain.*;
import com.ibcs.idsdp.rdpprtapp.model.repositories.*;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnualPhasingCostService;
import com.ibcs.idsdp.rdpprtapp.web.dto.*;
import com.ibcs.idsdp.rdpprtapp.web.dto.report.DppResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.groupingBy;

@Slf4j
@Service
public class DppAnnualPhasingCostServiceImpl extends BaseService<DppAnnualPhasingCost, DppAnnualPhasingCostDTO>
		implements DppAnnualPhasingCostService {

	private final DppAnnualPhasingCostRepository repository;
	private final DppAnnualPhasingCostTabDetailsServiceImp dppAnnualPhasingCostTabDetailsServiceImp;
	private final DppAnnualPhasingCostTabDetailsRepository dppAnnualPhasingCostTabDetailsRepository;
	private final DppAnnualPhasingCostTotalServiceImp dppAnnualPhasingCostTotalServiceImp;
	private final DppAnnualPhasingCostTotalRepository dppAnnualPhasingCostTotalRepository;
	private final DppFiscalYearServiceImp dppFiscalYearServiceImp;
	private final DppFiscalYearRepository dppFiscalYearRepository;
	private final DppObjectiveCostRepository dppObjectiveCostRepository;
	private final ConfigurationClientService configurationClientService;
	private final PpsDppTappClientService ppsDppTappClientService;

	protected DppAnnualPhasingCostServiceImpl(DppAnnualPhasingCostRepository repository,
			DppAnnualPhasingCostTabDetailsServiceImp dppAnnualPhasingCostTabDetailsServiceImp,
			DppAnnualPhasingCostTabDetailsRepository dppAnnualPhasingCostTabDetailsRepository,
			DppAnnualPhasingCostTotalServiceImp dppAnnualPhasingCostTotalServiceImp,
			DppAnnualPhasingCostTotalRepository dppAnnualPhasingCostTotalRepository,
			DppFiscalYearServiceImp dppFiscalYearServiceImp, DppFiscalYearRepository dppFiscalYearRepository,
			DppObjectiveCostRepository dppObjectiveCostRepository,
			ConfigurationClientService configurationClientService,
			PpsDppTappClientService ppsDppTappClientService) {
		super(repository);
		this.repository = repository;
		this.dppAnnualPhasingCostTabDetailsServiceImp = dppAnnualPhasingCostTabDetailsServiceImp;
		this.dppAnnualPhasingCostTabDetailsRepository = dppAnnualPhasingCostTabDetailsRepository;
		this.dppAnnualPhasingCostTotalServiceImp = dppAnnualPhasingCostTotalServiceImp;
		this.dppAnnualPhasingCostTotalRepository = dppAnnualPhasingCostTotalRepository;
		this.dppFiscalYearServiceImp = dppFiscalYearServiceImp;
		this.dppFiscalYearRepository = dppFiscalYearRepository;
		this.dppObjectiveCostRepository = dppObjectiveCostRepository;
		this.configurationClientService = configurationClientService;
		this.ppsDppTappClientService = ppsDppTappClientService;
	}

	@Override
	protected DppAnnualPhasingCostDTO convertForRead(DppAnnualPhasingCost dppAnnualPhasingCost) {
		DppAnnualPhasingCostDTO dto = super.convertForRead(dppAnnualPhasingCost);
		if (!dppAnnualPhasingCost.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			dto.setDppAnnualPhasingCostTotal(new ModelMapper().map(dppAnnualPhasingCost.getDppAnnualPhasingCostTotal(),
					DppAnnualPhasingCostTotalDTO.class));
		}
		return dto;
	}

	/**
	 * Convert to entry from dto for create
	 *
	 * @param dppAnnualPhasingCostDTO
	 * @return
	 */
	@Override
	protected DppAnnualPhasingCost convertForCreate(DppAnnualPhasingCostDTO dppAnnualPhasingCostDTO) {
		DppAnnualPhasingCost dppAnnualPhasingCost = super.convertForCreate(dppAnnualPhasingCostDTO);
		if (!dppAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			dppAnnualPhasingCost.setDppAnnualPhasingCostTotal(new ModelMapper().map(
					dppAnnualPhasingCostTotalServiceImp.create(dppAnnualPhasingCostDTO.getDppAnnualPhasingCostTotal()),
					DppAnnualPhasingCostTotal.class));
		}
		return dppAnnualPhasingCost;
	}

	/**
	 * Convert to entry from dto for update
	 *
	 * @param dppAnnualPhasingCostDTO
	 * @param dppAnnualPhasingCost
	 */
	@Override
	protected void convertForUpdate(DppAnnualPhasingCostDTO dppAnnualPhasingCostDTO,
			DppAnnualPhasingCost dppAnnualPhasingCost) {
		if (!dppAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal = dppAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(dppAnnualPhasingCost.getDppAnnualPhasingCostTotal().getId(), false).get();
			dppAnnualPhasingCostDTO.getDppAnnualPhasingCostTotal().setUuid(dppAnnualPhasingCostTotal.getUuid());
			dppAnnualPhasingCost.setDppAnnualPhasingCostTotal(new ModelMapper().map(
					dppAnnualPhasingCostTotalServiceImp.update(dppAnnualPhasingCostDTO.getDppAnnualPhasingCostTotal()),
					DppAnnualPhasingCostTotal.class));
		}
		super.convertForUpdate(dppAnnualPhasingCostDTO, dppAnnualPhasingCost);
	}

	/**
	 * Save DppAnnualPhasingCost With its child
	 *
	 * @param dppAnnualPhasingCostDTO
	 * @return
	 */
	@Override
	@Transactional
	public ResponseEntity<DppAnnualPhasingCostWithChildResponse> saveWithChild(
			DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostDTO) {
		DppAnnualPhasingCostWithChildRequest response = new ModelMapper().map(create(dppAnnualPhasingCostDTO),
				DppAnnualPhasingCostWithChildRequest.class);

		List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetailsDTOs = new ArrayList<>();
		List<DppAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = createChild(dppAnnualPhasingCostDTO,
				dppAnnualPhasingCostTabDetailsDTOs, response);

		response.setDppAnnualPhasingCostTabDetails(dppAnnualPhasingCostTabDetailsDTOs);
		response.setFiscalYearsWiseTotal(fiscalYearsWiseTotal);
		return getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {
			{
				setRdppMasterId(response.getRdppMasterId());
				setComponentName(response.getComponentName().toString());
			}
		});
	}

	/**
	 * Update DppAnnualPhasingCost with child
	 *
	 * @param dppAnnualPhasingCostWithChildRequest
	 * @return
	 */
	@Override
	@Transactional
	public ResponseEntity<DppAnnualPhasingCostWithChildResponse> updateWithChild(
			DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostWithChildRequest) {
		DppAnnualPhasingCostWithChildRequest response = new ModelMapper()
				.map(update(dppAnnualPhasingCostWithChildRequest), DppAnnualPhasingCostWithChildRequest.class);

		deleteByDppAnnualPhasingCostId(response);

		List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetailsDTOs = new ArrayList<>();
		List<DppAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = createChild(dppAnnualPhasingCostWithChildRequest,
				dppAnnualPhasingCostTabDetailsDTOs, response);

		response.setDppAnnualPhasingCostTabDetails(dppAnnualPhasingCostTabDetailsDTOs);
		response.setFiscalYearsWiseTotal(fiscalYearsWiseTotal);

		return getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {
			{
				setRdppMasterId(response.getRdppMasterId());
				setComponentName(response.getComponentName().toString());
			}
		});
	}

	/**
	 * create all child
	 *
	 * @param dppAnnualPhasingCostDTO
	 * @param dppAnnualPhasingCostTabDetailsDTOs
	 * @param annalPhasingCost
	 * @return
	 */
	private List<DppAnnualPhasingCostTotalDTO> createChild(DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostDTO,
			List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetailsDTOs,
			DppAnnualPhasingCostWithChildRequest annalPhasingCost) {
		List<DppAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = new ArrayList<>();
		if (!dppAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			dppAnnualPhasingCostDTO.getFiscalYearsWiseTotal().stream()
					.forEach(fywc -> fiscalYearsWiseTotal.add(dppAnnualPhasingCostTotalServiceImp.create(fywc)));
		}
		List<DppAnnualPhasing> dppAnnualPhasings = Arrays.stream(DppAnnualPhasing.values()).filter(
				f -> (!f.equals(annalPhasingCost.getComponentName()) && !f.equals(DppAnnualPhasing.Grand_Total)))
				.collect(Collectors.toList());

		List<DppFiscalYearDTO> list1 = dppFiscalYearServiceImp.getByProjectConceptIdAndComponentName(
				annalPhasingCost.getRdppMasterId(), dppAnnualPhasings.get(0));
		List<DppFiscalYearDTO> list2 = dppFiscalYearServiceImp.getByProjectConceptIdAndComponentName(
				annalPhasingCost.getRdppMasterId(), dppAnnualPhasings.get(1));
		int list1TabDetailsSize = list1.isEmpty() ? 0
				: ((int) list1.stream().filter(f -> f.getFiscalYear().equals(list1.get(0).getFiscalYear())).count());
		int list2TabDetailsSize = list2.isEmpty() ? 0
				: ((int) list2.stream().filter(f -> f.getFiscalYear().equals(list2.get(0).getFiscalYear())).count());

		AtomicInteger tabCount = new AtomicInteger();
		dppAnnualPhasingCostDTO.getDppAnnualPhasingCostTabDetails().forEach(e -> {
			validationCheck(annalPhasingCost, e);
			e.setDppAnnualPhasingCostId(annalPhasingCost.getId());
			DppAnnualPhasingCostTabDetailsDTO dto = dppAnnualPhasingCostTabDetailsServiceImp.create(e);
			List<DppFiscalYearDTO> dppFiscalYearDTOList = new ArrayList<>();
			e.getFiscalYears().forEach(fy -> {
				fy.setDppAnnualPhasingCostTabDetailsId(dto.getId());
				if (!dppAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
					fy.setDppAnnualPhasingCostTotalDTO(fiscalYearsWiseTotal.stream()
							.filter(f -> f.getFiscalYear().equals(fy.getFiscalYear())).findFirst().get());
				}
				dppFiscalYearDTOList.add(dppFiscalYearServiceImp.create(fy));

				if (!list1.isEmpty() && list1.stream().noneMatch(a -> a.getFiscalYear().equals(fy.getFiscalYear()))
						&& (tabCount.get() < list1TabDetailsSize)) {
					createNonExistFiscalYear(list1.get(0).getDppAnnualPhasingCostTabDetailsId(), fy.getFiscalYear(),
							dppAnnualPhasingCostDTO.getProjectConceptId(), dppAnnualPhasings.get(0));
				}

				if (!list2.isEmpty() && list2.stream().noneMatch(a -> a.getFiscalYear().equals(fy.getFiscalYear()))
						&& (tabCount.get() < list2TabDetailsSize)) {
					createNonExistFiscalYear(list2.get(0).getDppAnnualPhasingCostTabDetailsId(), fy.getFiscalYear(),
							dppAnnualPhasingCostDTO.getProjectConceptId(), dppAnnualPhasings.get(1));
				}
			});
			dto.setFiscalYears(dppFiscalYearDTOList);
			dppAnnualPhasingCostTabDetailsDTOs.add(dto);
			tabCount.addAndGet(1);
		});

		deleteWhichFiscalYearIsNotExist(dppAnnualPhasingCostDTO, annalPhasingCost, dppAnnualPhasings);

		return fiscalYearsWiseTotal;
	}

	/**
	 * create if fiscal is not exist in component
	 *
	 * @param dppAnnualPhasingCostTabDetailsId
	 * @param fiscalYear
	 */
	private void createNonExistFiscalYear(Long dppAnnualPhasingCostTabDetailsId, String fiscalYear, Long conceptId,
			DppAnnualPhasing dppAnnualPhasing) {
		DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
		if (!dppAnnualPhasing.equals(DppAnnualPhasing.Contingency)) {
			DppAnnualPhasingCostTotalDTO existDppAnnualPhasingCostTotalDTO = dppAnnualPhasingCostTotalServiceImp
					.getByProjectConceptIdAndComponentNameAndFiscalYear(conceptId, dppAnnualPhasing, fiscalYear);
			if (existDppAnnualPhasingCostTotalDTO != null) {
				dppAnnualPhasingCostTotalDTO = existDppAnnualPhasingCostTotalDTO;
			} else {
				dppAnnualPhasingCostTotalDTO.setFiscalYear(fiscalYear);
				dppAnnualPhasingCostTotalDTO.setTotalAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setGobAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setGobFeAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setGobThruAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setSpAcAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setThruPdAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setThruDpAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setOwnFundAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setOwnFundFeAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setOtherAmount(0.0);
				dppAnnualPhasingCostTotalDTO.setOtherFeAmount(0.0);
				dppAnnualPhasingCostTotalDTO = dppAnnualPhasingCostTotalServiceImp.create(dppAnnualPhasingCostTotalDTO);
			}
		} else {
			dppAnnualPhasingCostTotalDTO = null;
		}

		DppFiscalYearDTO dppFiscalYearDTO = new DppFiscalYearDTO();
		dppFiscalYearDTO.setFiscalYear(fiscalYear);
		dppFiscalYearDTO.setTotalAmount(0.0);
		dppFiscalYearDTO.setGobAmount(0.0);
		dppFiscalYearDTO.setGobFeAmount(0.0);
		dppFiscalYearDTO.setGobThruAmount(0.0);
		dppFiscalYearDTO.setSpAcAmount(0.0);
		dppFiscalYearDTO.setThruPdAmount(0.0);
		dppFiscalYearDTO.setThruDpAmount(0.0);
		dppFiscalYearDTO.setOwnFundAmount(0.0);
		dppFiscalYearDTO.setOwnFundFeAmount(0.0);
		dppFiscalYearDTO.setOtherAmount(0.0);
		dppFiscalYearDTO.setOtherFeAmount(0.0);
		dppFiscalYearDTO.setDppAnnualPhasingCostTabDetailsId(dppAnnualPhasingCostTabDetailsId);
		dppFiscalYearDTO.setDppAnnualPhasingCostTotalDTO(dppAnnualPhasingCostTotalDTO);
		dppFiscalYearServiceImp.create(dppFiscalYearDTO);
	}

	private void deleteWhichFiscalYearIsNotExist(DppAnnualPhasingCostWithChildRequest dppAnnualPhasingCostDTO,
			DppAnnualPhasingCostWithChildRequest annalPhasingCost, List<DppAnnualPhasing> dppAnnualPhasings) {
		Map<String, List<DppFiscalYearDTO>> listMap1 = dppFiscalYearServiceImp
				.getByProjectConceptIdAndComponentName(annalPhasingCost.getRdppMasterId(), dppAnnualPhasings.get(0))
				.stream().collect(groupingBy(DppFiscalYearDTO::getFiscalYear));
		Map<String, List<DppFiscalYearDTO>> listMap2 = dppFiscalYearServiceImp
				.getByProjectConceptIdAndComponentName(annalPhasingCost.getRdppMasterId(), dppAnnualPhasings.get(1))
				.stream().collect(groupingBy(DppFiscalYearDTO::getFiscalYear));

		List<DppFiscalYearDTO> fiscalYearDTOS = dppAnnualPhasingCostDTO.getDppAnnualPhasingCostTabDetails().get(0)
				.getFiscalYears();
		listMap1.forEach((k, v) -> {
			AtomicReference<DppAnnualPhasingCostTotalDTO> annualPhasingCostTotalDTO = new AtomicReference<>();
			v.forEach(e -> {
				if (fiscalYearDTOS.stream().noneMatch(f -> f.getFiscalYear().equals(e.getFiscalYear()))) {
					annualPhasingCostTotalDTO.set(e.getDppAnnualPhasingCostTotalDTO());
					dppFiscalYearRepository.deleteById(e.getId());
					subtractFromTabDetails(e);
				}
			});
			if (annualPhasingCostTotalDTO.get() != null)
				dppAnnualPhasingCostTotalRepository.deleteById(annualPhasingCostTotalDTO.get().getId());
		});
		listMap2.forEach((k, v) -> {
			AtomicReference<DppAnnualPhasingCostTotalDTO> annualPhasingCostTotalDTO = new AtomicReference<>();
			v.forEach(e -> {
				if (fiscalYearDTOS.stream().noneMatch(f -> f.getFiscalYear().equals(e.getFiscalYear()))) {
					annualPhasingCostTotalDTO.set(e.getDppAnnualPhasingCostTotalDTO());
					dppFiscalYearRepository.deleteById(e.getId());
					subtractFromTabDetails(e);
				}
			});
			if (annualPhasingCostTotalDTO.get() != null)
				dppAnnualPhasingCostTotalRepository.deleteById(annualPhasingCostTotalDTO.get().getId());
		});
	}

	/**
	 * Subtract amount if fiscal year deleted
	 *
	 * @param e
	 */
	private void subtractFromTabDetails(DppFiscalYearDTO e) {
		DppAnnualPhasingCostTabDetailsDTO dto = dppAnnualPhasingCostTabDetailsServiceImp
				.getById(e.getDppAnnualPhasingCostTabDetailsId());
		dto.setTotalAmount(dto.getTotalAmount() - e.getTotalAmount());
		dto.setGobAmount(dto.getGobAmount() - e.getGobAmount());
		dto.setGobFeAmount(dto.getGobFeAmount() - e.getGobFeAmount());
		dto.setGobThruAmount(dto.getGobThruAmount() - e.getGobThruAmount());
		dto.setSpAcAmount(dto.getSpAcAmount() - e.getSpAcAmount());
		dto.setThruPdAmount(dto.getThruPdAmount() - e.getThruPdAmount());
		dto.setThruDpAmount(dto.getThruDpAmount() - e.getThruDpAmount());
		dto.setOwnFundAmount(dto.getOwnFundAmount() - e.getOwnFundAmount());
		dto.setOwnFundFeAmount(dto.getOwnFundFeAmount() - e.getOwnFundFeAmount());
		dto.setOtherAmount(dto.getOtherAmount() - e.getOtherAmount());
		dto.setOtherFeAmount(dto.getOtherFeAmount() - e.getOtherFeAmount());
		if (dto.getUnitCost() != null)
			dto.setUnitCost(dto.getTotalAmount() / dto.getQty());
		dppAnnualPhasingCostTabDetailsServiceImp.update(dto);
		if (e.getDppAnnualPhasingCostTotalDTO() != null) {
			DppAnnualPhasingCostTotalDTO totalDTO = e.getDppAnnualPhasingCostTotalDTO();
			totalDTO.setTotalAmount(e.getDppAnnualPhasingCostTotalDTO().getTotalAmount() - e.getTotalAmount());
			totalDTO.setGobAmount(e.getDppAnnualPhasingCostTotalDTO().getGobAmount() - e.getGobAmount());
			totalDTO.setGobFeAmount(e.getDppAnnualPhasingCostTotalDTO().getGobFeAmount() - e.getGobFeAmount());
			totalDTO.setGobThruAmount(e.getDppAnnualPhasingCostTotalDTO().getGobThruAmount() - e.getGobThruAmount());
			totalDTO.setSpAcAmount(e.getDppAnnualPhasingCostTotalDTO().getSpAcAmount() - e.getSpAcAmount());
			totalDTO.setThruPdAmount(e.getDppAnnualPhasingCostTotalDTO().getThruPdAmount() - e.getThruPdAmount());
			totalDTO.setThruDpAmount(e.getDppAnnualPhasingCostTotalDTO().getThruDpAmount() - e.getThruDpAmount());
			totalDTO.setOwnFundAmount(e.getDppAnnualPhasingCostTotalDTO().getOwnFundAmount() - e.getOwnFundAmount());
			totalDTO.setOwnFundFeAmount(
					e.getDppAnnualPhasingCostTotalDTO().getOwnFundFeAmount() - e.getOwnFundFeAmount());
			totalDTO.setOtherAmount(e.getDppAnnualPhasingCostTotalDTO().getOtherAmount() - e.getOtherAmount());
			totalDTO.setOtherFeAmount(e.getDppAnnualPhasingCostTotalDTO().getOtherFeAmount() - e.getOtherFeAmount());
			dppAnnualPhasingCostTotalServiceImp.update(totalDTO);
		}
	}

	/**
	 * Validation check
	 *
	 * @param annalPhasingCost
	 * @param e
	 */
	private void validationCheck(DppAnnualPhasingCostWithChildRequest annalPhasingCost,
			DppAnnualPhasingCostTabDetailsDTO e) {
		if (annalPhasingCost.getComponentName().equals(DppAnnualPhasing.Revenue_Component)
				|| annalPhasingCost.getComponentName().equals(DppAnnualPhasing.Capital_Component)) {
			if (e.getEconomicCodeId() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Economic code can't be null");
			}
			if (e.getSubEconomicCodeId() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Sub Economic code can't be null");
			}
			if (e.getDescription() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Description can't be null");
			}
			if (e.getIsMajor() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Is Major can't be null");
			}
			if (e.getUnitId() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Unit Id can't be null");
			}
//			if (e.getUnitCost() == null) {
//				throw new ServiceExceptionHolder.InvalidRequestException("Unit Cost can't be null");
//			}
			if (e.getQty() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Qty can't be null");
			}
			if (e.getTotalAmount() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Total Amount can't be null");
			}
		}
	}

	/**
	 * Delete all child for updating new data
	 *
	 * @param response
	 */
	private void deleteByDppAnnualPhasingCostId(DppAnnualPhasingCostWithChildRequest response) {
		Set<Long> dppAnnualPhasingCostTotalIdSet = new HashSet<>();

		dppAnnualPhasingCostTabDetailsRepository.findByDppAnnualPhasingCostIdAndIsDeleted(response.getId(), false)
				.forEach(dacptd -> {
					dppFiscalYearRepository.findByDppAnnualPhasingCostTabDetailsIdAndIsDeleted(dacptd.getId(), false)
							.forEach(dppFiscalYear -> {
								if (!response.getComponentName().equals(DppAnnualPhasing.Contingency))
									dppAnnualPhasingCostTotalIdSet
											.add(dppFiscalYear.getDppAnnualPhasingCostTotal().getId());
								dppFiscalYearRepository.delete(dppFiscalYear);
							});
					dppAnnualPhasingCostTabDetailsRepository.delete(dacptd);
				});
		dppAnnualPhasingCostTotalIdSet.forEach(dppAnnualPhasingCostTotalRepository::deleteById);
	}

	/**
	 * Get DppAnnualPhasingCost by ProjectConceptId and ComponentName
	 *
	 * @param request
	 * @return
	 */
	@Override
	public ResponseEntity<DppAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(
			ProjectConceptIdAndComponentNameRequest request) {

		Optional<DppAnnualPhasingCost> dppAnnualPhasingOfCost = Optional.of(new DppAnnualPhasingCost());
		if(request != null && request.getRdppMasterId() != null){
			dppAnnualPhasingOfCost = repository.findByRdppMasterIdAndComponentNameAndIsDeleted(request.getRdppMasterId(),
							DppAnnualPhasing.valueOf(request.getComponentName()), false);
		}
		if(request != null && request.getProjectConceptId() != null){
			 dppAnnualPhasingOfCost = repository.findByProjectConceptIdAndComponentNameAndIsDeleted(request.getProjectConceptId(),
							DppAnnualPhasing.valueOf(request.getComponentName()), false);
		}

		if (dppAnnualPhasingOfCost.isEmpty())
			return new ResponseEntity<>(null, HttpStatus.OK);
		DppAnnualPhasingCostWithChildResponse response = new ModelMapper().map(dppAnnualPhasingOfCost.get(),
				DppAnnualPhasingCostWithChildResponse.class);
		response.setDppAnnualPhasingCostTabDetails(
				dppAnnualPhasingCostTabDetailsServiceImp.getByDppAnnualPhasingCostId(response.getId()));

		setDppAnnualPhasingCostChild(response);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<DppAnnualPhasingCostEconomicCodeWise>> getAllByProjectConceptIdArrangedEconomicCodeWise(Long projectConceptId) {

		List<DppAnnualPhasingCostEconomicCodeWise> response = new ArrayList<>();
		List<DppAnnualPhasingCostTotalDTO> allTotal = new ArrayList<>();

        List<DppAnnualPhasingCostTabDetails> tabDetails = dppAnnualPhasingCostTabDetailsRepository.findAllByProjectConceptId(projectConceptId);
        Map<Long, EconomicCode> economicCodeMap = configurationClientService.getEconomicCodeByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(tabDetails.stream().map(DppAnnualPhasingCostTabDetails::getEconomicCodeId).collect(Collectors.toSet()));
                }}
        ).stream().collect(Collectors.toMap(EconomicCode::getId, a -> a));

        Map<Long, SubEconomicCode> subEconomicCodeMap = configurationClientService
                .getSubEconomicCodeByIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(tabDetails.stream().map(DppAnnualPhasingCostTabDetails::getSubEconomicCodeId).collect(Collectors.toSet()));
                    }
                }).stream().collect(Collectors.toMap(SubEconomicCode::getId, a -> a));
        Map<Long, UnitType> unitTypeHashMap = configurationClientService
                .getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(tabDetails.stream().map(DppAnnualPhasingCostTabDetails::getUnitId).collect(Collectors.toSet()));
                    }
                }).stream().collect(Collectors.toMap(UnitType::getId, a -> a));


        Optional<DppAnnualPhasingCost> revenue = repository.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId,
						DppAnnualPhasing.Revenue_Component, false);
		if (!revenue.isEmpty())  {
			setEconomicCodeWiseRevenueAndCapital(response, revenue.get(), allTotal, economicCodeMap, subEconomicCodeMap, unitTypeHashMap);
		}

		Optional<DppAnnualPhasingCost> capital = repository.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId,
						DppAnnualPhasing.Capital_Component, false);
		if (!capital.isEmpty())  {
			setEconomicCodeWiseRevenueAndCapital(response, capital.get(), allTotal, economicCodeMap, subEconomicCodeMap, unitTypeHashMap);
		}

		setEconomicCodeWiseContingency(projectConceptId, response, allTotal);
		setEconomicCodeWiseGrandTotal(response, allTotal);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private void setEconomicCodeWiseRevenueAndCapital(List<DppAnnualPhasingCostEconomicCodeWise> response, DppAnnualPhasingCost data, List<DppAnnualPhasingCostTotalDTO> allTotal,
                                                      Map<Long, EconomicCode> economicCodeMap, Map<Long, SubEconomicCode> subEconomicCodeMap, Map<Long, UnitType> unitTypeMap) {
		DppAnnualPhasingCostEconomicCodeWise dppAnnualPhasingCostEconomicCodeWise = new ModelMapper().map(data, DppAnnualPhasingCostEconomicCodeWise.class);

		List<DppAnnualPhasingCostTabDetailsAndEconomicCode> dppAnnualPhasingCostTabDetailsAndEconomicCodes = new ArrayList<>();
		dppAnnualPhasingCostTabDetailsServiceImp.getByDppAnnualPhasingCostId(dppAnnualPhasingCostEconomicCodeWise.getId())
				.stream().collect(groupingBy(DppAnnualPhasingCostTabDetailsDTO::getEconomicCodeId)).forEach((k, v) -> {
					DppAnnualPhasingCostTabDetailsAndEconomicCode detailsAndEconomicCode = new DppAnnualPhasingCostTabDetailsAndEconomicCode();
					detailsAndEconomicCode.setEconomicCodeId(k);
					detailsAndEconomicCode.setEconomicCode(economicCodeMap.get(k));

					detailsAndEconomicCode.setDppAnnualPhasingCostTabDetails(v.stream().peek(p -> {
					    p.setEconomicCodeDTO(economicCodeMap.get(p.getEconomicCodeId()));
					    p.setSubEconomicCodeDTO(subEconomicCodeMap.get(p.getSubEconomicCodeId()));
					    p.setUnitTypeDTO(unitTypeMap.get(p.getUnitId()));
						p.setFiscalYears(dppFiscalYearServiceImp.getByDppAnnualPhasingCostTabDetailsId(p.getId()).stream()
								.sorted(Comparator.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
								.collect(Collectors.toList()));
					}).collect(Collectors.toList()));

					List<DppAnnualPhasingCostTotalDTO> yearWiseTotal = setEconomicCodeWiseDppAnnualPhasingCostTotal(v);
					detailsAndEconomicCode.setYearWiseTotal(yearWiseTotal);

					dppAnnualPhasingCostTabDetailsAndEconomicCodes.add(detailsAndEconomicCode);
				});

		dppAnnualPhasingCostEconomicCodeWise.setDetails(dppAnnualPhasingCostTabDetailsAndEconomicCodes);
		response.add(dppAnnualPhasingCostEconomicCodeWise);
		allTotal.addAll(dppAnnualPhasingCostEconomicCodeWise.getDetails().get(0).getDppAnnualPhasingCostTabDetails().get(0)
				.getFiscalYears().stream().map(DppFiscalYearDTO::getDppAnnualPhasingCostTotalDTO).collect(Collectors.toList()));
	}

	private void setEconomicCodeWiseContingency(Long projectConceptId, List<DppAnnualPhasingCostEconomicCodeWise> response, List<DppAnnualPhasingCostTotalDTO> allTotal) {
		Optional<DppAnnualPhasingCost> contingency = repository.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId,
				DppAnnualPhasing.Contingency, false);

		if (!contingency.isEmpty())  {
			DppAnnualPhasingCostEconomicCodeWise dppAnnualPhasingCostEconomicCodeWise = new ModelMapper().map(contingency.get(), DppAnnualPhasingCostEconomicCodeWise.class);
			List<DppAnnualPhasingCostTabDetailsDTO> detailsDTOList = dppAnnualPhasingCostTabDetailsServiceImp.getByDppAnnualPhasingCostId(dppAnnualPhasingCostEconomicCodeWise.getId()).stream()
					.peek(p -> p.setFiscalYears(dppFiscalYearServiceImp.getByDppAnnualPhasingCostTabDetailsId(p.getId()).stream()
							.sorted(Comparator.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
							.collect(Collectors.toList()))).collect(Collectors.toList());

			dppAnnualPhasingCostEconomicCodeWise.setDetails(Collections.singletonList(
					new DppAnnualPhasingCostTabDetailsAndEconomicCode() {{
						setDppAnnualPhasingCostTabDetails(detailsDTOList);
					}}
			));
			response.add(dppAnnualPhasingCostEconomicCodeWise);
			detailsDTOList.forEach(e -> {
                allTotal.addAll(e.getFiscalYears().stream()
                        .map(m -> new ModelMapper().map(m, DppAnnualPhasingCostTotalDTO.class)).collect(Collectors.toList()));
            });
		}
	}

	private void setEconomicCodeWiseGrandTotal(List<DppAnnualPhasingCostEconomicCodeWise> response, List<DppAnnualPhasingCostTotalDTO> allTotal) {
		if (!allTotal.isEmpty()) {
			List<DppAnnualPhasingCostTotalDTO> total = new ArrayList<>();
			allTotal.stream().collect(groupingBy(DppAnnualPhasingCostTotalDTO::getFiscalYear)).forEach((fk, fv) -> {
				DppAnnualPhasingCostTotalDTO totalDTO = new DppAnnualPhasingCostTotalDTO();
				totalDTO.setFiscalYear(fk);
				totalDTO.setTotalAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getTotalAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setGobAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getGobAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setGobFeAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getGobFeAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setGobThruAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getGobThruAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setSpAcAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getSpAcAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setThruDpAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getThruDpAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setThruPdAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getThruPdAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setOwnFundAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getOwnFundAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setOwnFundFeAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getOwnFundFeAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setOtherAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getOtherAmount).mapToDouble(Double::doubleValue).sum());
				totalDTO.setOtherFeAmount(fv.stream().map(DppAnnualPhasingCostTotalDTO::getOtherFeAmount).mapToDouble(Double::doubleValue).sum());
				total.add(totalDTO);
			});
			DppAnnualPhasingCostEconomicCodeWise dppAnnualPhasingCostEconomicCodeWise = new DppAnnualPhasingCostEconomicCodeWise();
			dppAnnualPhasingCostEconomicCodeWise.setDetails(Collections.singletonList(new DppAnnualPhasingCostTabDetailsAndEconomicCode() {{
				setYearWiseTotal(total);
			}}));
			dppAnnualPhasingCostEconomicCodeWise.setComponentName(DppAnnualPhasing.Grand_Total);
			dppAnnualPhasingCostEconomicCodeWise.setProjectConceptId(response.get(0).getProjectConceptId());
			dppAnnualPhasingCostEconomicCodeWise.setProjectConceptUuid(response.get(0).getProjectConceptUuid());
			response.add(dppAnnualPhasingCostEconomicCodeWise);
		}
	}

	private List<DppAnnualPhasingCostTotalDTO> setEconomicCodeWiseDppAnnualPhasingCostTotal(List<DppAnnualPhasingCostTabDetailsDTO> v) {
		List<DppFiscalYear> fiscalYears = dppFiscalYearRepository.findByDppAnnualPhasingCostTabDetailsIdInAndIsDeleted(v.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()), false);
		List<DppAnnualPhasingCostTotalDTO> yearWiseTotal = new ArrayList<>();
		fiscalYears.stream().collect(groupingBy(DppFiscalYear::getFiscalYear)).forEach((fk, fv) -> {
			DppAnnualPhasingCostTotalDTO totalDTO = new DppAnnualPhasingCostTotalDTO();
			totalDTO.setFiscalYear(fk);
			totalDTO.setTotalAmount(fv.stream().map(DppFiscalYear::getTotalAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setGobAmount(fv.stream().map(DppFiscalYear::getGobAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setGobFeAmount(fv.stream().map(DppFiscalYear::getGobFeAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setGobThruAmount(fv.stream().map(DppFiscalYear::getGobThruAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setSpAcAmount(fv.stream().map(DppFiscalYear::getSpAcAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setThruDpAmount(fv.stream().map(DppFiscalYear::getThruDpAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setThruPdAmount(fv.stream().map(DppFiscalYear::getThruPdAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setOwnFundAmount(fv.stream().map(DppFiscalYear::getOwnFundAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setOwnFundFeAmount(fv.stream().map(DppFiscalYear::getOwnFundFeAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setOtherAmount(fv.stream().map(DppFiscalYear::getOtherAmount).mapToDouble(Double::doubleValue).sum());
			totalDTO.setOtherFeAmount(fv.stream().map(DppFiscalYear::getOtherFeAmount).mapToDouble(Double::doubleValue).sum());
			yearWiseTotal.add(totalDTO);
		});
		return yearWiseTotal.stream()
				.sorted(Comparator.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
				.collect(Collectors.toList());
	}

	/**
	 * Get DppAnnualPhasingCost for getting Fiscal Year
	 *
	 * @param projectConceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<FiscalYearResponse>> getByProjectConceptIdForGettingFiscalYear(Long projectConceptId) {
		List<DppFiscalYearDTO> list = dppFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
				DppAnnualPhasing.Revenue_Component);

		if (list.isEmpty()) {
			list = dppFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
					DppAnnualPhasing.Capital_Component);
			if (list.isEmpty()) {
				list = dppFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
						DppAnnualPhasing.Contingency);
				if (list.isEmpty())
					return new ResponseEntity<>(Collections.EMPTY_LIST, HttpStatus.OK);
			}
		}

		List<FiscalYearResponse> finalList = list.stream().map(m -> new FiscalYearResponse() {
			{
				setFiscalYear(m.getFiscalYear());
			}
		}).distinct()
				.sorted(Comparator
						.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
				.collect(Collectors.toList());

		return new ResponseEntity<>(finalList, HttpStatus.OK);
	}

	/**
	 * set child in DppAnnualPhasingCost
	 *
	 * @param response
	 */
	private void setDppAnnualPhasingCostChild(DppAnnualPhasingCostWithChildResponse response) {
		List<FiscalYearWiseData> list = new ArrayList<>();
		response.getDppAnnualPhasingCostTabDetails().forEach(e -> {
			List<DppFiscalYearDTO> fiscalYearDTOS = dppFiscalYearServiceImp
					.getByDppAnnualPhasingCostTabDetailsId(e.getId());

			FiscalYearWiseItemTotalDTO fiscalYearWiseTotal = new FiscalYearWiseItemTotalDTO();
			fiscalYearDTOS.forEach(fyd -> {
				if (list.stream().anyMatch(a -> a.getFiscalYear().equals(fyd.getFiscalYear()))) {
					int index = IntStream.range(0, list.size())
							.filter(i -> list.get(i).getFiscalYear().equals(fyd.getFiscalYear())).findFirst()
							.orElse(-1);
					list.get(index).getValues().add(fyd);
				} else {
					List<DppFiscalYearDTO> l = new ArrayList<>();
					l.add(fyd);
					list.add(new FiscalYearWiseData() {
						{
							setLastYear(
									Integer.parseInt(fyd.getFiscalYear().substring(fyd.getFiscalYear().length() - 4)));
							setFiscalYear(fyd.getFiscalYear());
							setValues(l);
							setDppAnnualPhasingCostTotal(fyd.getDppAnnualPhasingCostTotalDTO());
						}
					});
				}

				fiscalYearWiseTotal.setFiscalYear(fiscalYearWiseTotal.getFiscalYear() +fyd.getFiscalYear() + ", ");
//				fiscalYearWiseTotal.setQty(fiscalYearWiseTotal.getQty() +fyd.getQty());
				fiscalYearWiseTotal.setTotalAmount(fiscalYearWiseTotal.getTotalAmount() +fyd.getTotalAmount());
				fiscalYearWiseTotal.setGobAmount(fiscalYearWiseTotal.getGobAmount() +fyd.getGobAmount());
				fiscalYearWiseTotal.setGobFeAmount(fiscalYearWiseTotal.getGobFeAmount() +fyd.getGobFeAmount());
				fiscalYearWiseTotal.setGobThruAmount(fiscalYearWiseTotal.getGobThruAmount() +fyd.getGobThruAmount());
				fiscalYearWiseTotal.setSpAcAmount(fiscalYearWiseTotal.getSpAcAmount() +fyd.getSpAcAmount());
				fiscalYearWiseTotal.setThruPdAmount(fiscalYearWiseTotal.getThruPdAmount() +fyd.getThruPdAmount());
				fiscalYearWiseTotal.setThruDpAmount(fiscalYearWiseTotal.getThruDpAmount() +fyd.getThruDpAmount());
				fiscalYearWiseTotal.setOwnFundAmount(fiscalYearWiseTotal.getOwnFundAmount() +fyd.getOwnFundAmount());
				fiscalYearWiseTotal.setOwnFundFeAmount(fiscalYearWiseTotal.getOwnFundFeAmount() +fyd.getOwnFundFeAmount());
				fiscalYearWiseTotal.setOtherAmount(fiscalYearWiseTotal.getOtherAmount() +fyd.getOtherAmount());
				fiscalYearWiseTotal.setOtherFeAmount(fiscalYearWiseTotal.getOtherFeAmount() +fyd.getOtherFeAmount());
			});
			fiscalYearWiseTotal.setDppAnnualPhasingCostTabDetailsId(e.getId());
			e.setFiscalYearsWiseItemTotal(fiscalYearWiseTotal);
			if (e.getEconomicCodeId() != null){
				EconomicCode economicCode = configurationClientService.getEconomicCodeNameById(e.getEconomicCodeId());
				e.setEconomicCodeDTO(economicCode);
			}
			if (e.getSubEconomicCodeId() != null){
				SubEconomicCode subEconomicCode = configurationClientService.getSubEconomicCodeNameById(e.getSubEconomicCodeId());
				e.setSubEconomicCodeDTO(subEconomicCode);
			}
			if (e.getSubEconomicCodeId() != null){
				UnitType unitType = configurationClientService.getUnitNameById(e.getUnitId());
				e.setUnitTypeDTO(unitType);
			}
		});
		List<FiscalYearWiseData> finalList = list.stream().sorted(Comparator.comparing(FiscalYearWiseData::getLastYear))
				.collect(Collectors.toList());
		response.setFiscalYearWiseCost(finalList);
	}


///**
//	 * set child in DppAnnualPhasingCost
//	 *
//	 * @param response
//	 */
//	private void setDppAnnualPhasingCostChild(DppAnnualPhasingCostWithChildResponse response) {
//		List<FiscalYearWiseData> list = new ArrayList<>();
//		response.getDppAnnualPhasingCostTabDetails().forEach(e -> {
//			List<DppFiscalYearDTO> fiscalYearDTOS = dppFiscalYearServiceImp
//					.getByDppAnnualPhasingCostTabDetailsId(e.getId());
//			fiscalYearDTOS.forEach(fyd -> {
//				if (list.stream().anyMatch(a -> a.getFiscalYear().equals(fyd.getFiscalYear()))) {
//					int index = IntStream.range(0, list.size())
//							.filter(i -> list.get(i).getFiscalYear().equals(fyd.getFiscalYear())).findFirst()
//							.orElse(-1);
//					list.get(index).getValues().add(fyd);
//				} else {
//					List<DppFiscalYearDTO> l = new ArrayList<>();
//					l.add(fyd);
//					list.add(new FiscalYearWiseData() {
//						{
//							setLastYear(
//									Integer.parseInt(fyd.getFiscalYear().substring(fyd.getFiscalYear().length() - 4)));
//							setFiscalYear(fyd.getFiscalYear());
//							setValues(l);
//							setDppAnnualPhasingCostTotal(fyd.getDppAnnualPhasingCostTotalDTO());
//						}
//					});
//				}
//			});
//
//			EconomicCode economicCode = configurationClientService.getEconomicCodeNameById(e.getEconomicCodeId());
//			SubEconomicCode subEconomicCode = configurationClientService.getSubEconomicCodeNameById(e.getSubEconomicCodeId());
//			UnitType unitType = configurationClientService.getUnitNameById(e.getUnitId());
//			e.setEconomicCodeDTO(economicCode);
//			e.setSubEconomicCodeDTO(subEconomicCode);
//			e.setUnitTypeDTO(unitType);
//		});
//		List<FiscalYearWiseData> finalList = list.stream().sorted(Comparator.comparing(FiscalYearWiseData::getLastYear))
//				.collect(Collectors.toList());
//		response.setFiscalYearWiseCost(finalList);
//	}

	/**
	 * Get Grand total By Project Concept Id
	 *
	 * @param rdppMasterId
	 * @return
	 */
	@Override
	public ResponseEntity<List<GrandTotalResponse>> getGrandTotalByRdppMasterId(Long rdppMasterId) {
		List<GrandTotalResponse> response = new ArrayList<>();

		List<DppAnnualPhasingCostTotalDTO> revenuesTotal = dppAnnualPhasingCostTotalServiceImp
				.getByRdppMasterIdAndComponentName(rdppMasterId, DppAnnualPhasing.Revenue_Component);
		List<DppAnnualPhasingCostTotalDTO> capitalTotal = dppAnnualPhasingCostTotalServiceImp
				.getByRdppMasterIdAndComponentName(rdppMasterId, DppAnnualPhasing.Capital_Component);
		List<DppFiscalYear> contingency = dppFiscalYearRepository
				.getByProjectConceptIdAndComponentName(rdppMasterId, DppAnnualPhasing.Contingency.ordinal());

		List<DppAnnualPhasingCostTotalDTO> contingencyTotal = contingency.stream()
				.sorted(Comparator.comparing(DppFiscalYear::getCreatedOn))
				.map(m -> new ModelMapper().map(m, DppAnnualPhasingCostTotalDTO.class)).collect(Collectors.toList());

		if (!revenuesTotal.isEmpty())
			addInResponse(response, revenuesTotal, DppAnnualPhasing.Revenue_Component);

		if (!capitalTotal.isEmpty())
			addInResponse(response, capitalTotal, DppAnnualPhasing.Capital_Component);

		if (!contingencyTotal.isEmpty())
			addInResponse(response, contingencyTotal, DppAnnualPhasing.Contingency);

		setGrandTotal(response);

		setRevenueAndCapitalAndContingencyAndGrandTotal(rdppMasterId, response);

		setAllGrandTotal(response);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@Override
	public ResponseEntity<List<GrandTotalResponse>> getYearWiseEstimatedCost(String pcUuid){

		/** (Estimated Cost of the project calculation) */
		List<GrandTotalResponse> estimatedCosts = new ArrayList<>();

		List<DppObjectiveCost> objList = dppObjectiveCostRepository.findAllByProjectConceptUuidAndIsDeletedOrderByIdDesc(pcUuid, false);

		/** Annual Phasing cost Previous revised Data get here */
		for (int i = 0; i < objList.size(); i++) {
			DppObjectiveCost val = objList.get(i);
			ResponseEntity<List<GrandTotalResponse>> grandTotal2 = getGrandTotalByRdppMasterId(val.getId());
			GrandTotalResponse gtDto = grandTotalCal(grandTotal2);
			gtDto.setRevisedVersion(objList.get(i).getRevisedVersion());
			gtDto.setDateCommencement(objList.get(i).getDateCommencement());
			gtDto.setDateCompletion(objList.get(i).getDateCompletion());
			gtDto.setCumulativeDate(objList.get(i).getCumulativeDate());
			estimatedCosts.add(gtDto);
		}

		/** Dpp Grand Total or original version*/
		DppResponse dppResponse = ppsDppTappClientService.getDppObjectivesAndCostByPcUuid(objList.get(0).getProjectConceptUuid());
		DppObjectiveCostResponse dppObjective = dppResponse.getRes();
		ResponseEntity<List<GrandTotalResponse>> dppGrandTotal = ppsDppTappClientService.getGrandTotalByProjectConceptId(objList.get(0).getProjectConceptMasterId());
		GrandTotalResponse a = grandTotalCal(dppGrandTotal);
		a.setRevisedVersion("Original");
		a.setDateCommencement(dppObjective.getDateCommencement());
		a.setDateCompletion(dppObjective.getDateCompletion());
		a.setCumulativeDate(dppObjective.getCumulativeDate());
		estimatedCosts.add(a);

		return new ResponseEntity<>(estimatedCosts, HttpStatus.OK);
	}

	private GrandTotalResponse grandTotalCal(ResponseEntity<List<GrandTotalResponse>> grandTotal) {
		for (GrandTotalResponse grandTotalResponse : grandTotal.getBody()) {
			if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
				return grandTotalResponse;
			}
		}
		return new GrandTotalResponse();
	}

	/**
	 * Add Revenue/Capital/Contingency in Grand total response
	 *
	 * @param response
	 * @param total
	 * @param dppAnnualPhasing
	 */
	private void addInResponse(List<GrandTotalResponse> response, List<DppAnnualPhasingCostTotalDTO> total,
			DppAnnualPhasing dppAnnualPhasing) {
		response.add(new GrandTotalResponse() {
			{
				setDppAnnualPhasing(dppAnnualPhasing);
				setGrandTotal(total.stream().map(m -> new DppAnnualCostTotalWithFiscalYear() {
					{
						setFiscalYear(m.getFiscalYear());
						setDppAnnualPhasingCostTotal(m);
					}
				}).collect(Collectors.toList()));
			}
		});
	}

	/**
	 * Set Revenue, Capital, Contingency and Grand Total in grand total response
	 *
	 * @param rdppMasterId
	 * @param response
	 */
	private void setRevenueAndCapitalAndContingencyAndGrandTotal(Long rdppMasterId,
			List<GrandTotalResponse> response) {
		Optional<DppAnnualPhasingCost> annualRevenuePhasingCost = repository
				.findByRdppMasterIdAndComponentNameAndIsDeleted(rdppMasterId,
						DppAnnualPhasing.Revenue_Component, false);
		DppAnnualPhasingCostTotal dppAnnualPhasingCostTotalRevenue = null;
		if (annualRevenuePhasingCost.isPresent()) {
			dppAnnualPhasingCostTotalRevenue = dppAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(annualRevenuePhasingCost.get().getDppAnnualPhasingCostTotal().getId(), false)
					.get();
		}
		if (dppAnnualPhasingCostTotalRevenue != null) {
			DppAnnualPhasingCostTotalDTO finalDppAnnualPhasingCostTotal = new ModelMapper()
					.map(dppAnnualPhasingCostTotalRevenue, DppAnnualPhasingCostTotalDTO.class);
			response.get(0).setDppAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
		}

		Optional<DppAnnualPhasingCost> annualCapitalPhasingCost = repository
				.findByRdppMasterIdAndComponentNameAndIsDeleted(rdppMasterId,
						DppAnnualPhasing.Capital_Component, false);
		DppAnnualPhasingCostTotal dppAnnualPhasingCostTotalCapital = null;
		if (annualCapitalPhasingCost.isPresent()) {
			dppAnnualPhasingCostTotalCapital = dppAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(annualCapitalPhasingCost.get().getDppAnnualPhasingCostTotal().getId(), false)
					.get();
		}
		if (dppAnnualPhasingCostTotalCapital != null && response.size()>1) {
			DppAnnualPhasingCostTotalDTO finalDppAnnualPhasingCostTotal = new ModelMapper()
					.map(dppAnnualPhasingCostTotalCapital, DppAnnualPhasingCostTotalDTO.class);
			response.get(1).setDppAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
		}

		Optional<DppAnnualPhasingCost> annualContingencyPhasingCost = repository
				.findByRdppMasterIdAndComponentNameAndIsDeleted(rdppMasterId, DppAnnualPhasing.Contingency,
						false);
		List<DppAnnualPhasingCostTotalDTO> contingencyList = new ArrayList<>();
		if (annualContingencyPhasingCost.isPresent() && response.size()>1) {
			contingencyList = dppAnnualPhasingCostTabDetailsServiceImp
					.getByDppAnnualPhasingCostId(annualContingencyPhasingCost.get().getId()).stream()
					.sorted(Comparator.comparing(UuidIdHolderRequestBodyDTO::getId)).collect(Collectors.toList())
					.stream().map(m -> new ModelMapper().map(m, DppAnnualPhasingCostTotalDTO.class))
					.collect(Collectors.toList());
			if(response.size()>2)
				response.get(2).setDppAnnualPhasingCostTotal(contingencyList);

		}

		List<DppAnnualPhasingCostTotalDTO> grandList = new ArrayList<>();
		response.forEach(e -> {
			if (e.getDppAnnualPhasingCostTotal() != null && !e.getDppAnnualPhasingCostTotal().isEmpty())
				grandList.addAll(e.getDppAnnualPhasingCostTotal());
		});

		DppAnnualPhasingCostTotalDTO total = new DppAnnualPhasingCostTotalDTO();
		total.setTotalAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getTotalAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getGobAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobFeAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getGobFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobThruAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getGobThruAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setSpAcAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getSpAcAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setThruPdAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getThruPdAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setThruDpAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getThruDpAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOwnFundAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getOwnFundAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOwnFundFeAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getOwnFundFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOtherAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getOtherAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOtherFeAmount(grandList.stream().map(DppAnnualPhasingCostTotalDTO::getOtherFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		response.get(response.size() - 1).setDppAnnualPhasingCostTotal(Collections.singletonList(total));
	}

	private void setAllGrandTotal(List<GrandTotalResponse> response) {
		Optional<GrandTotalResponse> grandTotalItem = response.stream().filter(f -> f.getDppAnnualPhasing().equals(DppAnnualPhasing.Grand_Total)).findAny();
		if (grandTotalItem.isPresent()) {
			DppAnnualPhasingCostTotalDTO grandTotal = grandTotalItem.get().getDppAnnualPhasingCostTotal().get(0);
			List<DppAnnualCostTotalWithFiscalYear> yearWiseTotalList = grandTotalItem.get().getGrandTotal();

			DppAnnualPhasingCostTotalDTO total = new DppAnnualPhasingCostTotalDTO();
			total.setTotalAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getTotalAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getTotalAmount());
			total.setGobAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getGobAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getGobAmount());
			total.setGobFeAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getGobFeAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getGobFeAmount());
			total.setGobThruAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getGobThruAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getGobThruAmount());
			total.setSpAcAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getSpAcAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getSpAcAmount());
			total.setThruPdAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getThruPdAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getThruPdAmount());
			total.setThruDpAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getThruDpAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getThruDpAmount());
			total.setOwnFundAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getOwnFundAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getOwnFundAmount());
			total.setOwnFundFeAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getOwnFundFeAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getOwnFundFeAmount());
			total.setOtherAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getOtherAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getOtherAmount());
			total.setOtherFeAmount(yearWiseTotalList.stream().map(fs -> fs.getDppAnnualPhasingCostTotal().getOtherFeAmount())
					.mapToDouble(Double::doubleValue).sum() + grandTotal.getOtherFeAmount());
			response.get(response.size() - 1).setAllGrandTotal(total);
		}
	}

	/**
	 * Set sum of revenue, capital and contingency total
	 *
	 * @param response
	 */
	private void setGrandTotal(List<GrandTotalResponse> response) {
		List<DppAnnualCostTotalWithFiscalYear> total = new ArrayList<>();

		List<DppAnnualCostTotalWithFiscalYear> list = new ArrayList<>();
		response.forEach(e -> list.addAll(e.getGrandTotal()));

		Map<String, List<DppAnnualCostTotalWithFiscalYear>> mapList = list.stream()
				.collect(groupingBy(DppAnnualCostTotalWithFiscalYear::getFiscalYear));

		mapList.forEach((k, v) -> {
			DppAnnualPhasingCostTotalDTO dto = new DppAnnualPhasingCostTotalDTO();
			dto.setTotalAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getTotalAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getGobAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobFeAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getGobFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobThruAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getGobThruAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setSpAcAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getSpAcAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setThruPdAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getThruPdAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setThruDpAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getThruDpAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOwnFundAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getOwnFundAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOwnFundFeAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getOwnFundFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOtherAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getOtherAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOtherFeAmount(v.stream().map(m -> m.getDppAnnualPhasingCostTotal().getOtherFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			total.add(new DppAnnualCostTotalWithFiscalYear() {
				{
					setFiscalYear(k);
					setDppAnnualPhasingCostTotal(dto);
				}
			});
		});

		List<DppAnnualCostTotalWithFiscalYear> finalList = new ArrayList<>();
		if (!total.isEmpty()) {
			finalList = total.stream()
					.sorted(Comparator.comparing(
							c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
					.collect(Collectors.toList());
		}

		List<DppAnnualCostTotalWithFiscalYear> finalList1 = finalList;
		response.add(new GrandTotalResponse() {
			{
				setDppAnnualPhasing(DppAnnualPhasing.Grand_Total);
				setGrandTotal(finalList1);
			}
		});
	}

	/**
	 * Get Year Wise Physical and Financial Target By Project concept id
	 *
	 * @param conceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<YearWisePhysicalAndFinancialTarget>> getYearWisePhysicalAndFinancialTargetByProjectConceptId(
			Long conceptId) {

		List<DppAnnualPhasingCostDTO> dppAnnualPhasingCostDTOS = convertForRead(
				repository.findByRdppMasterIdAndIsDeleted(conceptId, false));

		if (dppAnnualPhasingCostDTOS.isEmpty())
			return new ResponseEntity<>(null, HttpStatus.OK);

		Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository
				.findByProjectConceptUuidAndIdAndIsDeleted(dppAnnualPhasingCostDTOS.get(0).getProjectConceptUuid(), dppAnnualPhasingCostDTOS.get(0).getRdppMasterId(), false);
		int month = dppObjectiveCost.get().getDateCommencement().getMonth().getValue();
		int year = dppObjectiveCost.get().getDateCommencement().getYear();

		AtomicReference<Double> total = new AtomicReference<>(0.0);
		Set<Long> subEconomicCodeSet = new HashSet<>();
		Set<Long> unitTypeSet = new HashSet<>();
		List<FinancialYears> allFinancialYears = new ArrayList<>();
		List<YearWisePhysicalAndFinancialTarget> yearWisePhysicalAndFinancialTargetList = new ArrayList<>();
		Double grandTotalAmount = dppAnnualPhasingCostTabDetailsRepository
				.getTotalAmountByProjectConceptUuid(conceptId);
		dppAnnualPhasingCostDTOS.forEach(apcd -> {
			YearWisePhysicalAndFinancialTarget yearWisePhysicalAndFinancialTarget = new ModelMapper().map(apcd,
					YearWisePhysicalAndFinancialTarget.class);
			if (!apcd.getComponentName().equals(DppAnnualPhasing.Contingency)) {
				total.updateAndGet(v -> v + apcd.getDppAnnualPhasingCostTotal().getTotalAmount());
			}

			List<DppAnnualPhasingCostDetails> details = new ArrayList<>();
			dppAnnualPhasingCostTabDetailsServiceImp.getByDppAnnualPhasingCostId(apcd.getId()).forEach(dapc -> {
				if (apcd.getComponentName().equals(DppAnnualPhasing.Contingency)) {
					List<DppFiscalYearDTO> contingencyList = dppFiscalYearServiceImp
							.getByDppAnnualPhasingCostTabDetailsId(dapc.getId());
					total.set(contingencyList.stream().mapToDouble(DppFiscalYearDTO::getTotalAmount).sum());
				}
				DppAnnualPhasingCostDetails dppAnnualPhasingCostDetails = new ModelMapper().map(dapc,
						DppAnnualPhasingCostDetails.class);

				List<DppFiscalYearDTO> dppFiscalYearDTOList = dppFiscalYearServiceImp
						.getByDppAnnualPhasingCostTabDetailsId(dapc.getId());
				List<FinancialYears> financialYears = new ArrayList<>();
//                AtomicInteger fiscalYearCount = new AtomicInteger();
				dppFiscalYearDTOList.forEach(fy -> {
					FinancialYears financialYear = new FinancialYears();
//                    int currentYear = Integer.parseInt(StringUtils.substring(fy.getFiscalYear(), 0, 4));
//                    financialYear.setMonth((fiscalYearCount.get() > 0) ? 7 : month);
					financialYear.setFiscalYear(fy.getFiscalYear());
					financialYear.setFinancialAmount(fy.getTotalAmount());
					if (fy.getTotalAmount() > 0) {
						financialYear.setPercentageOfItem((100 / dapc.getTotalAmount()) * fy.getTotalAmount());
//                        financialYear.setPercentageOfProject((100 / (total.get() * 104)) * fy.getTotalAmount());
						financialYear.setPercentageOfProject((100 / grandTotalAmount) * fy.getTotalAmount());
					} else {
						financialYear.setPercentageOfItem(0.0);
						financialYear.setPercentageOfProject(0.0);
					}
					financialYears.add(financialYear);
//                    fiscalYearCount.addAndGet(1);
				});

				if (apcd.getComponentName().equals(DppAnnualPhasing.Contingency)) {
					double totalAmount = dppFiscalYearDTOList.stream().mapToDouble(DppFiscalYearDTO::getTotalAmount)
							.sum();
					dppAnnualPhasingCostDetails.setTotalAmount(totalAmount);
//                    dppAnnualPhasingCostDetails.setWeight((totalAmount > 0) ? (totalAmount / (total.get() * 104)) : 0);
				} else {
//                    dppAnnualPhasingCostDetails.setWeight((dapc.getTotalAmount() > 0) ? (dapc.getTotalAmount() / (total.get() * 104)) : 0);
					subEconomicCodeSet.add(dppAnnualPhasingCostDetails.getSubEconomicCodeId());
					unitTypeSet.add(dppAnnualPhasingCostDetails.getUnitId());
				}

				dppAnnualPhasingCostDetails.setWeight(
						(dapc.getTotalAmount() > 0) ? (dapc.getTotalAmount() / grandTotalAmount) : 0);
				dppAnnualPhasingCostDetails.setYears(financialYears.stream()
						.sorted(Comparator.comparing(
								c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
						.collect(Collectors.toList()));
				details.add(dppAnnualPhasingCostDetails);
				allFinancialYears.addAll(financialYears);
			});

			yearWisePhysicalAndFinancialTarget.setDetails(details);
			yearWisePhysicalAndFinancialTargetList.add(yearWisePhysicalAndFinancialTarget);
		});

		setAllDto(subEconomicCodeSet, unitTypeSet, yearWisePhysicalAndFinancialTargetList);

		grandTotalAdd(allFinancialYears, yearWisePhysicalAndFinancialTargetList);

		return new ResponseEntity<>(yearWisePhysicalAndFinancialTargetList, HttpStatus.OK);
	}

	private void setAllDto(Set<Long> subEconomicCodeSet, Set<Long> unitTypeSet,
			List<YearWisePhysicalAndFinancialTarget> yearWisePhysicalAndFinancialTargetList) {
		if (!yearWisePhysicalAndFinancialTargetList.isEmpty()) {
			Map<Long, SubEconomicCode> subEconomicCodeMap = configurationClientService
					.getSubEconomicCodeByIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(subEconomicCodeSet);
						}
					}).stream().collect(Collectors.toMap(SubEconomicCode::getId, a -> a));
			Map<Long, UnitType> unitTypeHashMap = configurationClientService
					.getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(unitTypeSet);
						}
					}).stream().collect(Collectors.toMap(UnitType::getId, a -> a));

			yearWisePhysicalAndFinancialTargetList.forEach(e -> {
				if (!e.getComponentName().equals(DppAnnualPhasing.Contingency)) {
					e.getDetails().forEach(d -> {
						d.setSubEconomicCodeDTO(subEconomicCodeMap.get(d.getSubEconomicCodeId()));
						d.setEconomicCodeDTO(subEconomicCodeMap.get(d.getSubEconomicCodeId()).getEconomicCodeDTO());
						d.setUnitTypeDTO(unitTypeHashMap.get(d.getUnitId()));
					});
				}
			});
		}
	}

	private void grandTotalAdd(List<FinancialYears> allFinancialYears,
			List<YearWisePhysicalAndFinancialTarget> yearWisePhysicalAndFinancialTargetList) {
		YearWisePhysicalAndFinancialTarget grand = new YearWisePhysicalAndFinancialTarget();
		grand.setComponentName(DppAnnualPhasing.Grand_Total);

		DppAnnualPhasingCostDetails dppAnnualPhasingCostDetails = new DppAnnualPhasingCostDetails();
		dppAnnualPhasingCostDetails.setTotalAmount(0.0);
		dppAnnualPhasingCostDetails.setWeight(0.0);
		Map<String, List<FinancialYears>> financialYearsMap = allFinancialYears.stream()
				.collect(groupingBy(FinancialYears::getFiscalYear));
		yearWisePhysicalAndFinancialTargetList.forEach(e -> {
			dppAnnualPhasingCostDetails.setTotalAmount(dppAnnualPhasingCostDetails.getTotalAmount()
					+ e.getDetails().stream().mapToDouble(DppAnnualPhasingCostDetails::getTotalAmount).sum());
			dppAnnualPhasingCostDetails.setWeight(dppAnnualPhasingCostDetails.getWeight()
					+ e.getDetails().stream().mapToDouble(DppAnnualPhasingCostDetails::getWeight).sum());
		});

		List<FinancialYears> financialYears = new ArrayList<>();
		financialYearsMap.forEach((k, v) -> {
			FinancialYears financialYear = new FinancialYears();
			financialYear.setFiscalYear(k);
			financialYear.setFinancialAmount(v.stream().mapToDouble(FinancialYears::getFinancialAmount).sum());
			financialYear.setPercentageOfItem(v.stream().mapToDouble(FinancialYears::getPercentageOfItem).sum());
			financialYear.setPercentageOfProject(v.stream().mapToDouble(FinancialYears::getPercentageOfProject).sum());
			financialYears.add(financialYear);
		});
		dppAnnualPhasingCostDetails.setYears(financialYears.stream()
				.sorted(Comparator
						.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
				.collect(Collectors.toList()));
		grand.setDetails(Collections.singletonList(dppAnnualPhasingCostDetails));
		yearWisePhysicalAndFinancialTargetList.add(grand);
	}

	/**
	 * For Save Annual Phasing
	 *
	 * @param dppAnnualPhasingCostDTO
	 * @return ResponseEntity<IdentityResponse>
	 */
	@Override
	public ResponseEntity<IdentityResponse> saveAnnualPhasing(DppAnnualPhasingCostDTO dppAnnualPhasingCostDTO) {
		return new ResponseEntity(new IdentityResponse("Save Successfully"), HttpStatus.OK);
	}

	/**
	 * FOr Get Annual Phasing
	 *
	 * @return List<DppAnnualPhasingCost>
	 */
	@Override
	public ResponseEntity<List<DppAnnualPhasingCost>> getAnnualPhasing() {
		return new ResponseEntity(repository.findAll(), HttpStatus.OK);
	}

	/**
	 * For Get Grand Total Annual Phasing By Id
	 *
	 * @param conceptId
	 * @return DppGrandTotalResponse
	 */
	@Override
	public ResponseEntity<DppGrandTotalResponse> getGrandTotalAnnualPhasingById(String conceptId) {

		return new ResponseEntity(null, HttpStatus.OK);
	}

	/**
	 * get Contingency Logic
	 *
	 * @param conceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<DppContingencyResponse>> getContingency(String conceptId) {

		return new ResponseEntity<>(null, HttpStatus.OK);
	}

	/**
	 * Get all by Project Concept ID
	 *
	 * @param projectConceptUuid
	 * @return
	 */
	@Override
	public List<DppAnnualPhasingCost> getAllByPCUuid(String projectConceptUuid) {
		return repository.findAllByProjectConceptId(projectConceptUuid);
	}

	/**
	 * Get by Project Concept ID And Type
	 *
	 * @param projectConceptUuid
	 * @param type
	 * @return
	 */
	@Override
	public DppAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(String projectConceptUuid, String type) {
		try {
			DppAnnualPhasing dppAnnualPhasing = DppAnnualPhasing.valueOf(type);
			Optional<DppAnnualPhasingCost> dppAnnualPhasingOfCostOptional = repository
					.findByProjectConceptUuidAndIsDeletedAndComponentName(projectConceptUuid, false, dppAnnualPhasing);
			DppAnnualPhasingCost dppAnnualPhasingCost = null;
			if (dppAnnualPhasingOfCostOptional.isPresent()) {
				dppAnnualPhasingCost = dppAnnualPhasingOfCostOptional.get();
			}
			return dppAnnualPhasingCost;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public DetailsEstimatedCostResponse getDetailsEstimatedCost(Long id) {
		try {
			/* Find All DppAnnualPhasingCost by projectConceptUuid and isDelete */
			List<DppAnnualPhasingCost> dppAnnualPhasingCostList = repository
					.findAllByRdppMasterIdAndIsDeleted(id, false);

			/* Create new Details Estimated Cost Response */
			DetailsEstimatedCostResponse detailsEstimatedCostResponse = new DetailsEstimatedCostResponse();

			List<EstimatedCostAnnexureDTO> estimatedCostAnnexureDTOList = new ArrayList<>();

			/* Itearate Ecah value of dppAnnualPhasingCostList */
			for (DppAnnualPhasingCost dppAnnualPhasingCost : dppAnnualPhasingCostList) {
				EstimatedCostAnnexureDTO estimatedCostAnnexureDTO = new EstimatedCostAnnexureDTO();
				estimatedCostAnnexureDTO.setId(dppAnnualPhasingCost.getId());
				estimatedCostAnnexureDTO.setComponentName(dppAnnualPhasingCost.getComponentName());
				estimatedCostAnnexureDTO.setUuid(dppAnnualPhasingCost.getUuid());
				estimatedCostAnnexureDTO.setProjectConceptUuid(dppAnnualPhasingCost.getProjectConceptUuid());
				estimatedCostAnnexureDTO.setProjectConceptId(dppAnnualPhasingCost.getProjectConceptId());

				/* Add Sub Total */
				DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
				if (dppAnnualPhasingCost.getDppAnnualPhasingCostTotal() != null) {
					BeanUtils.copyProperties(dppAnnualPhasingCost.getDppAnnualPhasingCostTotal(),
							dppAnnualPhasingCostTotalDTO);
					estimatedCostAnnexureDTO.setDppAnnualPhasingCostTotal(dppAnnualPhasingCostTotalDTO);
				}

				/* Tab Details */
				List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetailsDTOS = dppAnnualPhasingCostTabDetailsServiceImp
						.getByDppAnnualPhasingCostId(dppAnnualPhasingCost.getId());
				List<EstimatedCostTabDetailsDTO> estimatedCostTabDetailsDTOS = getTabDetails(
						dppAnnualPhasingCostTabDetailsDTOS);
				estimatedCostAnnexureDTO.setEstimatedCostTabDetailsDTOS(estimatedCostTabDetailsDTOS);

				/* Add to the EstimatedCostAnnexureDTO List */
				estimatedCostAnnexureDTOList.add(estimatedCostAnnexureDTO);
			}

			detailsEstimatedCostResponse.setDppAnnualPhasingCostDTOList(estimatedCostAnnexureDTOList);

			/* Set Grand Total */
			setGrandTotalDetailsEstimatedCost(detailsEstimatedCostResponse.getDppAnnualPhasingCostDTOList(),
					detailsEstimatedCostResponse);

			/* Calculation */
			DetailsEstimatedCostResponse response = calculationEstimatedCostAnnexureVaData(
					detailsEstimatedCostResponse);

			// this code for report
			EstimatedCostAnnexureDTO revenue = response.getDppAnnualPhasingCostDTOList().stream()
					.filter(e -> e.getComponentName().equals(DppAnnualPhasing.Revenue_Component)).findFirst()
					.orElse(null);

			EstimatedCostAnnexureDTO capital = response.getDppAnnualPhasingCostDTOList().stream()
					.filter(e -> e.getComponentName().equals(DppAnnualPhasing.Capital_Component)).findFirst()
					.orElse(null);

			EstimatedCostAnnexureDTO contingency = response.getDppAnnualPhasingCostDTOList().stream()
					.filter(e -> e.getComponentName().equals(DppAnnualPhasing.Contingency)).findFirst().orElse(null);

			response.setRevenue(groupByEconomicCodeAndSubTotal(revenue));
			response.setCapital(groupByEconomicCodeAndSubTotal(capital));
			response.setContingency(contingency);
			response.setIsForeignAid(true);

			return response;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public List<EstimatedCostTabDetailsDTO> getTabDetails(
			List<DppAnnualPhasingCostTabDetailsDTO> dppAnnualPhasingCostTabDetailsDTOS) {

		Set<Long> subEconomicCodeSet = dppAnnualPhasingCostTabDetailsDTOS.stream()
				.map(DppAnnualPhasingCostTabDetailsDTO::getSubEconomicCodeId).collect(Collectors.toSet());
		Set<Long> unitTypeSet = dppAnnualPhasingCostTabDetailsDTOS.stream()
				.map(DppAnnualPhasingCostTabDetailsDTO::getUnitId).collect(Collectors.toSet());

		Map<Long, SubEconomicCode> subEconomicCodeMap = configurationClientService
				.getSubEconomicCodeByIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(subEconomicCodeSet);
					}
				}).stream().collect(Collectors.toMap(SubEconomicCode::getId, a -> a));

		Map<Long, UnitType> unitTypeHashMap = configurationClientService.getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
			{
				setIds(unitTypeSet);
			}
		}).stream().collect(Collectors.toMap(UnitType::getId, a -> a));

		List<EstimatedCostTabDetailsDTO> estimatedCostTabDetailsDTOS = new ArrayList<>();

		double totalCostCalculated = 0.0;

		for (DppAnnualPhasingCostTabDetailsDTO e : dppAnnualPhasingCostTabDetailsDTOS) {
			if (e != null) {
				EstimatedCostTabDetailsDTO estimatedCostTabDetailsDTO = new EstimatedCostTabDetailsDTO();
				BeanUtils.copyProperties(e, estimatedCostTabDetailsDTO);
				estimatedCostTabDetailsDTO.setSubEconomicCode((subEconomicCodeMap.get(e.getSubEconomicCodeId())));
				if (e.getSubEconomicCodeId() != null) {
					estimatedCostTabDetailsDTO
							.setEconomicCode(subEconomicCodeMap.get(e.getSubEconomicCodeId()).getEconomicCodeDTO());
				}
				totalCostCalculated = totalCostCalculated + e.getGobAmount() + e.getGobThruAmount() + e.getSpAcAmount()
						+ e.getThruDpAmount() + e.getThruPdAmount() + e.getOwnFundAmount() + e.getOtherAmount();
				estimatedCostTabDetailsDTO.setTotalCostCalculated(totalCostCalculated);
				totalCostCalculated = 0;
				estimatedCostTabDetailsDTO.setUnitType(unitTypeHashMap.get(e.getUnitId()));
				estimatedCostTabDetailsDTOS.add(estimatedCostTabDetailsDTO);
			}
		}
		return estimatedCostTabDetailsDTOS;
	}

	public void setGrandTotalDetailsEstimatedCost(List<EstimatedCostAnnexureDTO> dppAnnualPhasingCostList,
			DetailsEstimatedCostResponse detailsEstimatedCostResponse) {

		/* Total Amount of Revenue Component */
		List<DppAnnualPhasingCostTotalDTO> revenuesTotal = dppAnnualPhasingCostList.stream()
				.filter(f -> f.getComponentName().equals(DppAnnualPhasing.Revenue_Component))
				.map(EstimatedCostAnnexureDTO::getDppAnnualPhasingCostTotal).collect(Collectors.toList());

		/* Total Amount of Capital Component */
		List<DppAnnualPhasingCostTotalDTO> capitalTotal = dppAnnualPhasingCostList.stream()
				.filter(f -> f.getComponentName().equals(DppAnnualPhasing.Capital_Component))
				.map(EstimatedCostAnnexureDTO::getDppAnnualPhasingCostTotal).collect(Collectors.toList());

		/* Find Contigency List */
		List<EstimatedCostAnnexureDTO> contigencyList = new ArrayList<>();
		dppAnnualPhasingCostList.stream().filter(f -> f.getComponentName().equals(DppAnnualPhasing.Contingency))
				.forEach(i -> {
					EstimatedCostAnnexureDTO dppAnnualPhasingCostDTO = new EstimatedCostAnnexureDTO();
					dppAnnualPhasingCostDTO.setEstimatedCostTabDetailsDTOS(i.getEstimatedCostTabDetailsDTOS());
					contigencyList.add(dppAnnualPhasingCostDTO);
				});

		/* Total Amount of physical Contigency */
		List<EstimatedCostTabDetailsDTO> physicalContigencyTotal = contigencyList.stream()
				.map(m -> m.getEstimatedCostTabDetailsDTOS().get(0)).collect(Collectors.toList());

		/* Total Amount of price Contigency */
		List<EstimatedCostTabDetailsDTO> priceContigencyTotal = contigencyList.stream()
				.map(m -> m.getEstimatedCostTabDetailsDTOS().get(1)).collect(Collectors.toList());

		/*
		 * Convert DppAnnualPhasingCostTabDetailsDTO to DppAnnualPhasingCostTotalDTO for
		 * physicalContigency
		 */
		List<DppAnnualPhasingCostTotalDTO> physicalContigency = physicalContigencyTotal.stream()
				.map(m -> new DppAnnualPhasingCostTotalDTO() {
					{
						setQty(m.getQty());
						setGobAmount(m.getGobAmount());
						setGobFeAmount(m.getGobFeAmount());
						setGobThruAmount(m.getGobThruAmount());
						setSpAcAmount(m.getSpAcAmount());
						setThruDpAmount(m.getThruDpAmount());
						setThruPdAmount(m.getThruPdAmount());
						setOwnFundAmount(m.getOwnFundAmount());
						setOwnFundFeAmount(m.getOwnFundFeAmount());
						setOtherAmount(m.getOtherAmount());
						setOtherFeAmount(m.getOtherFeAmount());
						setTotalAmount(m.getTotalAmount());
					}
				}).collect(Collectors.toList());

		/*
		 * Convert DppAnnualPhasingCostTabDetailsDTO to DppAnnualPhasingCostTotalDTO for
		 * priceContigency
		 */
		List<DppAnnualPhasingCostTotalDTO> priceContigency = priceContigencyTotal.stream()
				.map(m -> new DppAnnualPhasingCostTotalDTO() {
					{
						setQty(m.getQty());
						setGobAmount(m.getGobAmount());
						setGobFeAmount(m.getGobFeAmount());
						setGobThruAmount(m.getGobThruAmount());
						setSpAcAmount(m.getSpAcAmount());
						setThruDpAmount(m.getThruDpAmount());
						setThruPdAmount(m.getThruPdAmount());
						setOwnFundAmount(m.getOwnFundAmount());
						setOwnFundFeAmount(m.getOwnFundFeAmount());
						setOtherAmount(m.getOtherAmount());
						setOtherFeAmount(m.getOtherFeAmount());
						setTotalAmount(m.getTotalAmount());

					}
				}).collect(Collectors.toList());

		/*
		 * Add revenueSubTotal, capitalSubTotal , physicalContigencySubTotal,
		 * priceContigencySubTotal to the Array List
		 */

		List<DppAnnualPhasingCostTotalDTO> annualPhasingCostTotalDTOList = new ArrayList<>();
		DppAnnualPhasingCostTotalDTO revenueSubTotal = new DppAnnualPhasingCostTotalDTO();
		DppAnnualPhasingCostTotalDTO capitalSubTotal = new DppAnnualPhasingCostTotalDTO();
		DppAnnualPhasingCostTotalDTO physicalContigencySubTotal = new DppAnnualPhasingCostTotalDTO();
		DppAnnualPhasingCostTotalDTO priceContigencySubTotal = new DppAnnualPhasingCostTotalDTO();

		if (!revenuesTotal.isEmpty()) {
			revenueSubTotal = revenuesTotal.get(0);
		}

		if (!capitalTotal.isEmpty()) {
			capitalSubTotal = capitalTotal.get(0);
		}
		if (!physicalContigency.isEmpty()) {
			physicalContigencySubTotal = physicalContigency.get(0);
		}
		if (!priceContigency.isEmpty()) {
			priceContigencySubTotal = priceContigency.get(0);
		}

		annualPhasingCostTotalDTOList.add(revenueSubTotal);
		annualPhasingCostTotalDTOList.add(capitalSubTotal);
		annualPhasingCostTotalDTOList.add(physicalContigencySubTotal);
		annualPhasingCostTotalDTOList.add(priceContigencySubTotal);

		/*
		 * Calculation for Grand Total revenueSubTotal, capitalSubTotal ,
		 * physicalContigencySubTotal, priceContigencySubTotal
		 */
		DppAnnualPhasingCostTotalDTO total = new DppAnnualPhasingCostTotalDTO();
		total.setQty(annualPhasingCostTotalDTOList.stream().filter(f -> f.getQty() != null)
				.map(DppAnnualPhasingCostTotalDTO::getQty).mapToDouble(Double::doubleValue).sum());
		total.setTotalAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getTotalAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getTotalAmount).mapToDouble(Double::doubleValue).sum());
		total.setGobAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getGobAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getGobAmount).mapToDouble(Double::doubleValue).sum());
		total.setGobFeAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getGobFeAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getGobFeAmount).mapToDouble(Double::doubleValue).sum());
		total.setGobThruAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getGobThruAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getGobThruAmount).mapToDouble(Double::doubleValue).sum());
		total.setSpAcAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getSpAcAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getSpAcAmount).mapToDouble(Double::doubleValue).sum());
		total.setThruPdAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getThruPdAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getThruPdAmount).mapToDouble(Double::doubleValue).sum());
		total.setThruDpAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getThruDpAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getThruDpAmount).mapToDouble(Double::doubleValue).sum());
		total.setOwnFundAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getOwnFundAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getOwnFundAmount).mapToDouble(Double::doubleValue).sum());
		total.setOwnFundFeAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getOwnFundFeAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getOtherFeAmount).mapToDouble(Double::doubleValue).sum());
		total.setOtherAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getOtherAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getOtherAmount).mapToDouble(Double::doubleValue).sum());
		total.setOtherFeAmount(annualPhasingCostTotalDTOList.stream().filter(f -> f.getOtherFeAmount() != null)
				.map(DppAnnualPhasingCostTotalDTO::getOtherFeAmount).mapToDouble(Double::doubleValue).sum());
		detailsEstimatedCostResponse.setGrandTotalResponses(total);
	}

	public DetailsEstimatedCostResponse calculationEstimatedCostAnnexureVaData(
			DetailsEstimatedCostResponse detailsEstimatedCostResponse) {

		DetailsEstimatedCostResponse response = new DetailsEstimatedCostResponse();
		double totalCost = 0;
		double totalProjectCost = 0;

		for(EstimatedCostAnnexureDTO estimatedCostAnnexureDTO: detailsEstimatedCostResponse.getDppAnnualPhasingCostDTOList()) {
			for (EstimatedCostTabDetailsDTO estimatedCostTabDetailsDTO : estimatedCostAnnexureDTO
					.getEstimatedCostTabDetailsDTOS()) {
				if (estimatedCostTabDetailsDTO.getTotalCostCalculated() != null) {
					totalCost = totalCost + estimatedCostTabDetailsDTO.getTotalCostCalculated();
				}
			}
		}

		List<EstimatedCostAnnexureDTO> estimatedCostAnnexureList = new ArrayList<>();
		for (EstimatedCostAnnexureDTO estimatedCostAnnexureDTO : detailsEstimatedCostResponse
				.getDppAnnualPhasingCostDTOList()) {
			double subTotalCost = 0;
			double subTotalProjectCost = 0;
			EstimatedCostAnnexureDTO estimatedCostAnnexureResponse = new EstimatedCostAnnexureDTO();
			estimatedCostAnnexureResponse.setUuid(estimatedCostAnnexureDTO.getUuid());
			estimatedCostAnnexureResponse.setComponentName(estimatedCostAnnexureDTO.getComponentName());
			estimatedCostAnnexureResponse.setId(estimatedCostAnnexureDTO.getId());
			estimatedCostAnnexureResponse.setProjectConceptId(estimatedCostAnnexureDTO.getProjectConceptId());
			estimatedCostAnnexureResponse.setProjectConceptUuid(estimatedCostAnnexureDTO.getProjectConceptUuid());

			List<EstimatedCostTabDetailsDTO> estimatedCostTabDetailsList = new ArrayList<>();
			for (EstimatedCostTabDetailsDTO estimatedCostTabDetailsDTO : estimatedCostAnnexureDTO
					.getEstimatedCostTabDetailsDTOS()) {
				EstimatedCostTabDetailsDTO estimatedCostTabDetailsResponse = new EstimatedCostTabDetailsDTO();
				BeanUtils.copyProperties(estimatedCostTabDetailsDTO, estimatedCostTabDetailsResponse);

				Double totalProjectConstCal = (100 / totalCost) * estimatedCostTabDetailsDTO.getTotalCostCalculated();
				totalProjectConstCal = totalProjectConstCal.isNaN() ? 0.00  : totalProjectConstCal;
				estimatedCostTabDetailsResponse.setTotalProjectCost(totalProjectConstCal);

				estimatedCostTabDetailsList.add(estimatedCostTabDetailsResponse);
				totalProjectCost = totalProjectCost + estimatedCostTabDetailsResponse.getTotalProjectCost();
				subTotalCost = subTotalCost + estimatedCostTabDetailsResponse.getTotalCostCalculated();
				subTotalProjectCost = subTotalProjectCost + estimatedCostTabDetailsResponse.getTotalProjectCost();
			}
			estimatedCostAnnexureResponse.setEstimatedCostTabDetailsDTOS(estimatedCostTabDetailsList);

			DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotal = new DppAnnualPhasingCostTotalDTO();
			if (estimatedCostAnnexureDTO.getDppAnnualPhasingCostTotal() != null) {
				BeanUtils.copyProperties(estimatedCostAnnexureDTO.getDppAnnualPhasingCostTotal(),
						dppAnnualPhasingCostTotal);
				dppAnnualPhasingCostTotal.setTotalAmount(subTotalCost);
				dppAnnualPhasingCostTotal.setTotalProjectCost(subTotalProjectCost);
			}
			estimatedCostAnnexureResponse.setDppAnnualPhasingCostTotal(dppAnnualPhasingCostTotal);
			estimatedCostAnnexureList.add(estimatedCostAnnexureResponse);
		}

		response.setDppAnnualPhasingCostDTOList(estimatedCostAnnexureList);

		DppAnnualPhasingCostTotalDTO grandTotalResponses = new DppAnnualPhasingCostTotalDTO();
		BeanUtils.copyProperties(detailsEstimatedCostResponse.getGrandTotalResponses(), grandTotalResponses);
		grandTotalResponses.setTotalAmount(totalCost);
		grandTotalResponses.setTotalProjectCost(totalProjectCost);
		response.setGrandTotalResponses(grandTotalResponses);
		return response;

	}

	public EstimatedCostAnnexureDTO groupByEconomicCodeAndSubTotal(EstimatedCostAnnexureDTO estimatedCostAnnexureDTO) {

		if (estimatedCostAnnexureDTO == null) {
			return null;
		}

		Map<Long, List<EstimatedCostTabDetailsDTO>> group = estimatedCostAnnexureDTO.getEstimatedCostTabDetailsDTOS()
				.stream().collect(Collectors.groupingBy(g -> g.getEconomicCode().getId(), LinkedHashMap::new,
						Collectors.toList()));
		estimatedCostAnnexureDTO.setGroup(group);

		for (Map.Entry<Long, List<EstimatedCostTabDetailsDTO>> entry : group.entrySet()) {

			entry.getValue().get(0).setSubUnitCost(entry.getValue().stream().mapToDouble(m -> m.getUnitCost()).sum());
			entry.getValue().get(0).setSubQty(entry.getValue().stream().mapToDouble(m -> m.getQty()).sum());
			entry.getValue().get(0)
					.setSubTotalAmount(entry.getValue().stream().mapToDouble(m -> m.getTotalAmount()).sum());
			entry.getValue().get(0).setSubGobAmount(entry.getValue().stream().mapToDouble(m -> m.getGobAmount()).sum());
			entry.getValue().get(0)
					.setSubGobFeAmount(entry.getValue().stream().mapToDouble(m -> m.getGobFeAmount()).sum());
			entry.getValue().get(0)
					.setSubGobThruAmount(entry.getValue().stream().mapToDouble(m -> m.getGobThruAmount()).sum());
			entry.getValue().get(0)
					.setSubSpAcAmount(entry.getValue().stream().mapToDouble(m -> m.getSpAcAmount()).sum());
			entry.getValue().get(0)
					.setSubThruPdAmount(entry.getValue().stream().mapToDouble(m -> m.getThruPdAmount()).sum());
			entry.getValue().get(0)
					.setSubThruDpAmount(entry.getValue().stream().mapToDouble(m -> m.getThruDpAmount()).sum());
			entry.getValue().get(0)
					.setSubOwnFundAmount(entry.getValue().stream().mapToDouble(m -> m.getOwnFundAmount()).sum());
			entry.getValue().get(0)
					.setSubOwnFundFeAmount(entry.getValue().stream().mapToDouble(m -> m.getOwnFundFeAmount()).sum());
			entry.getValue().get(0)
					.setSubOtherAmount(entry.getValue().stream().mapToDouble(m -> m.getOtherAmount()).sum());
			entry.getValue().get(0)
					.setSubOtherFeAmount(entry.getValue().stream().mapToDouble(m -> m.getOtherFeAmount()).sum());
			entry.getValue().get(0).setSubTotalCostCalculated(
					entry.getValue().stream().mapToDouble(m -> m.getTotalCostCalculated()).sum());
			entry.getValue().get(0)
					.setSubTotalProjectCost(entry.getValue().stream().mapToDouble(m -> m.getTotalProjectCost()).sum());

		}
		return estimatedCostAnnexureDTO;
	};



	/**
	 * Get Grand Total By RDPP Master Id
	 *
	 * @param rdppMasterId
	 * @return
	 */
	@Override
	public ResponseEntity<GrandTotalDifferenceResponse> getGrandTotalByMasterId(Long rdppMasterId) {
		GrandTotalDifferenceResponse grandTotalDifferenceResponse = new GrandTotalDifferenceResponse();
		ProjectConceptIdAndComponentNameRequest projectConceptIdAndComponentNameRequest = new ProjectConceptIdAndComponentNameRequest();

		Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findById(rdppMasterId);
		ResponseEntity<List<GrandTotalResponse>> refGrandTotalRes = null;
		if(dppObjectiveCost.isPresent()){
			if(dppObjectiveCost.get().getRevisedVersion().equals("1st Revised")){
				refGrandTotalRes = ppsDppTappClientService.getGrandTotalByProjectConceptId(dppObjectiveCost.get().getProjectConceptMasterId());
				grandTotalDifferenceResponse.setReferenceGrandTotal(refGrandTotalRes.getBody());

				projectConceptIdAndComponentNameRequest.setProjectConceptId(dppObjectiveCost.get().getProjectConceptMasterId());
				projectConceptIdAndComponentNameRequest.setComponentName("Revenue_Component");
				ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseRevenueRes = ppsDppTappClientService.getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
				grandTotalDifferenceResponse.setReferenceItemWiseRevenue(itemWiseRevenueRes.getBody());

				projectConceptIdAndComponentNameRequest.setComponentName("Capital_Component");
				ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseCapitalRes = ppsDppTappClientService.getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
				grandTotalDifferenceResponse.setReferenceItemWiseCapital(itemWiseCapitalRes.getBody());

			}else {
				refGrandTotalRes = getGrandTotalByRdppMasterId(dppObjectiveCost.get().getReferenceId());
				grandTotalDifferenceResponse.setReferenceGrandTotal(refGrandTotalRes.getBody());

				projectConceptIdAndComponentNameRequest.setRdppMasterId(dppObjectiveCost.get().getReferenceId());
				projectConceptIdAndComponentNameRequest.setComponentName("Revenue_Component");
				ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseRevenueRes = getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
				grandTotalDifferenceResponse.setReferenceItemWiseRevenue(itemWiseRevenueRes.getBody());

				projectConceptIdAndComponentNameRequest.setComponentName("Capital_Component");
				ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseCapitalRes = getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
				grandTotalDifferenceResponse.setReferenceItemWiseCapital(itemWiseCapitalRes.getBody());
			}
		}

		ResponseEntity<List<GrandTotalResponse>> currentGrandTotalRes = getGrandTotalByRdppMasterId(rdppMasterId);
		grandTotalDifferenceResponse.setCurrentGrandTotal(currentGrandTotalRes.getBody());

		projectConceptIdAndComponentNameRequest.setRdppMasterId(rdppMasterId);
		projectConceptIdAndComponentNameRequest.setComponentName("Revenue_Component");
		ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseRevenueRes = getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
		grandTotalDifferenceResponse.setCurrentItemWiseRevenue(itemWiseRevenueRes.getBody());

		projectConceptIdAndComponentNameRequest.setComponentName("Capital_Component");
		ResponseEntity<DppAnnualPhasingCostWithChildResponse> itemWiseCapitalsRes = getByProjectConceptIdAndComponentName(projectConceptIdAndComponentNameRequest);
		grandTotalDifferenceResponse.setCurrentItemWiseCapital(itemWiseCapitalsRes.getBody());

		return new ResponseEntity<>(grandTotalDifferenceResponse, HttpStatus.OK);
	}


}
