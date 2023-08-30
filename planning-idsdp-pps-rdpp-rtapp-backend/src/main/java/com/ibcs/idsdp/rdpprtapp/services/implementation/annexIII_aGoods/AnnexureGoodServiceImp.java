package com.ibcs.idsdp.rdpprtapp.services.implementation.annexIII_aGoods;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.client.ConfigurationClientService;
import com.ibcs.idsdp.rdpprtapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.rdpprtapp.model.domain.AnxFiveBAmount;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoods;
import com.ibcs.idsdp.rdpprtapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.rdpprtapp.model.repositories.AnxFiveBAmountRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.annexIII_aGoods.AnnexureGoodsDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.annexIII_aGoods.AnnexureGoodsRepository;
import com.ibcs.idsdp.rdpprtapp.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.AnnexureGoodsDetailsDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.UnitType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class AnnexureGoodServiceImp extends BaseService<AnnexureGoods, AnnexureGoodsRequest> implements AnnexureGoodService {

    private final AnnexureGoodsRepository annexureGoodsRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final AnnexureGoodsDetailsImp annexureGoodsDetailsImp;
    private final AnnexureGoodsDetailsRepository annexureGoodsDetailsRepository;
    private final ProjectConceptClientService projectConceptClientService;
    private AnxFiveBAmountRepository anxFiveBAmountRepository;
    private final ConfigurationClientService configurationClientService;

    /**
     * @param annexureGoodsRepository
     * @param idGeneratorComponent
     * @param annexureGoodsDetailsImp
     * @param annexureGoodsDetailsRepository
     * @param projectConceptClientService
     */
    public AnnexureGoodServiceImp(AnnexureGoodsRepository annexureGoodsRepository, IdGeneratorComponent idGeneratorComponent, AnnexureGoodsDetailsImp annexureGoodsDetailsImp,
                                  AnnexureGoodsDetailsRepository annexureGoodsDetailsRepository,
                                  ProjectConceptClientService projectConceptClientService,
                                  AnxFiveBAmountRepository anxFiveBAmountRepository,
                                  ConfigurationClientService configurationClientService) {
        super(annexureGoodsRepository);
        this.annexureGoodsRepository = annexureGoodsRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.annexureGoodsDetailsImp = annexureGoodsDetailsImp;
        this.annexureGoodsDetailsRepository = annexureGoodsDetailsRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.anxFiveBAmountRepository = anxFiveBAmountRepository;
        this.configurationClientService = configurationClientService;
    }


    /**
     * Get all annexure goods records
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<AnnexureGoodsRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<AnnexureGoods> ePage2 = annexureGoodsRepository.findAllByStatusAndIsDeleted(true, true, pageable);
        return new PageImpl(convertForRead(ePage2.getContent()), pageable, ePage2.getTotalElements());
    }

    /**
     * For create UUID, System generated code
     * @param code
     * @return
     */
    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = annexureGoodsRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }

    /**
     * Cor create annexure goods records
     * @param request
     * @return
     */
    @Transactional
    @Override
    public ResponseWithResults saveWithChild(AnnexureGoodSaveWithChildRequest request) {

        Integer status = 0;
        String message = "Project not found!";
        try {
            if (request.getUuid().isEmpty()) {
                /*--------Data will be save into the database parent table--------*/
                AnnexureGoods annexureGoods = new AnnexureGoods();
                BeanUtils.copyProperties(request, annexureGoods);
                annexureGoods.setUuid(UUID.randomUUID().toString());
                annexureGoods.setCreatedBy("admin");
                annexureGoods.setCreatedOn(LocalDate.now());
                annexureGoods.setIsDeleted(false);
                annexureGoodsRepository.save(annexureGoods);
                for (AnnexureGoodsDetailsRequest requestVal : request.getList()) {
                    /*--------Data will be save into the database child table--------*/
                    AnnexureGoodsDetails annexureGoodsDetails = new AnnexureGoodsDetails();
                    BeanUtils.copyProperties(requestVal, annexureGoodsDetails);

                    annexureGoodsDetails.setUuid(UUID.randomUUID().toString());
                    annexureGoodsDetails.setAnnexureGoods(annexureGoods); //Foreign key
                    annexureGoodsDetails.setCreatedBy("admin");
                    annexureGoodsDetails.setCreatedOn(LocalDate.now());
                    annexureGoodsDetails.setIsDeleted(false);
                    annexureGoodsDetailsRepository.save(annexureGoodsDetails);
                }
                status = 1;
                message = "Data saved successfully!";

            } else {
                /*--------Data will be update into the database parent table--------*/
                Optional<AnnexureGoods> optionalAnnexureGoods = annexureGoodsRepository.findByUuidAndIsDeleted(request.getUuid(), false).stream().findFirst();
                if (!optionalAnnexureGoods.isPresent()) {
                    throw new ResourceNotFoundException("Not Found");
                }
                AnnexureGoods annexureGoods = optionalAnnexureGoods.get();
                BeanUtils.copyProperties(request, annexureGoods);
                annexureGoods.setUpdatedBy("admin");
                annexureGoods.setUpdatedOn(LocalDate.now());
                annexureGoods.setIsDeleted(false);
                annexureGoodsRepository.save(annexureGoods);

                for (AnnexureGoodsDetailsRequest requestVal : request.getList()) {
                    if (!requestVal.getUuid().isEmpty()) {
                        /*------If there is already data into the database table then will be update------*/
                        Optional<AnnexureGoodsDetails> annexureGoodsDetailsOptional = annexureGoodsDetailsRepository.findByUuidAndIsDeleted(requestVal.getUuid(), false);
                        AnnexureGoodsDetails annexureGoodsDetails = annexureGoodsDetailsOptional.get();
                        BeanUtils.copyProperties(requestVal, annexureGoodsDetails);

                        annexureGoodsDetails.setAnnexureGoods(annexureGoods); //Foreign key
                        annexureGoodsDetails.setUpdatedBy("admin");
                        annexureGoodsDetails.setUpdatedOn(LocalDate.now());
                        annexureGoodsDetails.setIsDeleted(false);
                        //System.out.println(annexureGoodsDetails);
                        annexureGoodsDetailsRepository.save(annexureGoodsDetails);
                    } else {
                        /*------New data will be save into the database table------*/
                        AnnexureGoodsDetails annexureGoodsDetails2 = new AnnexureGoodsDetails();
                        BeanUtils.copyProperties(requestVal, annexureGoodsDetails2);
                        annexureGoodsDetails2.setAnnexureGoods(annexureGoods); //Foreign key
                        annexureGoodsDetails2.setUuid(UUID.randomUUID().toString());
                        annexureGoodsDetails2.setCreatedBy("admin");
                        annexureGoodsDetails2.setCreatedOn(LocalDate.now());
                        annexureGoodsDetails2.setIsDeleted(false);
                        annexureGoodsDetailsRepository.save(annexureGoodsDetails2);
                    }
                }
                status = 1;
                message = "Data updated successfully!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            message = e.getMessage();
            return new ResponseWithResults(status, message, request);
        }
        return new ResponseWithResults(status, message, request);
    }

    /**
     * Get annexure goods data by form type
     * @param formType
     * @return
     */
    public ResponseWithResults getDataByFormType(String formType, Long id) {
        AnnexureGoodsRequest response = new AnnexureGoodsRequest();
        Optional<AnnexureGoods> annexureGoodsOptional = annexureGoodsRepository.findByFormTypeAndRdppMasterIdAndIsDeleted(formType, id, false);
        if (annexureGoodsOptional.isPresent()) {
            AnnexureGoods annexureGoods = annexureGoodsOptional.get();
            response.setId(annexureGoods.getId());
            response.setUuid(annexureGoods.getUuid());
            response.setFormType(annexureGoods.getFormType());
            response.setTotalAmount(annexureGoods.getTotalAmount());
            response.setProjectConceptUuid(annexureGoods.getProjectConceptUuid());
            List<AnnexureGoodsDetails> annexureGoodsDetails = annexureGoodsDetailsRepository.findAllByAnnexureGoodsIdAndIsDeleted(annexureGoods.getId(), false);
            List<AnnexureGoodsDetailsDto> annexureGoodsDetailsDto = new ArrayList<>();
            for (AnnexureGoodsDetails annexure : annexureGoodsDetails) {
                AnnexureGoodsDetailsDto ann = new AnnexureGoodsDetailsDto();
                BeanUtils.copyProperties(annexure, ann);
                ann.setUnitType(configurationClientService.getUnitNameById(ann.getUnitId()));
                ann.setProcurementType(configurationClientService.getProcurementTypeById(ann.getProcurementTypeId()));
                ann.setProcurementMethod(configurationClientService.getProcurementMethodById(ann.getProcurementMethodId()));
                annexureGoodsDetailsDto.add(ann);
            }
            response.setList(annexureGoodsDetailsDto);
            Optional<AnxFiveBAmount> info = anxFiveBAmountRepository.findByProjectConceptUuid(annexureGoods.getProjectConceptUuid());
            if(info.isPresent()){
                AnxFiveBAmount anxFiveBAmount = info.get();
                response.setAnxFiveBAmount(anxFiveBAmount);
            }
            return new ResponseWithResults(1, "Success", response);
        } else {
            return new ResponseWithResults(0, "Success", "");
        }
    }


    /**
     * Data will be delete from the database table
     * @param id
     * @return
     */
    @Override
    public ResponseEntity<ResponseStatus> deleteRow(Long id){

        Optional<AnnexureGoodsDetails> annxDetails = annexureGoodsDetailsRepository.findById(id);
        if(annxDetails.isPresent())
        {
            AnnexureGoodsDetails annexureGoodsDetails = annxDetails.get();
            annexureGoodsDetails.setIsDeleted(true);
            annexureGoodsDetails.setUpdatedOn(LocalDate.now());
            annexureGoodsDetails.setUpdatedBy("admin");
            annexureGoodsDetailsRepository.save(annexureGoodsDetails);
            return new ResponseEntity( new ResponseStatus(1, "Data deleted successfully"), HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity( new ResponseStatus(0, "Data deletion failed"), HttpStatus.OK);
        }
    }
}
