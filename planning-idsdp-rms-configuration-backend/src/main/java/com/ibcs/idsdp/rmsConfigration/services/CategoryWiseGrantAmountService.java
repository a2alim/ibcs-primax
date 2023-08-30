package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmount;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseGrantAmountRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.DeleteList;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface CategoryWiseGrantAmountService {


    CategoryWiseGrantAmount createObj(Optional<MultipartFile[]> files, CategoryWiseGrantAmountRequest categoryWiseGrantAmountResponse);

    Page<CategoryWiseGrantAmount> findAllByActive(int offset,int pageSize);

    List<CategoryWiseGrantAmount> findAllByAll();

    CategoryWiseGrantAmount getObjById(Long id);

    CategoryWiseGrantAmount updateObj(Optional<MultipartFile[]> files, CategoryWiseGrantAmountRequest categoryWiseGrantAmountRequest, List<DeleteList> deleteList);
}
