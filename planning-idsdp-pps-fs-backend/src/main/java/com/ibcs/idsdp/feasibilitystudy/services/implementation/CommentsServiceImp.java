package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.ValueHolderRequestDTO;
import com.ibcs.idsdp.feasibilitystudy.model.domain.Comments;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.CommentsRepository;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.FspSummaryRepository;
import com.ibcs.idsdp.feasibilitystudy.services.CommentsService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.CommentsDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
public class CommentsServiceImp extends BaseService<Comments, CommentsDTO> implements CommentsService {

    private final CommentsRepository repository;
    private final FspSummaryRepository fspSummaryRepository;

    public CommentsServiceImp(CommentsRepository repository, FspSummaryRepository fspSummaryRepository) {
        super(repository);
        this.repository = repository;
        this.fspSummaryRepository = fspSummaryRepository;
    }

    @Override
    protected Comments convertForCreate(CommentsDTO commentsDTO) {
        Comments comments = super.convertForCreate(commentsDTO);
        comments.setFspSummaryMaster(fspSummaryRepository.findByIdAndIsDeleted(commentsDTO.getFspMasterId(), false).get());
        comments.setCommentBy("User");
        comments.setCommentOn(LocalDate.now());
        return comments;
    }

    @Override
    protected void convertForUpdate(CommentsDTO commentsDTO, Comments comments) {
        comments.setFspSummaryMaster(fspSummaryRepository.findByIdAndIsDeleted(commentsDTO.getFspMasterId(), false).get());
        commentsDTO.setCommentBy("User");
        commentsDTO.setCommentOn(LocalDate.now());
        super.convertForUpdate(commentsDTO, comments);
    }

    @Override
    public List<CommentsDTO> getCommentsByObserver(ValueHolderRequestDTO request) {
        return convertForRead(repository.findAllByObserverAndIsDeleted(request.getValue(), false));
    }
}
