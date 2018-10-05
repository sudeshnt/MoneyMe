export class AppConfig {

  // dev-local
  // public static API_URL = 'http://192.168.1.200:8990/api';
  // public static NOTIFICATION_API_URL = 'http://192.168.1.200:8991/api';

  // dev-public
  public static API_URL = 'http://124.43.16.202:8990/api';
  public static NOTIFICATION_API_URL = 'http://124.43.16.202:8991/api';

  // UAT
  // public static API_URL = 'http://13.250.219.239:81/api';
  // public static NOTIFICATION_API_URL = 'http://13.250.219.239:82/api';

  public static UserApplicationId = "MUTMLCLNTAPP";

  public static clientPrefix = "C";

  public static APP_STAGES = {
    "BEGIN" : {
      ID : 1
    },
    "FIRST_LOAN_CREATED" : {
      ID : 2
    },
    "REGISTRATION_SUCCESSFUL" : {
      ID : 3
    }
  };

  public static CHANNELS = {
    "MOBILE" : {
      "ID" : 2
    }
  };

  public static AUTH_OPTIONS = {
    "DEFAULT" : {
      "ID" : 1
    },
    "FB" : {
      "ID" : 2
    },
    "G_PLUS" : {
      "ID" : 3
    }
  };

  public static DOC_TYPES = {
    "SELFIE" : {
      "ID" : 1,
      "TITLE" : "UPLOAD_SELFIE",
      "SAMPLE_NAME" : "PhotoSampleUrl",
      "IMAGE_ARRAY_NAME" : "Photos"
    },
    "NIC" : {
      "ID" : 2,
      "TITLE" : "UPLOAD_ID_OR_PASSPORT",
      "SAMPLE_NAME" : "NICSampleUrl",
      "IMAGE_ARRAY_NAME" : "NICs"
    },
    "BANK_STATEMENT" : {
      "ID" : 3,
      "TITLE" : "UPLOAD_BANK_STATEMENT",
      "SAMPLE_NAME" : "BSSampleUrl",
      "IMAGE_ARRAY_NAME" : "BankStatements"
    },
    "UTILITY_BILL" : {
      "ID" : 4,
      "TITLE" : "UPLOAD_UTILITY_BILL",
      "SAMPLE_NAME" : "UBSampleUrl",
      "IMAGE_ARRAY_NAME" : "UtilityBills"
    },
  };

  public static DOC_CONTENT_TYPE = {
    "IMAGE" : 1,
    "DOCUMENT" : 2
  };

  public static MEETING_ADDRESS = {
    "HOME" : {
      "ID" : 1,
      "NAME" : "HOME"
    },
    "COMPANY" :  {
      "ID" : 2,
      "NAME" : "COMPANY"
    }
  };

  public static MEETING_TIME_OPTIONS = {
    "DATE_TIME" : {
      "ID" : 0,
      "NAME" : "DATE_AND_TIME"
    },
    "ASAP" :  {
      "ID" : 1,
      "NAME" : "ASAP"
    },
    "FLEXIBLE" :  {
      "ID" : 2,
      "NAME" : "FLEXIBLE"
    }
  };

  public static SalaryStatuses = {
    "Success" : 1,
    "LessThanMinSalaryAmount" : -1
  };

  public static LoanAmountStatuses = {
    "Success" : 1,
    "LessThanMinLoanAmount" : -1,
    "GreaterThanMaxLoanAmount" : -2,
    "LessThanMinLoanPercentage": -3,
    "GreaterThanMaxLoanPercentage" : -4
  };

  public static SalaryDayStatuses = {
    "Success" : 1,
    "FewDaysToSalaryDay" : -1,
    "FewDaysFastSalaryDay" : -2
  };


  public static ReferralStatuses = {
    "Success" : 1,
    "InvalidCode" : -1
  };

  public static DefaultResponseStatuses = {
    "Success" : 1,
    "DetailError" : 0,
    "RecordAlreadyExist" : -1,
    "CodeAlreadyExist" : -2,
    "NameAlreadyExist" : -3,

    //registration
    "LoginNameAlreadyExist" : -4,
    "EmailAlreadyExist" : -11,
    "IdentificationNoAlreadyExist" : -5,

    "CurrentPasswordNotMatched" : -6,
    "ConfirmPasswordNotMatched" : -7,
    "ChangePasswordSameAsCurrent" : -8,

    "EmployeeNoAlreadyExist" : -9,

    "TotalPercentageValueMismatch" : -10,

    //mobile verification
    "VerificationCodeWrong" : -12,

    "Unknown" : -999
  };

  public static AuthStatuses = {
    // authentication is successful - sessionId available
    "Success" : 1,
    "MobileValidationPending" : 10,
    "InstitutionSelectionPending" : 12,// DocumentUploadPending
    "LoanSignatureInfoPending" : 13,
    "AdditionalDetailsPending" : 14,
    // authentication unsuccessful
    "WrongCredentials" : 2,
    "WrongPassword" : 3,
    "AccountLocked" : 4,
    "AccountPending" : 5,
    "AccountSuspended" : 6,
    "InvalidChannel" : 7,
    "WrongAuthenticationOption" : 11,
    "Unknown" : -999
  };

  public static GeneralStatuses = {
    "PENDING" : 1,
    "APPROVED" : 2,
    "SUSPENDED" : 3,
    "LOKED" : 4,
    "CREATING" : 5,
    "PARTIALLY_COMPLETED" : 6,
    "FAILED" : 7,
    "REQUESTED" : 8,
    "COMPLETED" : 9,
    "REJECTED" : 10,
    "UPLOADED" : 11,
    "ELIGIBLE" : 12,
    "VERIFIED" : 13,
    "IN_PROGRESS" : 14,
    "SIGNED" : 15,
    "PARTIALLY_SETTLED" : 16,
    "SETTLED" : 17,
    "CLOSED" : 18,
    "ATTENDED" : 19,
    "CONVERSATION_STARTED" : 20,
    "NOT_ELIGIBLE" : 21,
    "SUCCESSFUL_APPLICATION" : 22,
    "CUSTOMER_NOT_INTERESTED" : 23,
    "CUSTOMER_NOT_CONTACTABLE" : 24
  };

  public static LoanRequestStatuses = {
    "Success" : 1,
    "PendingLoanExist" : -13,
  };

  public static LoanRequestUpdateModes={
    "InstitutionUpdate" : 1,
      "AdditionalDetailsUpdate" : 2
  };

}



