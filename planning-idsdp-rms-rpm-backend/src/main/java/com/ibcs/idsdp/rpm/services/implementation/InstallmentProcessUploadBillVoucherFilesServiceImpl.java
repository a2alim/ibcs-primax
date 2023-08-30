package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessUploadBillVoucherFiles;
import com.ibcs.idsdp.rpm.model.repositories.InstallmentProcessRepository;
import com.ibcs.idsdp.rpm.model.repositories.InstallmentProcessUploadBillVoucherFilesRepository;
import com.ibcs.idsdp.rpm.services.InstallmentProcessUploadBillVoucherFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.DeleteList;
import com.ibcs.idsdp.rpm.web.dto.request.FileRequest;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessUploadBillVoucherFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessUploadBillVoucherFilesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class InstallmentProcessUploadBillVoucherFilesServiceImpl extends BaseService<InstallmentProcessUploadBillVoucherFiles, InstallmentProcessUploadBillVoucherFilesRequestDto, InstallmentProcessUploadBillVoucherFilesResponseDto> implements InstallmentProcessUploadBillVoucherFilesService {

    private final InstallmentProcessUploadBillVoucherFilesRepository processUploadBillVoucherFilesRepository;

    private final InstallmentProcessRepository installmentProcessRepository;
    private final MinioServerService minioServerService;
    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    public InstallmentProcessUploadBillVoucherFilesServiceImpl(ServiceRepository<InstallmentProcessUploadBillVoucherFiles> repository, InstallmentProcessUploadBillVoucherFilesRepository processUploadBillVoucherFilesRepository, InstallmentProcessRepository installmentProcessRepository, MinioServerService minioServerService) {
        super(repository);
        this.processUploadBillVoucherFilesRepository = processUploadBillVoucherFilesRepository;
        this.installmentProcessRepository = installmentProcessRepository;
        this.minioServerService = minioServerService;
    }

    @Override
    public Response saveVoucher(String body, Optional<MultipartFile[]> files, String dlist, String modifyFiles) {

        Response<List<InstallmentProcessUploadBillVoucherFiles>> response = new Response<>();
        try {
            //parse DeleteList
            Type listTypeDelete = new TypeToken<ArrayList<DeleteList>>() {
            }.getType();
            List<DeleteList> deleteLists = new Gson().fromJson(dlist, listTypeDelete);

            //parse ModifyList
            Type listTypeModify = new TypeToken<ArrayList<FileRequest>>() {
            }.getType();
            List<FileRequest> modifyList = new Gson().fromJson(modifyFiles, listTypeModify);


            //body bodyData parse
            Type listType = new TypeToken<ArrayList<InstallmentProcessUploadBillVoucherFilesRequestDto>>() {
            }.getType();
            List<InstallmentProcessUploadBillVoucherFilesRequestDto> bodyData = new Gson().fromJson(body, listType);

//            List For  Holding Data

            List<InstallmentProcessUploadBillVoucherFiles> uploadBillVoucherFiles = new ArrayList<>();
            List<InstallmentProcessUploadBillVoucherFiles> uploadBillVoucherFilesUpdate = new ArrayList<>();


            /*if any file deleted*/
            if (!deleteLists.isEmpty()) {
                for (DeleteList deleteId : deleteLists) {
                    processUploadBillVoucherFilesRepository.deleteById(deleteId.getId());
                }
            }
            /*end delete*/

            if(bodyData.isEmpty()){
                response.setMessage("Updated Successfully");
                response.setSuccess(true);
            }else {

            //Get Master Table Data
            Optional<InstallmentProcess> installmentProcess = installmentProcessRepository.findById(bodyData.get(0).getAgreementId());

                int counter = 0;
                for (InstallmentProcessUploadBillVoucherFilesRequestDto row : bodyData) {
                    /*if you need update*/
                    if (row.getId() != null) {

                        //retrieving files bodyData
                        Optional<InstallmentProcessUploadBillVoucherFiles> loadVoucherOpt = processUploadBillVoucherFilesRepository.findById(row.getId());
                        if (loadVoucherOpt.isPresent()) {
                            InstallmentProcessUploadBillVoucherFiles loadVoucher = loadVoucherOpt.get();
                            loadVoucher.setFileTitle(row.getFileTitle());
                            loadVoucher.setIsEditable(row.getIsEditable());

                            //if modify Data found
                            if (!modifyList.isEmpty()) {
                                Optional<FileRequest> request = modifyList.stream().filter(f -> f.getId() == row.getId()).findFirst();

                                //delete File for update
                                if (request.isPresent()) {
                                    minioServerService.setFileDownloadUrlDeleteFile(loadVoucher.getBucketNameSignature(), loadVoucher.getFileNameSignature());
                                    //processUploadBillVoucherFilesRepository.deleteById(row.getId());

                                    // matching files

                                    for (MultipartFile multipartFile : files.get()) {
                                        if
                                        (multipartFile.getOriginalFilename().equalsIgnoreCase(request.get().getFileName())) {
                                            //upload new Files
                                            FileUploadResponse downloadUrl = minioServerService.getFileDownloadUrl(multipartFile, "rms");
                                            loadVoucher.setFileDownloadUrlSignature(downloadUrl.getDownloadUrl());
                                            loadVoucher.setBucketNameSignature(downloadUrl.getBucketName());
                                            loadVoucher.setFileNameSignature(downloadUrl.getFileName());

                                        }

                                    }


                                }
                                uploadBillVoucherFilesUpdate.add(loadVoucher);
                            }

                        } else {
                            response.setMessage("Updated Successfully");
                            response.setSuccess(true);

                        }


                    } else {
                        InstallmentProcessUploadBillVoucherFiles billVoucherFiles = new InstallmentProcessUploadBillVoucherFiles();
                        BeanUtils.copyProperties(row, billVoucherFiles);
                        billVoucherFiles.setM2InstallmentProcessId(installmentProcess.get());

                        if (files.isPresent() && files.get().length > 0) {

                            FileUploadResponse image = minioServerService.getFileDownloadUrl(files.get()[counter], "rms");
                            if (image != null) {
                                billVoucherFiles.setFileDownloadUrlSignature(image.getDownloadUrl());
                                billVoucherFiles.setBucketNameSignature(image.getBucketName());
                                billVoucherFiles.setFileNameSignature(image.getFileName());
                            }

                            counter++;

                        }
                        billVoucherFiles.setUuid(idGeneratorComponent.generateUUID());
                        uploadBillVoucherFiles.add(billVoucherFiles);
                    }


                }

            }

            /* for new item*/

            if (uploadBillVoucherFiles.isEmpty()) {
                processUploadBillVoucherFilesRepository.saveAll(uploadBillVoucherFilesUpdate);
                response.setMessage("Updated Successfully");
                response.setSuccess(true);
                response.setObj(uploadBillVoucherFilesUpdate);

            } else {
                //create here
                processUploadBillVoucherFilesRepository.saveAll(uploadBillVoucherFiles);
                response.setMessage("Saved Successfully!");
                response.setSuccess(true);
                response.setObj(uploadBillVoucherFiles);
            }


        } catch (Exception e) {

            //Response<CreateLetterForGed> response = new Response<>();
            response.setMessage("Save Failed");
            response.setSuccess(false);
            response.setObj(null);
            return response;

        }
        return response;

    }

    @Override
    public Response getByProcessId(Long processId) {
        Response<InstallmentProcessUploadBillVoucherFiles> response = new Response<>();
        InstallmentProcess byId = installmentProcessRepository.findById(processId).get();
        List<InstallmentProcessUploadBillVoucherFiles> list = processUploadBillVoucherFilesRepository.findByM2InstallmentProcessId(byId);
        response.setSuccess(true);
        response.setMessage("Data Found");
        response.setItems(list);
        return response;
    }

}

