package com.ibcs.idsdp.dpptapp.services.implementation.annexIII_aGoods;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.model.domain.AnxFiveBAmount;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoods;
import com.ibcs.idsdp.dpptapp.model.domain.annexIII_aGoods.AnnexureGoodsDetails;
import com.ibcs.idsdp.dpptapp.model.repositories.AnxFiveBAmountRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.annexIII_aGoods.AnnexureGoodsDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.annexIII_aGoods.AnnexureGoodsRepository;
import com.ibcs.idsdp.dpptapp.services.annexIII_aGoods.AnnexureGoodService;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsDetailsRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    /**
     * @param annexureGoodsRepository
     * @param idGeneratorComponent
     * @param annexureGoodsDetailsImp
     * @param annexureGoodsDetailsRepository
     * @param projectConceptClientService
     */
    public AnnexureGoodServiceImp(AnnexureGoodsRepository annexureGoodsRepository, IdGeneratorComponent idGeneratorComponent, AnnexureGoodsDetailsImp annexureGoodsDetailsImp,
                                  AnnexureGoodsDetailsRepository annexureGoodsDetailsRepository, ProjectConceptClientService projectConceptClientService,
                                  AnxFiveBAmountRepository anxFiveBAmountRepository) {
        super(annexureGoodsRepository);
        this.annexureGoodsRepository = annexureGoodsRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.annexureGoodsDetailsImp = annexureGoodsDetailsImp;
        this.annexureGoodsDetailsRepository = annexureGoodsDetailsRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.anxFiveBAmountRepository = anxFiveBAmountRepository;
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
    @Override
    public ResponseWithResults saveWithChild(AnnexureGoodSaveWithChildRequest request) {

        Integer status = 0;
        String message = "Project not found!";

        try {
            ProjectConceptResponse projectConceptResponse = projectConceptClientService.getProjectConceptMasterId(request.getProjectConceptUuid());
            if(projectConceptResponse.getId() < 1)
            {
                return new ResponseWithResults(status, message, "");
            }

            if (request.getUuid().isEmpty()) {

                /*--------Data will be save into the database parent table--------*/
                AnnexureGoods annexureGoods = new AnnexureGoods();
                BeanUtils.copyProperties(request, annexureGoods);
                annexureGoods.setProjectConceptMasterId(projectConceptResponse.getId());
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
                annexureGoods.setProjectConceptMasterId(projectConceptResponse.getId());
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
        }
        return new ResponseWithResults(status, message, request);
    }

    /**
     * Get annexure goods data by form type
     * @param formType
     * @return
     */
    public ResponseWithResults getDataByFormType(String formType, String projectConceptUuid) {
        AnnexureGoodsRequest data = getDataByTypeAndPcId(formType, projectConceptUuid);
        if (data != null) {
            return new ResponseWithResults(1, "Success", data);
        } else {
            return new ResponseWithResults(0, "Success", "");
        }
    }

    public AnnexureGoodsRequest getDataByTypeAndPcId(String formType, String projectConceptUuid) {
        AnnexureGoodsRequest response = new AnnexureGoodsRequest();
        AnnexureGoods request = annexureGoodsRepository.findByFormTypeAndProjectConceptUuidAndIsDeleted(formType,projectConceptUuid, false);
        if (request != null) {
            response.setId(request.getId());
            response.setUuid(request.getUuid());
            response.setFormType(request.getFormType());
            response.setTotalAmount(request.getTotalAmount());
            response.setProjectConceptUuid(request.getProjectConceptUuid());

            List<AnnexureGoodsDetailsRequest> annexureGoodsDetails = annexureGoodsDetailsImp.getDetailListById(request.getId());
            response.setList(annexureGoodsDetails);

            Optional<AnxFiveBAmount> info = anxFiveBAmountRepository.findByProjectConceptUuid(request.getProjectConceptUuid());
            if(info.isPresent()){
                AnxFiveBAmount anxFiveBAmount = info.get();
                response.setAnxFiveBAmount(anxFiveBAmount);
            }
            return response;
        } else {
            return null;
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
