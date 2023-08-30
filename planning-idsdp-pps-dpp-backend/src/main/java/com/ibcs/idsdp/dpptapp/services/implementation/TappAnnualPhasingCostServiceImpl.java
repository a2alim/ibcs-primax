package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.HelperComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCostTotal;
import com.ibcs.idsdp.dpptapp.model.domain.TappFiscalYear;
import com.ibcs.idsdp.dpptapp.model.repositories.TappAnnualPhasingCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappAnnualPhasingCostTabDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappAnnualPhasingCostTotalRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappFiscalYearRepository;
import com.ibcs.idsdp.dpptapp.services.TappAnnualPhasingCostService;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectConceptIdAndComponentNameRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TappAnnualPhasingCostWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.groupingBy;

@Slf4j
@Service
public class TappAnnualPhasingCostServiceImpl extends BaseService<TappAnnualPhasingCost, TappAnnualPhasingCostDTO>
		implements TappAnnualPhasingCostService {

	private final TappAnnualPhasingCostRepository repository;
	private final TappAnnualPhasingCostTabDetailsServiceImp tappAnnualPhasingCostTabDetailsServiceImp;
	private final TappAnnualPhasingCostTabDetailsRepository tappAnnualPhasingCostTabDetailsRepository;
	private final TappAnnualPhasingCostTotalServiceImp tappAnnualPhasingCostTotalServiceImp;
	private final TappAnnualPhasingCostTotalRepository tappAnnualPhasingCostTotalRepository;
	private final TappFiscalYearServiceImp tappFiscalYearServiceImp;
	private final TappFiscalYearRepository tappFiscalYearRepository;
	private final HelperComponent helperComponent;
	private final ConfigurationClientService configurationClientService;

	protected TappAnnualPhasingCostServiceImpl(TappAnnualPhasingCostRepository repository,
			TappAnnualPhasingCostTabDetailsServiceImp tappAnnualPhasingCostTabDetailsServiceImp,
			TappAnnualPhasingCostTabDetailsRepository tappAnnualPhasingCostTabDetailsRepository,
			TappAnnualPhasingCostTotalServiceImp tappAnnualPhasingCostTotalServiceImp,
			TappAnnualPhasingCostTotalRepository tappAnnualPhasingCostTotalRepository,
			TappFiscalYearServiceImp tappFiscalYearServiceImp, TappFiscalYearRepository tappFiscalYearRepository,
			HelperComponent helperComponent, ConfigurationClientService configurationClientService) {
		super(repository);
		this.repository = repository;
		this.tappAnnualPhasingCostTabDetailsServiceImp = tappAnnualPhasingCostTabDetailsServiceImp;
		this.tappAnnualPhasingCostTabDetailsRepository = tappAnnualPhasingCostTabDetailsRepository;
		this.tappAnnualPhasingCostTotalServiceImp = tappAnnualPhasingCostTotalServiceImp;
		this.tappAnnualPhasingCostTotalRepository = tappAnnualPhasingCostTotalRepository;
		this.tappFiscalYearServiceImp = tappFiscalYearServiceImp;
		this.tappFiscalYearRepository = tappFiscalYearRepository;
		this.helperComponent = helperComponent;
		this.configurationClientService = configurationClientService;
	}

	/**
	 * Convert to entry from dto for create
	 *
	 * @param tappAnnualPhasingCostDTO
	 * @return
	 */
	@Override
	protected TappAnnualPhasingCost convertForCreate(TappAnnualPhasingCostDTO tappAnnualPhasingCostDTO) {
		TappAnnualPhasingCost tappAnnualPhasingCost = super.convertForCreate(tappAnnualPhasingCostDTO);
		if (!tappAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			tappAnnualPhasingCost.setTappAnnualPhasingCostTotal(new ModelMapper().map(
					tappAnnualPhasingCostTotalServiceImp
							.create(tappAnnualPhasingCostDTO.getTappAnnualPhasingCostTotal()),
					TappAnnualPhasingCostTotal.class));
		}
		return tappAnnualPhasingCost;
	}

	/**
	 * Convert to entry from dto for update
	 *
	 * @param tappAnnualPhasingCostDTO
	 * @param tappAnnualPhasingCost
	 */
	@Override
	protected void convertForUpdate(TappAnnualPhasingCostDTO tappAnnualPhasingCostDTO,
			TappAnnualPhasingCost tappAnnualPhasingCost) {
		if (!tappAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			TappAnnualPhasingCostTotal tappAnnualPhasingCostTotal = tappAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(tappAnnualPhasingCost.getTappAnnualPhasingCostTotal().getId(), false).get();
			tappAnnualPhasingCostDTO.getTappAnnualPhasingCostTotal().setUuid(tappAnnualPhasingCostTotal.getUuid());
			tappAnnualPhasingCost.setTappAnnualPhasingCostTotal(new ModelMapper().map(
					tappAnnualPhasingCostTotalServiceImp
							.update(tappAnnualPhasingCostDTO.getTappAnnualPhasingCostTotal()),
					TappAnnualPhasingCostTotal.class));
		}
		super.convertForUpdate(tappAnnualPhasingCostDTO, tappAnnualPhasingCost);
	}

	/**
	 * Save DppAnnualPhasingCost With its child
	 *
	 * @param tappAnnualPhasingCostDTO
	 * @return
	 */
	@Override
	public ResponseEntity<TappAnnualPhasingCostWithChildResponse> saveWithChild(
			TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostDTO) {
		TappAnnualPhasingCostWithChildRequest response = new ModelMapper().map(create(tappAnnualPhasingCostDTO),
				TappAnnualPhasingCostWithChildRequest.class);

		List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetailsDTOs = new ArrayList<>();
		List<TappAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = createChild(tappAnnualPhasingCostDTO,
				tappAnnualPhasingCostTabDetailsDTOs, response);

		response.setTappAnnualPhasingCostTabDetails(tappAnnualPhasingCostTabDetailsDTOs);
		response.setFiscalYearsWiseTotal(fiscalYearsWiseTotal);
		return getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {
			{
				setProjectConceptId(response.getProjectConceptId());
				setComponentName(response.getComponentName().toString());
			}
		});
	}

	/**
	 * Update DppAnnualPhasingCost with child
	 *
	 * @param tappAnnualPhasingCostWithChildRequest
	 * @return
	 */
	@Override
	public ResponseEntity<TappAnnualPhasingCostWithChildResponse> updateWithChild(
			TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostWithChildRequest) {
		TappAnnualPhasingCostWithChildRequest response = new ModelMapper()
				.map(update(tappAnnualPhasingCostWithChildRequest), TappAnnualPhasingCostWithChildRequest.class);

		deleteByTappAnnualPhasingCostId(response);

		List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetailsDTOs = new ArrayList<>();
		List<TappAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = createChild(tappAnnualPhasingCostWithChildRequest,
				tappAnnualPhasingCostTabDetailsDTOs, response);

		response.setTappAnnualPhasingCostTabDetails(tappAnnualPhasingCostTabDetailsDTOs);
		response.setFiscalYearsWiseTotal(fiscalYearsWiseTotal);

		return getByProjectConceptIdAndComponentName(new ProjectConceptIdAndComponentNameRequest() {
			{
				setProjectConceptId(response.getProjectConceptId());
				setComponentName(response.getComponentName().toString());
			}
		});
	}

	/**
	 * create all child
	 *
	 * @param tappAnnualPhasingCostDTO
	 * @param tappAnnualPhasingCostTabDetailsDTOs
	 * @param annalPhasingCost
	 * @return
	 */
	private List<TappAnnualPhasingCostTotalDTO> createChild(
			TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostDTO,
			List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetailsDTOs,
			TappAnnualPhasingCostWithChildRequest annalPhasingCost) {
		List<TappAnnualPhasingCostTotalDTO> fiscalYearsWiseTotal = new ArrayList<>();
		if (!tappAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
			tappAnnualPhasingCostDTO.getFiscalYearsWiseTotal().stream()
					.forEach(fywc -> fiscalYearsWiseTotal.add(tappAnnualPhasingCostTotalServiceImp.create(fywc)));
		}
		List<DppAnnualPhasing> tappAnnualPhasings = Arrays.stream(DppAnnualPhasing.values()).filter(
				f -> (!f.equals(annalPhasingCost.getComponentName()) && !f.equals(DppAnnualPhasing.Grand_Total)))
				.collect(Collectors.toList());

		List<TappFiscalYearDTO> list1 = tappFiscalYearServiceImp.getByProjectConceptIdAndComponentName(
				annalPhasingCost.getProjectConceptId(), tappAnnualPhasings.get(0));
		List<TappFiscalYearDTO> list2 = tappFiscalYearServiceImp.getByProjectConceptIdAndComponentName(
				annalPhasingCost.getProjectConceptId(), tappAnnualPhasings.get(1));
		int list1TabDetailsSize = list1.isEmpty() ? 0
				: ((int) list1.stream().filter(f -> f.getFiscalYear().equals(list1.get(0).getFiscalYear())).count());
		int list2TabDetailsSize = list2.isEmpty() ? 0
				: ((int) list2.stream().filter(f -> f.getFiscalYear().equals(list2.get(0).getFiscalYear())).count());

		AtomicInteger tabCount = new AtomicInteger();
		tappAnnualPhasingCostDTO.getTappAnnualPhasingCostTabDetails().forEach(e -> {
			validationCheck(annalPhasingCost, e);
			e.setTappAnnualPhasingCostId(annalPhasingCost.getId());
			TappAnnualPhasingCostTabDetailsDTO dto = tappAnnualPhasingCostTabDetailsServiceImp.create(e);
			List<TappFiscalYearDTO> tappFiscalYearDTOList = new ArrayList<>();
			e.getFiscalYears().forEach(fy -> {
				fy.setTappAnnualPhasingCostTabDetailsId(dto.getId());
				if (!tappAnnualPhasingCostDTO.getComponentName().equals(DppAnnualPhasing.Contingency)) {
					fy.setTappAnnualPhasingCostTotalDTO(fiscalYearsWiseTotal.stream()
							.filter(f -> f.getFiscalYear().equals(fy.getFiscalYear())).findFirst().get());
				}
				tappFiscalYearDTOList.add(tappFiscalYearServiceImp.create(fy));

				if (!list1.isEmpty() && list1.stream().noneMatch(a -> a.getFiscalYear().equals(fy.getFiscalYear()))
						&& (tabCount.get() < list1TabDetailsSize)) {
					createNonExistFiscalYear(list1.get(0).getTappAnnualPhasingCostTabDetailsId(), fy.getFiscalYear(),
							tappAnnualPhasingCostDTO.getProjectConceptId(), tappAnnualPhasings.get(0));
				}

				if (!list2.isEmpty() && list2.stream().noneMatch(a -> a.getFiscalYear().equals(fy.getFiscalYear()))
						&& (tabCount.get() < list2TabDetailsSize)) {
					createNonExistFiscalYear(list2.get(0).getTappAnnualPhasingCostTabDetailsId(), fy.getFiscalYear(),
							tappAnnualPhasingCostDTO.getProjectConceptId(), tappAnnualPhasings.get(1));
				}
			});
			dto.setFiscalYears(tappFiscalYearDTOList);
			tappAnnualPhasingCostTabDetailsDTOs.add(dto);
			tabCount.addAndGet(1);
		});

		deleteWhichFiscalYearIsNotExist(tappAnnualPhasingCostDTO, annalPhasingCost, tappAnnualPhasings);

		return fiscalYearsWiseTotal;
	}

	/**
	 * create if fiscal is not exist in component
	 *
	 * @param tappAnnualPhasingCostTabDetailsId
	 * @param fiscalYear
	 */
	private void createNonExistFiscalYear(Long tappAnnualPhasingCostTabDetailsId, String fiscalYear, Long conceptId,
			DppAnnualPhasing dppAnnualPhasing) {
		TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotalDTO = new TappAnnualPhasingCostTotalDTO();
		if (!dppAnnualPhasing.equals(DppAnnualPhasing.Contingency)) {
			TappAnnualPhasingCostTotalDTO existTappAnnualPhasingCostTotalDTO = tappAnnualPhasingCostTotalServiceImp
					.getByProjectConceptIdAndComponentNameAndFiscalYear(conceptId, dppAnnualPhasing, fiscalYear);
			if (existTappAnnualPhasingCostTotalDTO != null) {
				tappAnnualPhasingCostTotalDTO = existTappAnnualPhasingCostTotalDTO;
			} else {
				tappAnnualPhasingCostTotalDTO.setFiscalYear(fiscalYear);
				tappAnnualPhasingCostTotalDTO.setTotalAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setGobAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setGobFeAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setGobThruAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setSpAcAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setThruPdAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setThruDpAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setOwnFundAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setOwnFundFeAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setOtherAmount(0.0);
				tappAnnualPhasingCostTotalDTO.setOtherFeAmount(0.0);
				tappAnnualPhasingCostTotalDTO = tappAnnualPhasingCostTotalServiceImp
						.create(tappAnnualPhasingCostTotalDTO);
			}
		} else {
			tappAnnualPhasingCostTotalDTO = null;
		}

		System.out.println(fiscalYear);

		TappFiscalYearDTO dppFiscalYearDTO = new TappFiscalYearDTO();
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
		dppFiscalYearDTO.setTappAnnualPhasingCostTabDetailsId(tappAnnualPhasingCostTabDetailsId);
		dppFiscalYearDTO.setTappAnnualPhasingCostTotalDTO(tappAnnualPhasingCostTotalDTO);
		tappFiscalYearServiceImp.create(dppFiscalYearDTO);
	}

	private void deleteWhichFiscalYearIsNotExist(TappAnnualPhasingCostWithChildRequest tappAnnualPhasingCostDTO,
			TappAnnualPhasingCostWithChildRequest annalPhasingCost, List<DppAnnualPhasing> tappAnnualPhasings) {
		Map<String, List<TappFiscalYearDTO>> listMap1 = tappFiscalYearServiceImp
				.getByProjectConceptIdAndComponentName(annalPhasingCost.getProjectConceptId(),
						tappAnnualPhasings.get(0))
				.stream().collect(groupingBy(TappFiscalYearDTO::getFiscalYear));
		Map<String, List<TappFiscalYearDTO>> listMap2 = tappFiscalYearServiceImp
				.getByProjectConceptIdAndComponentName(annalPhasingCost.getProjectConceptId(),
						tappAnnualPhasings.get(1))
				.stream().collect(groupingBy(TappFiscalYearDTO::getFiscalYear));

		List<TappFiscalYearDTO> fiscalYearDTOS = tappAnnualPhasingCostDTO.getTappAnnualPhasingCostTabDetails().get(0)
				.getFiscalYears();
		listMap1.forEach((k, v) -> {
			AtomicReference<TappAnnualPhasingCostTotalDTO> annualPhasingCostTotalDTO = new AtomicReference<>();
			v.forEach(e -> {
				if (fiscalYearDTOS.stream().noneMatch(f -> f.getFiscalYear().equals(e.getFiscalYear()))) {
					annualPhasingCostTotalDTO.set(e.getTappAnnualPhasingCostTotalDTO());
					tappFiscalYearRepository.deleteById(e.getId());
					subtractFromTabDetails(e);
				}
			});
			if (annualPhasingCostTotalDTO.get() != null)
				tappAnnualPhasingCostTotalRepository.deleteById(annualPhasingCostTotalDTO.get().getId());
		});
		listMap2.forEach((k, v) -> {
			AtomicReference<TappAnnualPhasingCostTotalDTO> annualPhasingCostTotalDTO = new AtomicReference<>();
			v.forEach(e -> {
				if (fiscalYearDTOS.stream().noneMatch(f -> f.getFiscalYear().equals(e.getFiscalYear()))) {
					annualPhasingCostTotalDTO.set(e.getTappAnnualPhasingCostTotalDTO());
					tappFiscalYearRepository.deleteById(e.getId());
					subtractFromTabDetails(e);
				}
			});
			if (annualPhasingCostTotalDTO.get() != null)
				tappAnnualPhasingCostTotalRepository.deleteById(annualPhasingCostTotalDTO.get().getId());
		});
	}

	/**
	 * Subtract amount if fiscal year deleted
	 * 
	 * @param e
	 */
	private void subtractFromTabDetails(TappFiscalYearDTO e) {
		TappAnnualPhasingCostTabDetailsDTO dto = tappAnnualPhasingCostTabDetailsServiceImp
				.getById(e.getTappAnnualPhasingCostTabDetailsId());
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
		tappAnnualPhasingCostTabDetailsServiceImp.update(dto);
		if (e.getTappAnnualPhasingCostTotalDTO() != null) {
			TappAnnualPhasingCostTotalDTO totalDTO = e.getTappAnnualPhasingCostTotalDTO();
			totalDTO.setTotalAmount(e.getTappAnnualPhasingCostTotalDTO().getTotalAmount() - e.getTotalAmount());
			totalDTO.setGobAmount(e.getTappAnnualPhasingCostTotalDTO().getGobAmount() - e.getGobAmount());
			totalDTO.setGobFeAmount(e.getTappAnnualPhasingCostTotalDTO().getGobFeAmount() - e.getGobFeAmount());
			totalDTO.setGobThruAmount(e.getTappAnnualPhasingCostTotalDTO().getGobThruAmount() - e.getGobThruAmount());
			totalDTO.setSpAcAmount(e.getTappAnnualPhasingCostTotalDTO().getSpAcAmount() - e.getSpAcAmount());
			totalDTO.setThruPdAmount(e.getTappAnnualPhasingCostTotalDTO().getThruPdAmount() - e.getThruPdAmount());
			totalDTO.setThruDpAmount(e.getTappAnnualPhasingCostTotalDTO().getThruDpAmount() - e.getThruDpAmount());
			totalDTO.setOwnFundAmount(e.getTappAnnualPhasingCostTotalDTO().getOwnFundAmount() - e.getOwnFundAmount());
			totalDTO.setOwnFundFeAmount(
					e.getTappAnnualPhasingCostTotalDTO().getOwnFundFeAmount() - e.getOwnFundFeAmount());
			totalDTO.setOtherAmount(e.getTappAnnualPhasingCostTotalDTO().getOtherAmount() - e.getOtherAmount());
			totalDTO.setOtherFeAmount(e.getTappAnnualPhasingCostTotalDTO().getOtherFeAmount() - e.getOtherFeAmount());
			tappAnnualPhasingCostTotalServiceImp.update(totalDTO);
		}
	}

	/**
	 * Validation check
	 *
	 * @param annalPhasingCost
	 * @param e
	 */
	private void validationCheck(TappAnnualPhasingCostWithChildRequest annalPhasingCost,
			TappAnnualPhasingCostTabDetailsDTO e) {
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
			if (e.getUnitId() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Unit Id can't be null");
			}
			if (e.getUnitCost() == null) {
				throw new ServiceExceptionHolder.InvalidRequestException("Unit Cost can't be null");
			}
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
	private void deleteByTappAnnualPhasingCostId(TappAnnualPhasingCostWithChildRequest response) {
		Set<Long> tappAnnualPhasingCostTotalIdSet = new HashSet<>();

		tappAnnualPhasingCostTabDetailsRepository.findByTappAnnualPhasingCostIdAndIsDeleted(response.getId(), false)
				.forEach(dacptd -> {
					tappFiscalYearRepository.findByTappAnnualPhasingCostTabDetailsIdAndIsDeleted(dacptd.getId(), false)
							.forEach(dppFiscalYear -> {
								if (!response.getComponentName().equals(DppAnnualPhasing.Contingency))
									tappAnnualPhasingCostTotalIdSet
											.add(dppFiscalYear.getTappAnnualPhasingCostTotal().getId());
								tappFiscalYearRepository.delete(dppFiscalYear);
							});
					tappAnnualPhasingCostTabDetailsRepository.delete(dacptd);
				});
		tappAnnualPhasingCostTotalIdSet.forEach(tappAnnualPhasingCostTotalRepository::deleteById);
	}

	/**
	 * Get DppAnnualPhasingCost by ProjectConceptId and ComponentName
	 *
	 * @param request
	 * @return
	 */
	@Override
	public ResponseEntity<TappAnnualPhasingCostWithChildResponse> getByProjectConceptIdAndComponentName(
			ProjectConceptIdAndComponentNameRequest request) {

		Optional<TappAnnualPhasingCost> tappAnnualPhasingOfCost = repository
				.findByProjectConceptIdAndComponentNameAndIsDeleted(request.getProjectConceptId(),
						DppAnnualPhasing.valueOf(request.getComponentName()), false);
		if (tappAnnualPhasingOfCost.isEmpty())
			return new ResponseEntity<>(null, HttpStatus.OK);
		TappAnnualPhasingCostWithChildResponse response = new ModelMapper().map(tappAnnualPhasingOfCost.get(),
				TappAnnualPhasingCostWithChildResponse.class);
		response.setTappAnnualPhasingCostTabDetails(
				tappAnnualPhasingCostTabDetailsServiceImp.getByTappAnnualPhasingCostId(response.getId()));

		setTappAnnualPhasingCostChild(response);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Get DppAnnualPhasingCost for getting Fiscal Year
	 *
	 * @param projectConceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<FiscalYearResponse>> getByProjectConceptIdForGettingFiscalYear(Long projectConceptId) {
		List<TappFiscalYearDTO> list = tappFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
				DppAnnualPhasing.Revenue_Component);

		if (list.isEmpty()) {
			list = tappFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
					DppAnnualPhasing.Capital_Component);
			if (list.isEmpty()) {
				list = tappFiscalYearServiceImp.getByProjectConceptIdAndComponentName(projectConceptId,
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
	private void setTappAnnualPhasingCostChild(TappAnnualPhasingCostWithChildResponse response) {
		List<TappFiscalYearWiseData> list = new ArrayList<>();
		response.getTappAnnualPhasingCostTabDetails().forEach(e -> {
			List<TappFiscalYearDTO> fiscalYearDTOS = tappFiscalYearServiceImp
					.getByTappAnnualPhasingCostTabDetailsId(e.getId());
			fiscalYearDTOS.forEach(fyd -> {
				if (list.stream().anyMatch(a -> a.getFiscalYear().equals(fyd.getFiscalYear()))) {
					int index = IntStream.range(0, list.size())
							.filter(i -> list.get(i).getFiscalYear().equals(fyd.getFiscalYear())).findFirst()
							.orElse(-1);
					list.get(index).getValues().add(fyd);
				} else {
					List<TappFiscalYearDTO> l = new ArrayList<>();
					l.add(fyd);
					list.add(new TappFiscalYearWiseData() {
						{
							setLastYear(
									Integer.parseInt(fyd.getFiscalYear().substring(fyd.getFiscalYear().length() - 4)));
							setFiscalYear(fyd.getFiscalYear());
							setValues(l);
							setTappAnnualPhasingCostTotal(fyd.getTappAnnualPhasingCostTotalDTO());
						}
					});
				}
			});
		});

		List<TappFiscalYearWiseData> finalList = list.stream()
				.sorted(Comparator.comparing(TappFiscalYearWiseData::getLastYear)).collect(Collectors.toList());
		response.setFiscalYearWiseCost(finalList);
	}

	/**
	 * Get Grand total By Project Concept Id
	 *
	 * @param projectConceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<GrandTotalResponseTapp>> getGrandTotalByProjectConceptId(Long projectConceptId) {
		List<GrandTotalResponseTapp> response = new ArrayList<>();

		List<TappAnnualPhasingCostTotalDTO> revenuesTotal = tappAnnualPhasingCostTotalServiceImp
				.getByProjectConceptIdAndComponentName(projectConceptId, DppAnnualPhasing.Revenue_Component);
		List<TappAnnualPhasingCostTotalDTO> capitalTotal = tappAnnualPhasingCostTotalServiceImp
				.getByProjectConceptIdAndComponentName(projectConceptId, DppAnnualPhasing.Capital_Component);
		List<TappFiscalYear> contingency = tappFiscalYearRepository
				.getByProjectConceptIdAndComponentName(projectConceptId, DppAnnualPhasing.Contingency.ordinal());

		List<TappAnnualPhasingCostTotalDTO> contingencyTotal = contingency.stream()
				.sorted(Comparator.comparing(TappFiscalYear::getCreatedOn))
				.map(m -> new ModelMapper().map(m, TappAnnualPhasingCostTotalDTO.class)).collect(Collectors.toList());

		if (!revenuesTotal.isEmpty())
			addInResponse(response, revenuesTotal, DppAnnualPhasing.Revenue_Component);

		if (!capitalTotal.isEmpty())
			addInResponse(response, capitalTotal, DppAnnualPhasing.Capital_Component);

		if (!contingencyTotal.isEmpty())
			addInResponse(response, contingencyTotal, DppAnnualPhasing.Contingency);

		setGrandTotal(response);

		setRevenueAndCapitalAndContingencyAndGrandTotal(projectConceptId, response);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	/**
	 * Add Revenue/Capital/Contingency in Grand total response
	 *
	 * @param response
	 * @param total
	 * @param dppAnnualPhasing
	 */
	private void addInResponse(List<GrandTotalResponseTapp> response, List<TappAnnualPhasingCostTotalDTO> total,
			DppAnnualPhasing dppAnnualPhasing) {
		response.add(new GrandTotalResponseTapp() {
			{
				setComponentName(dppAnnualPhasing);
				setGrandTotal(total.stream().map(m -> new TappAnnualCostTotalWithFiscalYear() {
					{
						setFiscalYear(m.getFiscalYear());
						setTappAnnualPhasingCostTotal(m);
					}
				}).collect(Collectors.toList()));
			}
		});
	}

	/**
	 * Set Revenue, Capital, Contingency and Grand Total in grand total response
	 *
	 * @param projectConceptId
	 * @param response
	 */
	private void setRevenueAndCapitalAndContingencyAndGrandTotal(Long projectConceptId,
			List<GrandTotalResponseTapp> response) {
		Optional<TappAnnualPhasingCost> annualRevenuePhasingCost = repository
				.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId,
						DppAnnualPhasing.Revenue_Component, false);
		TappAnnualPhasingCostTotal tappAnnualPhasingCostTotalRevenue = null;
		if (annualRevenuePhasingCost.isPresent()) {
			tappAnnualPhasingCostTotalRevenue = tappAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(annualRevenuePhasingCost.get().getTappAnnualPhasingCostTotal().getId(), false)
					.get();
		}
		if (tappAnnualPhasingCostTotalRevenue != null) {
			TappAnnualPhasingCostTotalDTO finalDppAnnualPhasingCostTotal = new ModelMapper()
					.map(tappAnnualPhasingCostTotalRevenue, TappAnnualPhasingCostTotalDTO.class);
			// response.get(0).setTappAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
			Optional<GrandTotalResponseTapp> revenue = response.stream().filter(res -> res.getComponentName().toString().equals("Revenue_Component")).findAny();
			if (revenue.isPresent()) revenue.get().setTappAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
		}

		Optional<TappAnnualPhasingCost> annualCapitalPhasingCost = repository
				.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId,
						DppAnnualPhasing.Capital_Component, false);
		TappAnnualPhasingCostTotal tappAnnualPhasingCostTotalCapital = null;
		if (annualCapitalPhasingCost.isPresent()) {
			tappAnnualPhasingCostTotalCapital = tappAnnualPhasingCostTotalRepository
					.findByIdAndIsDeleted(annualCapitalPhasingCost.get().getTappAnnualPhasingCostTotal().getId(), false)
					.get();
		}
		if (tappAnnualPhasingCostTotalCapital != null) {
			TappAnnualPhasingCostTotalDTO finalDppAnnualPhasingCostTotal = new ModelMapper()
					.map(tappAnnualPhasingCostTotalCapital, TappAnnualPhasingCostTotalDTO.class);
			// response.get(1).setTappAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
			Optional<GrandTotalResponseTapp> capital = response.stream().filter(res -> res.getComponentName().toString().equals("Capital_Component")).findAny();
			if (capital.isPresent()) capital.get().setTappAnnualPhasingCostTotal(Collections.singletonList(finalDppAnnualPhasingCostTotal));
		}

		Optional<TappAnnualPhasingCost> annualContingencyPhasingCost = repository
				.findByProjectConceptIdAndComponentNameAndIsDeleted(projectConceptId, DppAnnualPhasing.Contingency,
						false);
		List<TappAnnualPhasingCostTotalDTO> contingencyList = new ArrayList<>();
		if (annualContingencyPhasingCost.isPresent()) {
			contingencyList = tappAnnualPhasingCostTabDetailsServiceImp
					.getByTappAnnualPhasingCostId(annualContingencyPhasingCost.get().getId()).stream()
					.sorted(Comparator.comparing(UuidIdHolderRequestBodyDTO::getId)).collect(Collectors.toList())
					.stream().map(m -> new ModelMapper().map(m, TappAnnualPhasingCostTotalDTO.class))
					.collect(Collectors.toList());
			// response.get(2).setTappAnnualPhasingCostTotal(contingencyList);
			Optional<GrandTotalResponseTapp> contingency = response.stream().filter(res -> res.getComponentName().toString().equals("Contingency")).findAny();
			if (contingency.isPresent()) contingency.get().setTappAnnualPhasingCostTotal(contingencyList);
		}

		List<TappAnnualPhasingCostTotalDTO> grandList = new ArrayList<>();
		response.forEach(e -> {
			if (e.getTappAnnualPhasingCostTotal() != null && !e.getTappAnnualPhasingCostTotal().isEmpty())
				grandList.addAll(e.getTappAnnualPhasingCostTotal());
		});

		TappAnnualPhasingCostTotalDTO total = new TappAnnualPhasingCostTotalDTO();
		total.setTotalAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getTotalAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getGobAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobFeAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getGobFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setGobThruAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getGobThruAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setSpAcAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getSpAcAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setThruPdAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getThruPdAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setThruDpAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getThruDpAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOwnFundAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getOwnFundAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOwnFundFeAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getOwnFundFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOtherAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getOtherAmount)
				.mapToDouble(Double::doubleValue).sum());
		total.setOtherFeAmount(grandList.stream().map(TappAnnualPhasingCostTotalDTO::getOtherFeAmount)
				.mapToDouble(Double::doubleValue).sum());
		response.get(response.size() - 1).setTappAnnualPhasingCostTotal(Collections.singletonList(total));
	}

	/**
	 * Set sum of revenue, capital and contingency total
	 *
	 * @param response
	 */
	private void setGrandTotal(List<GrandTotalResponseTapp> response) {
		List<TappAnnualCostTotalWithFiscalYear> total = new ArrayList<>();

		List<TappAnnualCostTotalWithFiscalYear> list = new ArrayList<>();
		response.forEach(e -> list.addAll(e.getGrandTotal()));

		Map<String, List<TappAnnualCostTotalWithFiscalYear>> mapList = list.stream()
				.collect(groupingBy(TappAnnualCostTotalWithFiscalYear::getFiscalYear));

		mapList.forEach((k, v) -> {
			TappAnnualPhasingCostTotalDTO dto = new TappAnnualPhasingCostTotalDTO();
			dto.setTotalAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getTotalAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getGobAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobFeAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getGobFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setGobThruAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getGobThruAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setSpAcAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getSpAcAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setThruPdAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getThruPdAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setThruDpAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getThruDpAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOwnFundAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getOwnFundAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOwnFundFeAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getOwnFundFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOtherAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getOtherAmount())
					.mapToDouble(Double::doubleValue).sum());
			dto.setOtherFeAmount(v.stream().map(m -> m.getTappAnnualPhasingCostTotal().getOtherFeAmount())
					.mapToDouble(Double::doubleValue).sum());
			total.add(new TappAnnualCostTotalWithFiscalYear() {
				{
					setFiscalYear(k);
					setTappAnnualPhasingCostTotal(dto);
				}
			});
		});

		List<TappAnnualCostTotalWithFiscalYear> finalList = new ArrayList<>();
		if (!total.isEmpty()) {
			finalList = total.stream()
					.sorted(Comparator.comparing(
							c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
					.collect(Collectors.toList());
		}

		List<TappAnnualCostTotalWithFiscalYear> finalList1 = finalList;
		response.add(new GrandTotalResponseTapp() {
			{
				setComponentName(DppAnnualPhasing.Grand_Total);
				setGrandTotal(finalList1);
			}
		});

	}

	/**
	 * For Save Annual Phasing
	 *
	 * @return ResponseEntity<IdentityResponse>
	 */
	@Override
	public ResponseEntity<IdentityResponse> saveAnnualPhasing(TappAnnualPhasingCostDTO dppAnnualPhasingCostDTO) {
//        List<DppAnnualPhasingCostTabDetails> dppAnnualPhasingCostTabDetailsList = new ArrayList<>();
//
//        for(DppAnnualPhasingCostTabDetailsDTO dppAnnualPhasingCostTabDetailsDTO :
//                dppAnnualPhasingCostDTO.getTabDetails())
//        {
//            List<DppFiscalYear> dppFiscalYears = new ArrayList<>();
//
//            for(DppFiscalYearDTO dppFiscalYearDTO : dppAnnualPhasingCostTabDetailsDTO.getFiscalYears())
//            {
//                DppFiscalYear dppFiscalYear = new DppFiscalYear();
//
//                dppFiscalYear.setFiscalYear(dppFiscalYearDTO.getFiscalYear());
//
//                dppFiscalYear.setTotalAmount(dppFiscalYearDTO.getTotalCost());
//                dppFiscalYear.setGobFeAmount(dppFiscalYearDTO.getGobFe());
//                dppFiscalYear.setGobThruAmount(dppFiscalYearDTO.getGobThru());
//                dppFiscalYear.setOwnFundFeAmount(dppFiscalYearDTO.getOwnFundFe());
//                dppFiscalYear.setSpAcAmount(dppFiscalYearDTO.getSpAc());
//                dppFiscalYear.setThruDpAmount(dppFiscalYearDTO.getThruDp());
//
//
//                DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal = new DppAnnualPhasingCostTotal();
//                BeanUtils.copyProperties(dppFiscalYearDTO.getDppTotalAnnualPhasingCost(), dppAnnualPhasingCostTotal);
//                dppFiscalYear.setDppAnnualPhasingCostTotal(dppAnnualPhasingCostTotal);
//
//
//                dppFiscalYear.setThruPdAmount(dppFiscalYearDTO.getThruPd());
//                dppFiscalYears.add(dppFiscalYear);
//            }
//            DppAnnualPhasingCostTabDetails dppAnnualPhasingCostTabDetails
//                    = new DppAnnualPhasingCostTabDetails();
//            dppAnnualPhasingCostTabDetails.setDescription(dppAnnualPhasingCostTabDetailsDTO.getDescription());
//            dppAnnualPhasingCostTabDetails.setEconomicCodeId(dppAnnualPhasingCostTabDetailsDTO.getSubEconomicCodeId());
//            dppAnnualPhasingCostTabDetails.setDppFiscalYears(dppFiscalYears);
//            dppAnnualPhasingCostTabDetails.setTotalAmount(dppAnnualPhasingCostTabDetailsDTO.getTotalCost());
//            dppAnnualPhasingCostTabDetails.setGobFeAmount(dppAnnualPhasingCostTabDetailsDTO.getGobFe());
//            dppAnnualPhasingCostTabDetails.setSubEconomicCodeId(dppAnnualPhasingCostTabDetailsDTO.getSubEconomicCodeId());
//            dppAnnualPhasingCostTabDetails.setGobThruAmount(dppAnnualPhasingCostTabDetailsDTO.getGobThru());
//            dppAnnualPhasingCostTabDetails.setUnitCost(dppAnnualPhasingCostTabDetailsDTO.getUnitCost());
//            dppAnnualPhasingCostTabDetails.setOwnFundFeAmount(dppAnnualPhasingCostTabDetailsDTO.getOwnFundFe());
//            dppAnnualPhasingCostTabDetails.setQty(dppAnnualPhasingCostTabDetailsDTO.getQty());
//            dppAnnualPhasingCostTabDetails.setSpAcAmount(dppAnnualPhasingCostTabDetailsDTO.getSpAc());
//            dppAnnualPhasingCostTabDetails.setThruDpAmount(dppAnnualPhasingCostTabDetailsDTO.getThruDp());
//            dppAnnualPhasingCostTabDetails.setThruPdAmount(dppAnnualPhasingCostTabDetailsDTO.getThruPd());
//            dppAnnualPhasingCostTabDetailsList.add(dppAnnualPhasingCostTabDetails);
//        }
//
//        Optional<DppAnnualPhasingOfCost> dppAnnualPhasingOfCostOptional = Optional.empty();
//
//        if (dppAnnualPhasingCostDTO.getUuid() != null) {
//            dppAnnualPhasingOfCostOptional = dppAnnualPhasingCostRepository.findByUuidAndIsDeleted(dppAnnualPhasingCostDTO.getUuid(), false);
//        }
//        boolean isSetUuid = dppAnnualPhasingOfCostOptional.isPresent();
//        DppAnnualPhasingOfCost dppAnnualPhasingOfCost = dppAnnualPhasingOfCostOptional.orElseGet(DppAnnualPhasingOfCost::new);
//        if(!isSetUuid) {
//            String uuid = idGeneratorComponent.generateUUID();
//            dppAnnualPhasingOfCost.setUuid(uuid);
//        }
//        dppAnnualPhasingOfCost.setIsDeleted(false);
//        dppAnnualPhasingOfCost.setProjectConceptId(dppAnnualPhasingCostDTO.getProjectConceptId());
//        dppAnnualPhasingOfCost.setComponentName(dppAnnualPhasingCostDTO.getTabName());
//
//        if(dppAnnualPhasingOfCost.getDppAnnualPhasingCostTabDetails() != null) {
//            dppAnnualPhasingOfCost.getDppAnnualPhasingCostTabDetails().clear();
//        }
//        dppAnnualPhasingOfCost.setDppAnnualPhasingCostTabDetails(dppAnnualPhasingCostTabDetailsList);
//
//
//        DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal = new DppAnnualPhasingCostTotal();
//        BeanUtils.copyProperties(dppAnnualPhasingCostDTO.getDppTotalAnnualPhasingCost(), dppAnnualPhasingCostTotal);
//        dppAnnualPhasingOfCost.setDppAnnualPhasingCostTotal(dppAnnualPhasingCostTotal);
//
//        dppAnnualPhasingCostRepository.save(dppAnnualPhasingOfCost);
//        System.out.println(dppAnnualPhasingOfCost.getDppAnnualPhasingCostTotal());
////        System.out.println(dppAnnualPhasingCostRequestList.get(0));
////        for (DppAnnualPhasingCostRequest dppAnnualPhasingCostRequest : dppAnnualPhasingCostRequestList) {
////
////            DppAnnualPhasingOfCost dppAnnualPhasingOfCost = new DppAnnualPhasingOfCost();
////            dppAnnualPhasingOfCost.setCreatedBy("admin");
////            dppAnnualPhasingOfCost.setIsDeleted(true);
////            dppAnnualPhasingOfCost.setCreatedOn(LocalDate.now());
////            dppAnnualPhasingOfCost.setFiscalYears(dppAnnualPhasingCostRequest.getFiscalYears());
////            BeanUtils.copyProperties(dppAnnualPhasingCostRequest, dppAnnualPhasingOfCost);
////            dppAnnualPhasingCostRepository.save(dppAnnualPhasingOfCost);
////        }

		return new ResponseEntity(new IdentityResponse("Save Successfully"), HttpStatus.OK);
	}

	/**
	 * FOr Get Annual Phasing
	 *
	 * @return List<DppAnnualPhasingCost>
	 */
	@Override
	public ResponseEntity<List<TappAnnualPhasingCost>> getAnnualPhasing() {
		return new ResponseEntity(repository.findAll(), HttpStatus.OK);
	}

	/**
	 * For Get Grand Total Annual Phasing By Id
	 *
	 * @param conceptId
	 * @return DppGrandTotalResponse
	 */
	@Override
	public ResponseEntity<TappGrandTotalResponse> getGrandTotalAnnualPhasingById(String conceptId) {

		return new ResponseEntity(null, HttpStatus.OK);
	}

	/**
	 * get Contingency Logic
	 *
	 * @param conceptId
	 * @return
	 */
	@Override
	public ResponseEntity<List<TappContingencyResponse>> getContingency(String conceptId) {

		return new ResponseEntity<>(null, HttpStatus.OK);
	}

	/**
	 * Get all by Project Concept ID
	 *
	 * @param projectConceptUuid
	 * @return
	 */
	@Override
	public List<TappAnnualPhasingCost> getAllByPCUuid(String projectConceptUuid) {
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
	public TappAnnualPhasingCost getAnnualPhasingCostByPCUuidAndComponentType(String projectConceptUuid, String type) {
		try {
			DppAnnualPhasing dppAnnualPhasing = DppAnnualPhasing.valueOf(type);
			Optional<TappAnnualPhasingCost> tappAnnualPhasingOfCostOptional = repository
					.findByProjectConceptUuidAndIsDeletedAndComponentName(projectConceptUuid, false, dppAnnualPhasing);
			TappAnnualPhasingCost tappAnnualPhasingCost = null;
			if (tappAnnualPhasingOfCostOptional.isPresent()) {
				tappAnnualPhasingCost = tappAnnualPhasingOfCostOptional.get();
			}
			return tappAnnualPhasingCost;

		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	@Override
	public DetailsEstimatedCostResponse getDetailsEstimatedCost(String projectConceptUuid) {
		try {
			/* Find All DppAnnualPhasingCost by projectConceptUuid and isDelete */
			List<TappAnnualPhasingCost> tappAnnualPhasingCostList = repository
					.findAllByProjectConceptUuidAndIsDeleted(projectConceptUuid, false);

			/* Create new Details Estimated Cost Response */
			DetailsEstimatedCostResponse detailsEstimatedCostResponse = new DetailsEstimatedCostResponse();

			List<EstimatedCostAnnexureDTO> estimatedCostAnnexureDTOList = new ArrayList<>();

			/* Itearate Ecah value of tappAnnualPhasingCost */
			for (TappAnnualPhasingCost tappAnnualPhasingCost : tappAnnualPhasingCostList) {
				EstimatedCostAnnexureDTO estimatedCostAnnexureDTO = new EstimatedCostAnnexureDTO();
				estimatedCostAnnexureDTO.setId(tappAnnualPhasingCost.getId());
				estimatedCostAnnexureDTO.setComponentName(tappAnnualPhasingCost.getComponentName());
				estimatedCostAnnexureDTO.setUuid(tappAnnualPhasingCost.getUuid());
				estimatedCostAnnexureDTO.setProjectConceptUuid(tappAnnualPhasingCost.getProjectConceptUuid());
				estimatedCostAnnexureDTO.setProjectConceptId(tappAnnualPhasingCost.getProjectConceptId());

				/* Add Sub Total */
				DppAnnualPhasingCostTotalDTO dppAnnualPhasingCostTotalDTO = new DppAnnualPhasingCostTotalDTO();
				if (tappAnnualPhasingCost.getTappAnnualPhasingCostTotal() != null) {
					BeanUtils.copyProperties(tappAnnualPhasingCost.getTappAnnualPhasingCostTotal(),
							dppAnnualPhasingCostTotalDTO);
					estimatedCostAnnexureDTO.setDppAnnualPhasingCostTotal(dppAnnualPhasingCostTotalDTO);
				}

				/* Tab Details */
				List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetailsDTOS = tappAnnualPhasingCostTabDetailsServiceImp
						.getByTappAnnualPhasingCostId(tappAnnualPhasingCost.getId());
				List<EstimatedCostTabDetailsDTO> estimatedCostTabDetailsDTOS = getTabDetails(
						tappAnnualPhasingCostTabDetailsDTOS);
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
			List<TappAnnualPhasingCostTabDetailsDTO> tappAnnualPhasingCostTabDetailsDTOS) {

		Set<Long> subEconomicCodeSet = tappAnnualPhasingCostTabDetailsDTOS.stream()
				.map(TappAnnualPhasingCostTabDetailsDTO::getSubEconomicCodeId).collect(Collectors.toSet());
		Set<Long> unitTypeSet = tappAnnualPhasingCostTabDetailsDTOS.stream()
				.map(TappAnnualPhasingCostTabDetailsDTO::getUnitId).collect(Collectors.toSet());

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

		for (TappAnnualPhasingCostTabDetailsDTO e : tappAnnualPhasingCostTabDetailsDTOS) {
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
		double summationOfAllCost = detailsEstimatedCostResponse.getGrandTotalResponses().getTotalAmount();
		double totalCost = 0;
		double totalProjectCost = 0;

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

				Double totalProjectConstCal = estimatedCostTabDetailsDTO.getTotalCostCalculated() / summationOfAllCost * 100;

				totalProjectConstCal = totalProjectConstCal.isNaN() ? 0.00 : totalProjectConstCal;
				estimatedCostTabDetailsResponse.setTotalProjectCost(totalProjectConstCal);

				estimatedCostTabDetailsList.add(estimatedCostTabDetailsResponse);
				totalCost = totalCost + estimatedCostTabDetailsResponse.getTotalCostCalculated();
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

}
