package com.ibcs.idsdp.projectconcept.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.projectconcept.client.UaaClientService;
import com.ibcs.idsdp.projectconcept.client.dto.UserResponse;
import com.ibcs.idsdp.projectconcept.model.domain.Comments;
import com.ibcs.idsdp.projectconcept.model.repositories.CommentsRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.CommentsService;
import com.ibcs.idsdp.projectconcept.web.dto.CommentsDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.CommentBySourceIdAndSourceAndObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CommentsServiceImp extends BaseService<Comments, CommentsDTO> implements CommentsService {

    private final CommentsRepository repository;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private final UaaClientService uaaClientService;

    public CommentsServiceImp(CommentsRepository repository, ProjectConceptMasterRepository projectConceptMasterRepository, UaaClientService uaaClientService) {
        super(repository);
        this.repository = repository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.uaaClientService = uaaClientService;
    }

    @Override
    protected Comments convertForCreate(CommentsDTO commentsDTO) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        Comments comments = super.convertForCreate(commentsDTO);
//        comments.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(commentsDTO.getProjectConceptMasterId(), false).get());
        comments.setCommentBy(Long.parseLong(accessTokenDetail.getId()));
        comments.setCommentOn(LocalDate.now());
        return comments;
    }

    @Override
    protected void convertForUpdate(CommentsDTO commentsDTO, Comments comments) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
//        comments.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(commentsDTO.getProjectConceptMasterId(), false).get());
        commentsDTO.setCommentBy(Long.parseLong(accessTokenDetail.getId()));
        commentsDTO.setCommentOn(LocalDate.now());
        super.convertForUpdate(commentsDTO, comments);
    }

    @Override
    public List<CommentsDTO> getCommentsByObserver(CommentBySourceIdAndSourceAndObserver request) {
        AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails()).getDecodedDetails();
        long loggedInUserId = Long.parseLong(accessTokenDetail.getId());
        List<CommentsDTO> list = convertForRead(repository.findAllByObserverAndSourceIdAndCommentsSource(request.getObserver(), request.getSourceId(), request.getSource().ordinal()));
        if (!list.isEmpty())      {
            Map<Long, UserResponse> userResponseMap = uaaClientService.getUserByIdSet(list.stream().map(CommentsDTO::getCommentBy).collect(Collectors.toSet())).getBody().stream()
                    .collect(Collectors.toMap(UserResponse::getId, dto -> dto));


            list.forEach(e -> {
                e.setCommenter(userResponseMap.get(e.getCommentBy()));
                e.setCanEdit(loggedInUserId==e.getCommentBy());
            });
        }
        return list;
    }
}


