package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.*;
import com.ibcs.idsdp.rdpprtapp.model.repositories.*;
import com.ibcs.idsdp.rdpprtapp.services.SimilarProjectStudyService;
import com.ibcs.idsdp.rdpprtapp.web.dto.SimilarProjectStudyDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.CostOfMajorItemRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.ItemWiseCostEstimatedRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.SimilarProjectStudyRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.UnitType;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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


    /*--------------- For Create Similar Project Study -----------------------*/
    @Override
    public SimilarProjectStudyRequest saveSimilarProjectStudy(SimilarProjectStudyRequest similarProjectStudyRequest) {

        String uuid = idGeneratorComponent.generateUUID();
        /*-------------- Data save Parent table --------------------------*/
        SimilarProjectStudy similarProjectStudy = new SimilarProjectStudy();
        // Convert requst to object

        similarProjectStudy.setCreatedBy("admin");
        similarProjectStudy.setCreatedOn(LocalDate.now());
        similarProjectStudy.setIsDeleted(false);
        similarProjectStudy.setUuid(uuid);
        BeanUtils.copyProperties(similarProjectStudyRequest, similarProjectStudy);
        /* ----- Set Dpp Master Id ------*/
        similarProjectStudy.setObjectiveCost(masterTableRepo.findByProjectConceptUuid(similarProjectStudyRequest.getProjectConceptUuid()));
        /*-------------- Data save child dpp_item_wise_cost_estimated table --------------------------*/
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
            estimated.setUnit(request.getUnit());
            estimated.setUnitCost(request.getUnitCost());
            estimated.setBasis(request.getBasis());
            estimated.setSource(request.getSource());
            estimated.setItemWiseCostDate(request.getItemWiseCostDate());
            itemWiseCostEstimatedList.add(estimated);
        }
        similarProjectStudy.setItemWiseCostEstimatedList(itemWiseCostEstimatedList);

        /*-------------- Data save will child dpp_cost_of_major_item table --------------------------*/
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
            majorItem.setUnit(request.getUnit());
            majorItem.setProposalProject(request.getProposalProject());
            majorItem.setSimilarGoingProject(request.getSimilarGoingProject());
            majorItem.setSimilarCompleteProject(request.getSimilarCompleteProject());
            majorItem.setRemarks(request.getRemarks());
            costOfMajorItemList.add(majorItem);
        }
        similarProjectStudy.setCostOfMajorItemList(costOfMajorItemList);
        similarProjectStudyRepository.save(similarProjectStudy);
        return null;
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

        if(!similarProjectStudy.isPresent())
        {
            return new ResponseWithResults(0, "Success", "");
        }
        else
        {
            SimilarProjectStudy study = similarProjectStudy.get();

            SimilarProjectStudyDto dto = new SimilarProjectStudyDto();
            dto.setUuid(study.getUuid());
            dto.setIndicateIssuesMakeProject(study.getIndicateIssuesMakeProject());
            dto.setIndicateIssuesNotWork(study.getIndicateIssuesNotWork());

            List<ItemWiseCostEstimatedRequest> arrayList = new ArrayList<>();
            List<ItemWiseCostEstimated> re = study.getItemWiseCostEstimatedList();

            List<CostOfMajorItemRequest> arrayList2 = new ArrayList<>();
            List<CostOfMajorItem> majorItems = study.getCostOfMajorItemList();

            Set<Long> unitSet = re.stream().map(ItemWiseCostEstimated::getUnit).collect(Collectors.toSet());
            unitSet.addAll(majorItems.stream().map(CostOfMajorItem::getUnit).collect(Collectors.toSet()));
            Map<Long, UnitType> unitTypeHashMap = configurationClientService.getUnitTypeByIdSet(new IdSetRequestBodyDTO() {
                {
                    setIds(unitSet);
                }
            }).stream().collect(Collectors.toMap(UnitType::getId, a -> a));

            for(ItemWiseCostEstimated req: re){
                ItemWiseCostEstimatedRequest request = new ItemWiseCostEstimatedRequest();
                BeanUtils.copyProperties(req, request);
                request.setUnitType(unitTypeHashMap.get(req.getUnit()));
                arrayList.add(request);
            }
            dto.setItemWiseCostEstimatedList(arrayList);

            for (CostOfMajorItem item : majorItems){
                CostOfMajorItemRequest rqst = new CostOfMajorItemRequest();
                BeanUtils.copyProperties(item, rqst);
                rqst.setUnitType(unitTypeHashMap.get(rqst.getUnit()));
                arrayList2.add(rqst);
            }
            dto.setCostOfMajorItemList(arrayList2);

            return new ResponseWithResults(1, "Success", dto);
        }

    }

    @Override
    public SimilarProjectStudyDto updateSimilarProjectStudy(SimilarProjectStudyDto request, String pcUuid) {
        Optional<SimilarProjectStudy> optional = similarProjectStudyRepository.findAllByProjectConceptUuid(pcUuid);
        if (!optional.isPresent()) {

            throw new RuntimeException("Similar Project Study Not Found");
        }


        SimilarProjectStudy study = optional.get();
        study.setUpdatedBy("admin");
        study.setUpdatedOn(LocalDate.now());
        study.setIndicateIssuesMakeProject(request.getIndicateIssuesMakeProject());
        study.setIndicateIssuesNotWork(request.getIndicateIssuesNotWork());

        List<CostOfMajorItem> arrayss = new ArrayList<>();
        List<CostOfMajorItem> majorItemRequestList = study.getCostOfMajorItemList();
        for (CostOfMajorItem dto : majorItemRequestList){
            CostOfMajorItem majorItemRequest = new CostOfMajorItem();
            BeanUtils.copyProperties(dto, majorItemRequest);
            majorItemRequest.setUpdatedBy("admin");
            majorItemRequest.setUpdatedOn(LocalDate.now());

            arrayss.add(majorItemRequest);
        }
        study.setCostOfMajorItemList(arrayss);

        List<ItemWiseCostEstimated> arrays = new ArrayList<>();
        List<ItemWiseCostEstimated> itemList = study.getItemWiseCostEstimatedList();
        for (ItemWiseCostEstimated dto : itemList){
            ItemWiseCostEstimated majorItemRequest = new ItemWiseCostEstimated();
            BeanUtils.copyProperties(dto, majorItemRequest);
            majorItemRequest.setUpdatedBy("admin");
            majorItemRequest.setUpdatedOn(LocalDate.now());

            arrays.add(majorItemRequest);
        }
        study.setItemWiseCostEstimatedList(arrays);

        similarProjectStudyRepository.save(study);

        return null;
    }



    public List<DppAnnualPhasingCostTabDetails> getByPcUuid(String pcUuid) {
//        DppAnnualPhasing revenueComponent = DppAnnualPhasing.Revenue_Component;
//        DppAnnualPhasing capital_component = DppAnnualPhasing.Capital_Component;
//
//        List<DppAnnualPhasing> annualPhasingList = new ArrayList<>();
//        annualPhasingList.add(capital_component);
//        annualPhasingList.add(revenueComponent);
//
//
//        Optional<DppAnnualPhasingOfCost> dppAnnualPhasingOfCostOptional1 = repository.findByProjectConceptIdAndIsDeletedAndTabNameIn(pcUuid, false, annualPhasingList);
//        if(dppAnnualPhasingOfCostOptional1.isPresent()) {
//            DppAnnualPhasingOfCost dppAnnualPhasingOfCost1 = dppAnnualPhasingOfCostOptional1.get();
//            List<DppAnnualPhasingCostTabDetails> dppAnnualPhasingOfCosts = dppAnnualPhasingOfCost1
//                    .getDppAnnualPhasingCostTabDetails().stream()
//                    .filter(DppAnnualPhasingCostTabDetails::isMajor).collect(Collectors.toList());
//
//            return dppAnnualPhasingOfCosts;
//        }
        return null;
    }
}
