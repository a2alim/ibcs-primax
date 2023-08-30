
import {FileUploadModel} from "../../../shared/model/file-upload.model";

export class TrainersAcademicBackgroundListModel {
    board:            string;
    certificateImage: FileUploadModel;
    examinationName:  string;
    id:               number;
    instituteName:    string;
    passingYear:      number;
    resultId:         string;
    subject:          string;
}
