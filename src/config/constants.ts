
export class Constants {
  public static readonly UNAUTHORIZED_CODE = 401;
  public static readonly NOT_FOUND_CODE = 404;
  public static readonly SUCCESS_CODE = 200;
  public static readonly CREATE_SUCCESS_CODE = 201;
  public static readonly NO_CONTENT_SUCCESS = 204;
  public static readonly USER_EXISTS = 409;
  public static readonly INTERNAL_SERVER_ERROR_CODE = 500;
  public static readonly FAIL_CODE = 400;
  public static readonly FORBIDDEN_CODE = 403;
  public static readonly REQUIRED_FIELD = 460;
  public static readonly INVALID_FIELD = 470;
  public static readonly OTP_EXPIRE = 471;
  public static readonly MIN_AGE_MIN = 472;
  public static readonly PASSWORD_POLICY = 473;
  public static readonly ID_IS_REGISTERED = 474;
  public static readonly BLOCKED = 475;
  public static readonly TIMEZONE = "Asia/Kolkata";
  public static readonly SUCCESS = "SUCCESS";
  public static readonly ERROR = "ERROR";
  public static readonly BAD_DATA = "BAD_DATA";
  public static readonly BACKEND_API_FAILURE = "BACKEND_API_FAILURE";
  public static readonly CODE = "CODE";
  public static readonly APPROVED = "APPROVED";
  public static readonly INVALID_REQUEST = "INVALID_REQUEST";
  public static readonly IMAGE_MIMES = ["image/jpeg", "image/jpg", "image/png"];
  public static readonly IMAGE_TYPES = [".jpeg", ".jpg", ".png"];
  public static readonly UPLOAD_FOLDER = "uploads";
  public static readonly FILE_TYPES = { IMAGE: "img", DOCUMENT: "doc", VIDEO: "vid" };
  public static readonly THUMB_TYPES = { SMALL: "small", MEDIUM: "medium", LARGE: "large" };
  public static readonly VIDEO_MIMES = ["video/mp4", "video/quicktime"];
  public static readonly IMAGE_TYPE_UNDEFINED = "GENERAL";
  public static readonly DATE_TIME_FORMAT = "YYYY-MM-DD hh:mm:ss";
  public static readonly DATE_FORMAT = "YYYY-MM-DD";
  public static readonly RECORDS_PER_PAGE = 15;
  public static readonly PASSWORD_HASH = 12;
  public static readonly RANDOM_ID_COUNT = 3;
  public static readonly HEX = "hex";
  public static readonly MD5 = "md5";

  public static ELK_LOGGER_MODULE = "Configurator";
  public static readonly logLevels = {
    0: "verbose",
    1: "warn",
    2: "info",
    3: "http",
    4: "error",
    5: "debug",
    6: "silly",
  };
  public static readonly ASTERISK = '*****';
}
