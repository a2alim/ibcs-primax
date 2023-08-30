package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.Notification;
import com.ibcs.idsdp.rpm.services.NotificationService;
import com.ibcs.idsdp.rpm.web.dto.request.NotificationNoteRequest;
import com.ibcs.idsdp.rpm.web.dto.request.NotificationRequest;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */


@RestApiController
@RequestMapping("api/notifications")
public class NotificationController extends BaseController<Notification, NotificationNoteRequest, NotificationNoteRequest>{

	
	private final NotificationService notificationService;
	
	public NotificationController(BaseService<Notification, NotificationNoteRequest, NotificationNoteRequest> service, NotificationService notificationService) {
		super(service);	
		this.notificationService = notificationService;
	}	

	@PostMapping()
	public Response saveNotifications(@RequestBody NotificationRequest notificationRequest) {
		return notificationService.createNotification(notificationRequest);
	}

	@PostMapping("send-notification/{notificationId}")
	public Response sendNotifications(@PathVariable("notificationId") Long notificationId,@RequestBody String reqString) {
		return notificationService.sendNotifications(notificationId);
	}

	@GetMapping()
	public Response getNotifications() {
		return notificationService.getNotifications();
	}

	@PutMapping("/{notificationId}/note")
	public Response addNoteForNotification(@PathVariable("notificationId") Long notificationId,	@RequestBody NotificationNoteRequest notificationNoteRequest) {
		return notificationService.addNoteForNotification(notificationId, notificationNoteRequest);
	}

	@PutMapping("/{notificationId}")
	public Response updateNotifications(@PathVariable("notificationId") Long notificationId,@RequestBody NotificationRequest notificationRequest) {
		return notificationService.updateNotifications(notificationId, notificationRequest);
	}

	@GetMapping("/{notificationId}")
	public Response getNotificationsByNotificationId(@PathVariable("notificationId") Long notificationId) {
		return notificationService.getNotificationsByNotificationId(notificationId);
	}

}
