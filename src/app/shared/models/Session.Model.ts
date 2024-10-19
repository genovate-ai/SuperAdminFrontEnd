import { EventModel } from './Event.Model';
import { ScreenModel } from './Screen.Model';
import { UserVModel } from './users/UserV.Model';
import { AccessRightVModel } from './roles/AccessRightV.Model';
import { ScreenVPermission } from './ScreenPermissionV.Model';

export class SessionModel {
    user: UserVModel;
    sessionId: string;
    accessToken: string;
    mapboxAccessKey?:string;
    events: Array<EventModel>;
    screens: Array<ScreenModel>;
    accessRights: Array<ScreenVPermission>;

}