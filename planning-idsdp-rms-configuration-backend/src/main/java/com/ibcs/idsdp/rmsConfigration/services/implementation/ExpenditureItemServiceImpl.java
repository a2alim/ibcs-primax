package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rmsConfigration.model.domain.ExpenditureItem;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ExpenditureItemRepository;
import com.ibcs.idsdp.rmsConfigration.services.ExpenditureItemService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ExpenditureItemRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class ExpenditureItemServiceImpl extends BaseService<ExpenditureItem, ExpenditureItemRequestDto, ExpenditureItemResponseDto> implements ExpenditureItemService {

    private final ExpenditureItemRepository expenditureItemRepository;

    public ExpenditureItemServiceImpl(ServiceRepository<ExpenditureItem> repository, ExpenditureItemRepository expenditureItemRepository) {
        super(repository);
        this.expenditureItemRepository = expenditureItemRepository;
    }

    @Override
    public Response<ExpenditureItemResponseDto> createExpenditureItem(ExpenditureItemRequestDto expenditureItemRequestDto) {
//        Boolean isExists = isExistsBeforeSave("st_expenditure_item", "exp_items_name",
//                expenditureItemRequestDto.getExpItemsName());
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Optional<ExpenditureItem> exItem=  expenditureItemRepository.findByExpItemsNameAndExpItemsForAndIsDeleted(expenditureItemRequestDto.getExpItemsName(),expenditureItemRequestDto.getExpItemsFor(),false);

        if(accessTokenDetail.getUserType().equals("Rms_DO")){
            expenditureItemRequestDto.setAddByAdmin(true);
        }else{
            expenditureItemRequestDto.setAddByAdmin(false);
        }

        if (!exItem.isPresent()) {
            return create(expenditureItemRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<ExpenditureItemResponseDto> updateExpenditureItem(ExpenditureItemRequestDto expenditureItemRequestDto) {
        Boolean isExists = isExistsBeforeUpdate("st_expenditure_item", "exp_items_name",
                expenditureItemRequestDto.getId(), expenditureItemRequestDto.getExpItemsName());

        Optional<ExpenditureItem> exItem=  expenditureItemRepository.findByExpItemsNameAndExpItemsFor(expenditureItemRequestDto.getExpItemsName(),expenditureItemRequestDto.getExpItemsFor(),expenditureItemRequestDto.getId());

        if (!exItem.isPresent()) {
            return update(expenditureItemRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<ExpenditureItem> getActiveExpenditureItem() {
        Response<ExpenditureItem> response=new Response<>();
       List<ExpenditureItem> expenditureItems= expenditureItemRepository.findAllByActiveAndIsDeleted(true,false);
       if(expenditureItems.isEmpty()){
           response.setSuccess(false);
           response.setMessage("Empty");
       }else{
           response.setSuccess(true);
           response.setMessage("Data Found");
           response.setItems(expenditureItems);
       }

       return response;
    }

	@Override
	public Response<ExpenditureItemResponseDto> findByExpenditureName(String itemsName) {
		
		 Optional<ExpenditureItem> optional = expenditureItemRepository.findByExpItemsNameAndIsDeleted(itemsName,false);
		 if(optional.isPresent()) {
			 return new Response<ExpenditureItemResponseDto>(){{
				 setObj(convertForRead(optional.get()));
				 setSuccess(true);
				 setMessage("Data Found !.");
			 }};
		 }
		 
		return getErrorResponse("Data not found !.");
	}


    public Response<ExpenditureItemResponseDto> findByAdminIdOrCreatedById() {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        List<ExpenditureItem> optional = expenditureItemRepository.findByAddByAdminOrCreatedByAndIsDeleted(true, String.valueOf(accessTokenDetail.getId()), false);

        if(optional.size() > 0) {
            return new Response<ExpenditureItemResponseDto>(){{
                setItems(convertForRead(optional));
                setSuccess(true);
                setMessage("Data Found !.");
            }};
        }

        return getErrorResponse("Data not found !.");
    }
}
