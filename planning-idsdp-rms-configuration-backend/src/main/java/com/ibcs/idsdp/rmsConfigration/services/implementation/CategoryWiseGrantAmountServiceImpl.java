package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rmsConfigration.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmount;
import com.ibcs.idsdp.rmsConfigration.model.domain.CategoryWiseGrantAmountFiles;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CategoryWiseGrantAmountFilesRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.CategoryWiseGrantAmountRepository;
import com.ibcs.idsdp.rmsConfigration.services.CategoryWiseGrantAmountService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseGrantAmountRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CategoryWiseGrantAmountRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CategoryWiseGrantAmountResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.DeleteList;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class CategoryWiseGrantAmountServiceImpl extends BaseService<CategoryWiseGrantAmount, CategoryWiseGrantAmountRequestDto, CategoryWiseGrantAmountResponseDto> implements CategoryWiseGrantAmountService {

    private final CategoryWiseGrantAmountRepository categoryWiseGrantAmountRepository;

    private final CategoryWiseGrantAmountFilesRepository amountFilesRepository;

    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    private final MinioServerService  minioServerService;

    public CategoryWiseGrantAmountServiceImpl(ServiceRepository<CategoryWiseGrantAmount> repository, CategoryWiseGrantAmountRepository categoryWiseGrantAmountRepository, CategoryWiseGrantAmountFilesRepository amountFilesRepository, MinioServerService minioServerService) {
        super(repository);
        this.categoryWiseGrantAmountRepository = categoryWiseGrantAmountRepository;
        this.amountFilesRepository = amountFilesRepository;
        this.minioServerService = minioServerService;
    }

    @Override
    public CategoryWiseGrantAmount createObj(Optional<MultipartFile[]> files,
                                             CategoryWiseGrantAmountRequest categoryWiseGrantAmountResponse) {
        CategoryWiseGrantAmount categoryWiseGrantAmount= new CategoryWiseGrantAmount();

        BeanUtils.copyProperties(categoryWiseGrantAmountResponse,categoryWiseGrantAmount);
        List<CategoryWiseGrantAmountFiles> categoryWiseGrantAmountFilesList= new ArrayList<>();
        if(files.isPresent()) {
            for (MultipartFile file : files.get()) {
                CategoryWiseGrantAmountFiles categoryWiseGrantAmountFiles = new CategoryWiseGrantAmountFiles();
                FileUploadResponse downloadUrl = minioServerService.getFileDownloadUrl(file, "rms");
                categoryWiseGrantAmountFiles.setUuid(idGeneratorComponent.generateUUID());
                categoryWiseGrantAmountFiles.setFileName(downloadUrl.getFileName());
                categoryWiseGrantAmountFiles.setActive(true);
                categoryWiseGrantAmountFiles.setFileUrl(downloadUrl.getDownloadUrl());
                categoryWiseGrantAmountFiles.setBucketName(downloadUrl.getBucketName());
                categoryWiseGrantAmountFilesList.add(categoryWiseGrantAmountFiles);
            }
        }
        categoryWiseGrantAmount.setCategoryWiseGrantAmountFiles(categoryWiseGrantAmountFilesList);
        categoryWiseGrantAmount.setUuid(idGeneratorComponent.generateUUID());
        categoryWiseGrantAmount.setCreatedOn(LocalDate.now());
        categoryWiseGrantAmount.setIsDeleted(false);
        return categoryWiseGrantAmountRepository.save(categoryWiseGrantAmount);
    }




    @Override
    public Page<CategoryWiseGrantAmount> findAllByActive(int offset, int pageSize) {
        Page<CategoryWiseGrantAmount> ttt = categoryWiseGrantAmountRepository.findAllByIsDeletedOrderByIdDesc(false, PageRequest.of(offset, pageSize));
        return ttt;
    }

    @Override
    public List<CategoryWiseGrantAmount> findAllByAll() {
        return categoryWiseGrantAmountRepository.findAll();
    }

    @Override
    public CategoryWiseGrantAmount getObjById(Long id) {
        return categoryWiseGrantAmountRepository.findById(id).get();
    }

    @Override
    public CategoryWiseGrantAmount updateObj(Optional<MultipartFile[]> files, CategoryWiseGrantAmountRequest categoryWiseGrantAmountRequest, List<DeleteList> deleteList) {
        // retrieve master Data
        CategoryWiseGrantAmount gaFiles= categoryWiseGrantAmountRepository.findById(categoryWiseGrantAmountRequest.getId()).get();

        //get file List
        List<CategoryWiseGrantAmountFiles> categoryWiseGrantAmountFiles = gaFiles.getCategoryWiseGrantAmountFiles();


        // file if deleted then delete
        if(deleteList.size() > 0) {
            for(DeleteList deleted:deleteList){
                CategoryWiseGrantAmountFiles categoryWiseGrantAmountFiles1 = categoryWiseGrantAmountFiles.stream().filter(f -> f.getId() == deleted.getId()).findFirst().get();
                //delete from minio
                minioServerService.setFileDownloadUrlDeleteFile("rms",categoryWiseGrantAmountFiles1.getFileName());
                //delete from database
                amountFilesRepository.forceDelete(deleted.getId());
            }
        }

        //again load updated master Data
        CategoryWiseGrantAmount gaFiles2= categoryWiseGrantAmountRepository.findById(categoryWiseGrantAmountRequest.getId()).get();

        List<CategoryWiseGrantAmountFiles> categoryWiseGrantAmountFilesList= new ArrayList<>();
        //new files added
        if(files.isPresent()) {
            for (MultipartFile file : files.get()) {
                CategoryWiseGrantAmountFiles categoryWiseGrantAmountFile = new CategoryWiseGrantAmountFiles();
                FileUploadResponse downloadUrl = minioServerService.getFileDownloadUrl(file, "rms");
                categoryWiseGrantAmountFile.setUuid(idGeneratorComponent.generateUUID());
                categoryWiseGrantAmountFile.setFileName(downloadUrl.getFileName());
                categoryWiseGrantAmountFile.setActive(true);
                categoryWiseGrantAmountFile.setFileUrl(downloadUrl.getDownloadUrl());
                categoryWiseGrantAmountFile.setBucketName(downloadUrl.getBucketName());
                categoryWiseGrantAmountFilesList.add(categoryWiseGrantAmountFile);
            }
            //copy updated data

            List<CategoryWiseGrantAmountFiles> retrievedFile = gaFiles2.getCategoryWiseGrantAmountFiles();

            for(CategoryWiseGrantAmountFiles amountFiles:categoryWiseGrantAmountFilesList){
                retrievedFile.add(amountFiles);
            }

            gaFiles2.setCategoryWiseGrantAmountFiles(retrievedFile);

        }
        BeanUtils.copyProperties(categoryWiseGrantAmountRequest,gaFiles2);

        //save
        categoryWiseGrantAmountRepository.save(gaFiles2);






        return gaFiles;
    }


}
