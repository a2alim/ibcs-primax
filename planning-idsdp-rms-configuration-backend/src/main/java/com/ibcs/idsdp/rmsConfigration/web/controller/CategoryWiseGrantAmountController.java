package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmount;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CategoryWiseGrantAmountFilesRepository;
import com.ibcs.idsdp.rmsConfigration.services.CategoryWiseGrantAmountService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseGrantAmountRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseGrantAmountRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.APIResponse;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CategoryWiseGrantAmountResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.DeleteList;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestApiController
@RequestMapping("api/category-amount")
public class CategoryWiseGrantAmountController extends BaseController<CategoryWiseGrantAmount, CategoryWiseGrantAmountRequestDto, CategoryWiseGrantAmountResponseDto> {

    final private CategoryWiseGrantAmountService categoryWiseGrantAmountService;
    private final CategoryWiseGrantAmountFilesRepository filesRepository;

    public CategoryWiseGrantAmountController(BaseService<CategoryWiseGrantAmount, CategoryWiseGrantAmountRequestDto, CategoryWiseGrantAmountResponseDto> service, CategoryWiseGrantAmountService categoryWiseGrantAmountService, CategoryWiseGrantAmountFilesRepository filesRepository) {
        super(service);
        this.categoryWiseGrantAmountService = categoryWiseGrantAmountService;
        this.filesRepository = filesRepository;
    }

    @PostMapping(path = "/create-unique")
    public CategoryWiseGrantAmount create(@RequestParam("file") Optional<MultipartFile[]> files, @RequestParam("body") String body) {
        CategoryWiseGrantAmountRequest categoryWiseGrantAmountRequest = new Gson().fromJson(body, CategoryWiseGrantAmountRequest.class);
        return categoryWiseGrantAmountService.createObj(files, categoryWiseGrantAmountRequest);


    }


    @PutMapping(path = "/update-with-files")
    public CategoryWiseGrantAmount update(@RequestParam("file") Optional<MultipartFile[]> files, @RequestParam("body") String body, @RequestParam("dlist") String dlist) {
       // filesRepository.deleteById(41l);
        CategoryWiseGrantAmountRequest categoryWiseGrantAmountRequest = new Gson().fromJson(body, CategoryWiseGrantAmountRequest.class);
        Type listType = new TypeToken<ArrayList<DeleteList>>() {
        }.getType();
        List<DeleteList> deleteList = new Gson().fromJson(dlist, listType);

        return categoryWiseGrantAmountService.updateObj(files, categoryWiseGrantAmountRequest, deleteList);


    }


    @GetMapping("pagination/{offset}/{pageSize}")
    public APIResponse<Page<CategoryWiseGrantAmount>> getProductsWithPagination(@PathVariable int offset, @PathVariable int pageSize) {
        Page<CategoryWiseGrantAmount> productsWithPagination = categoryWiseGrantAmountService.findAllByActive(offset, pageSize);
        return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);
    }

    @GetMapping("/get-lists")
    public List<CategoryWiseGrantAmount> findAll() {
        List<CategoryWiseGrantAmount> productsWithPagination = categoryWiseGrantAmountService.findAllByAll();
        return productsWithPagination;
        //return new APIResponse<>(productsWithPagination.getSize(), productsWithPagination);
    }

    @PutMapping(path = "/update-unique", produces = "application/json")
    public CategoryWiseGrantAmount doUpdate(@RequestBody CategoryWiseGrantAmount categoryWiseGrantAmount) {
        CategoryWiseGrantAmount rtObj = categoryWiseGrantAmountService.getObjById(categoryWiseGrantAmount.getId());
        categoryWiseGrantAmount.setIsDeleted(rtObj.getIsDeleted());
        categoryWiseGrantAmount.setCreatedBy(rtObj.getCreatedBy());
        categoryWiseGrantAmount.setCreatedOn(rtObj.getCreatedOn());
        //categoryWiseGrantAmount.setUpdatedBy(rtObj.getUpdatedBy());
        //categoryWiseGrantAmount.setUpdatedOn(LocalDate.now());
        //   return categoryWiseGrantAmountService.createObj(categoryWiseGrantAmount);
        return null;


    }
}
