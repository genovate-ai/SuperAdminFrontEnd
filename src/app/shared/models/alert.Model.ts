export class AlertModel {
    type: AlertType;
    message: string;
    header: HeaderType;
    isUserExplicitEvent? = null;
    progress? = null;
}
export enum AlertType {
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    DANGER = "danger",
    PRIMARY = "primary",
    SECONDARY = "secondary",
    LIGHT = "light",
    DARK = "dark",
    UPLOAD ="upload"
}

export enum HeaderType {
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    ERROR = "Error",
    PRIMARY = "primary",
    SECONDARY = "secondary",
    LIGHT = "light",
    DARK = "dark"
}
