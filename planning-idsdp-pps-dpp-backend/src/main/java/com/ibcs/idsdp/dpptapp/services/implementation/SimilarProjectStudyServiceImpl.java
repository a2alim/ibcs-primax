package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.model.domain.CostOfMajorItem;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.dpptapp.model.domain.ItemWiseCostEstimated;
import com.ibcs.idsdp.dpptapp.model.domain.SimilarProjectStudy;
import com.ibcs.idsdp.dpptapp.model.repositories.*;
import com.ibcs.idsdp.dpptapp.services.SimilarProjectStudyService;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTabDetailsDTO;
import com.ibcs.idsdp.dpptapp.web.dto.SimilarProjectStudyDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.CostOfMajorItemRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.ItemWiseCostEstimatedRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.SimilarProjectStudyRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class SimilarProjectStudyServiceImpl implements SimilarProjectStudyService {
    SimilarProjectStudyRepository similarProjectStudyRepository;
    DppAnnualPhasingCostTabDetailsRepository majorRepository;
    CostOfMajorItemRepository costOfMajorItemRepository;
    DppAnnualPhasingCostRepository repository;
    ItemWiseCostRepository itemWiseCostRepository;
    IdGeneratorComponent idGeneratorComponent;
    DppObjectiveCostRepository masterTableRepo;
    ConfigurationClientService configurationClientService;
    private final DppAnnualPhasingCostTabDetailsServiceImp dppAnnualPhasingCostTabDetailService;

    @Override
    public SimilarProjectStudyRequest saveSimilarProjectStudy(SimilarProjectStudyRequest similarProjectStudyRequest) {
        SimilarProjectStudyRequest result = new SimilarProjectStudyRequest();
        String uuid = idGeneratorComponent.generateUUID();
        SimilarProjectStudy similarProjectStudy = new SimilarProjectStudy();

        similarProjectStudy.setCreatedBy("admin");
        similarProjectStudy.setCreatedOn(LocalDate.now());
        similarProjectStudy.setIsDeleted(false);
        similarProjectStudy.setUuid(uuid);
        BeanUtils.copyProperties(similarProjectStudyRequest, similarProjectStudy);
        similarProjectStudy.setObjectiveCost(masterTableRepo.findByProjectConceptUuid(similarProjectStudyRequest.getProjectConceptUuid()));
        List<ItemWiseCostEstimated> itemWiseCostEstimatedList = new ArrayList<>();
        List<ItemWiseCostEstimatedRequest> itemWiseCostEstimatedRequests = similarProjectStudyRequest.getItemWiseCostEstimatedList();
        for (ItemWiseCostEstimatedRequest request : itemWiseCostEstimatedRequests) {
            String uuu = idGeneratorComponent.generateUUID();
            ItemWiseCostEstimated estimated = new ItemWiseCostEstimated();
            estimated.setCreatedBy("admin");
            estimated.setCreatedOn(LocalDate.now());
            estimated.setIsDeleted(false);
            estimated.setUuid(uuu);
            estimated.setMajorItem(request.getMajorItem());
            estimated.setDescription(request.getDescription());
            estimated.setUnit(request.getUnit());
            estimated.setUnitCost(request.getUnitCost());
            estimated.setBasis(request.getBasis());
            estimated.setSource(request.getSource());
            estimated.setItemWiseCostDate(request.getItemWiseCostDate());
            itemWiseCostEstimatedList.add(estimated);
        }
        similarProjectStudy.setItemWiseCostEstimatedList(itemWiseCostEstimatedList);

        List<CostOfMajorItem> costOfMajorItemList = new ArrayList<>();
        List<CostOfMajorItemRequest> costOfMajorItemRequests = similarProjectStudyRequest.getCostOfMajorItemList();
        for (CostOfMajorItemRequest request : costOfMajorItemRequests) {
            String uu = idGeneratorComponent.generateUUID();
            CostOfMajorItem majorItem = new CostOfMajorItem();
            majorItem.setCreatedBy("admin");
            majorItem.setCreatedOn(LocalDate.now());
            majorItem.setIsDeleted(false);
            majorItem.setUuid(uu);
            majorItem.setMajorItem(request.getMajorItem());
            majorItem.setDescription(request.getDescription());
            majorItem.setUnit(request.getUnit());
            majorItem.setProposalProject(request.getProposalProject());
            majorItem.setSimilarGoingProject(request.getSimilarGoingProject());
            majorItem.setSimilarCompleteProject(request.getSimilarCompleteProject());
            majorItem.setRemarks(request.getRemarks());
            costOfMajorItemList.add(majorItem);
        }
        similarProjectStudy.setCostOfMajorItemList(costOfMajorItemList);
        SimilarProjectStudy saveData = similarProjectStudyRepository.save(similarProjectStudy);
        BeanUtils.copyProperties(saveData, result);
        return result;
    }

    @Override
    public ResponseWithResults getByIsMajorItem(Boolean major) {
        Optional<List<DppAnnualPhasingCostTabDetails>> optional = majorRepository.findAllByIsMajor(true);
        if(!optional.isPresent()){
            return new ResponseWithResults(0, "Not Found", "");
        }else {
            return new ResponseWithResults(1, "Success", optional);
        }
    }

    @Override
    public ResponseWithResults getSimilarStudyByPcUuid(String pcUuid) {
        Optional<SimilarProjectStudy> similarProjectStudy = similarProjectStudyRepository.findAllByProjectConceptUuid(pcUuid);

        if (similarProjectStudy.isPresent()) {
            SimilarProjectStudy study = similarProjectStudy.get();
            SimilarProjectStudyDto dto = new SimilarProjectStudyDto();
            dto.setUuid(study.getUuid());
            dto.setIndicateIssuesMakeProject(study.getIndicateIssuesMakeProject());
            dto.setIndicateIssuesNotWork(study.getIndicateIssuesNotWork());
            dto.setSimilarOngoingProjectsName(study.getSimilarOngoingProjectsName());
            dto.setSimilarCompletedProjectsName(study.getSimilarCompletedProjectsName());

            List<DppAnnualPhasingCostTabDetailsDTO> costDetailList
                    = dppAnnualPhasingCostTabDetailService.getByProjectConceptUuidAndIsBasisOrIsMajor(pcUuid, true, true);

            Map<String, ItemWiseCostEstimatedRequest> finalItemWiseCostMap = study.getItemWiseCostEstimatedList().stream()
                    .collect(Collectors.toMap(
                            ItemWiseCostEstimated::getMajorItem,
                            item -> {
                                ItemWiseCostEstimatedRequest newItem = new ItemWiseCostEstimatedRequest();
                                BeanUtils.copyProperties(item, newItem);
                                return newItem;
                            }
                    ));

            Map<String, CostOfMajorItemRequest> finalCostOfMajorMap = study.getCostOfMajorItemList().stream()
                    .collect(Collectors.toMap(
                            CostOfMajorItem::getMajorItem,
                            costMajor -> {
                                CostOfMajorItemRequest newMajor = new CostOfMajorItemRequest();
                                BeanUtils.copyProperties(costMajor, newMajor);
                                return newMajor;
                            }
                    ));


            for (DppAnnualPhasingCostTabDetailsDTO tab : costDetailList) {
                String subEconomicCode = tab.getSubEconomicCodeDTO().getSubEconomicCode();
                tab.setIsBasis(tab.getIsBasis() != null && tab.getIsBasis());
                tab.setIsMajor(tab.getIsMajor() != null && tab.getIsMajor());

                if (tab.getIsBasis()) {
                    ItemWiseCostEstimatedRequest newItem = finalItemWiseCostMap.getOrDefault(subEconomicCode, new ItemWiseCostEstimatedRequest());
                    BeanUtils.copyProperties(tab, newItem);
                    newItem.setMajorItem(subEconomicCode);
                    newItem.setDescription(tab.getDescription());
                    newItem.setUnit(tab.getUnitId());
                    BigDecimal unitCost = BigDecimal.valueOf(tab.getUnitCost()).setScale(2, RoundingMode.CEILING);
                    newItem.setUnitCost(unitCost.doubleValue());
                    newItem.setUnitType(tab.getUnitTypeDTO());
                    finalItemWiseCostMap.put(subEconomicCode, newItem);
                }

                if (tab.getIsMajor()) {
                    CostOfMajorItemRequest newMajor = finalCostOfMajorMap.getOrDefault(subEconomicCode, new CostOfMajorItemRequest());
                    BeanUtils.copyProperties(tab, newMajor);
                    BigDecimal unitCost = BigDecimal.valueOf(tab.getUnitCost()).setScale(2, RoundingMode.CEILING);
                    newMajor.setMajorItem(subEconomicCode);
                    newMajor.setDescription(tab.getDescription());
                    newMajor.setUnit(tab.getUnitId());
                    newMajor.setProposalProject(unitCost.doubleValue());
                    newMajor.setUnitType(tab.getUnitTypeDTO());
                    finalCostOfMajorMap.put(subEconomicCode, newMajor);
                }
            }

            dto.setItemWiseCostEstimatedList(new ArrayList<>(finalItemWiseCostMap.values()));
            dto.setCostOfMajorItemList(new ArrayList<>(finalCostOfMajorMap.values()));
            return new ResponseWithResults(1, "Success", dto);
        } else {
            return new ResponseWithResults(0, "Success", "");
        }
    }

    @Override
    public SimilarProjectStudyDto updateSimilarProjectStudy(SimilarProjectStudyDto request, String pcUuid) {
        SimilarProjectStudyDto result = new SimilarProjectStudyDto();
        Optional<SimilarProjectStudy> optional = similarProjectStudyRepository.findAllByProjectConceptUuid(pcUuid);
        if (optional.isEmpty()) {
            throw new RuntimeException("Similar Project Study Not Found");
        }

        SimilarProjectStudy study = optional.get();
        study.setUpdatedBy("admin");
        study.setUpdatedOn(LocalDate.now());
        study.setIndicateIssuesMakeProject(request.getIndicateIssuesMakeProject());
        study.setIndicateIssuesNotWork(request.getIndicateIssuesNotWork());
        study.setSimilarOngoingProjectsName(request.getSimilarOngoingProjectsName());
        study.setSimilarCompletedProjectsName(request.getSimilarCompletedProjectsName());

        List<ItemWiseCostEstimated> itemWiseCostEstimatedList = new ArrayList<>();
        for (ItemWiseCostEstimatedRequest request1 : request.getItemWiseCostEstimatedList()) {
            String uuu = idGeneratorComponent.generateUUID();
            ItemWiseCostEstimated estimated = new ItemWiseCostEstimated();
            estimated.setCreatedBy("admin");
            estimated.setCreatedOn(LocalDate.now());
            estimated.setIsDeleted(false);
            estimated.setUuid(uuu);
            estimated.setMajorItem(request1.getMajorItem());
            estimated.setDescription(request1.getDescription());
            estimated.setUnit(request1.getUnit());
            estimated.setUnitCost(request1.getUnitCost());
            estimated.setBasis(request1.getBasis());
            estimated.setSource(request1.getSource());
            estimated.setItemWiseCostDate(request1.getItemWiseCostDate());
            itemWiseCostEstimatedList.add(estimated);
        }
        study.setItemWiseCostEstimatedList(itemWiseCostEstimatedList);
        List<CostOfMajorItem> costOfMajorItemList = new ArrayList<>();
        for (CostOfMajorItemRequest request2 : request.getCostOfMajorItemList()) {
            String uu = idGeneratorComponent.generateUUID();
            CostOfMajorItem majorItem = new CostOfMajorItem();
            majorItem.setCreatedBy("admin");
            majorItem.setCreatedOn(LocalDate.now());
            majorItem.setIsDeleted(false);
            majorItem.setUuid(uu);
            majorItem.setMajorItem(request2.getMajorItem());
            majorItem.setDescription(request2.getDescription());
            majorItem.setUnit(request2.getUnit());
            majorItem.setProposalProject(request2.getProposalProject());
            majorItem.setSimilarGoingProject(request2.getSimilarGoingProject());
            majorItem.setSimilarCompleteProject(request2.getSimilarCompleteProject());
            majorItem.setRemarks(request2.getRemarks());
            costOfMajorItemList.add(majorItem);
        }
        study.setCostOfMajorItemList(costOfMajorItemList);



        SimilarProjectStudy saveData = similarProjectStudyRepository.save(study);
        BeanUtils.copyProperties(saveData, result);
        return result;
    }
}
