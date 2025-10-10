enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

enum GenderEnum {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

enum ProviderEnum {
  GOOGLE = "google",
  FACEBOOK = "facebook",
  LOCAL = "local",
}

enum OtpTypesEnum {
  SIGNUP = "SIGNUP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PHONE_VERIFICATION = "PHONE_VERIFICATION",
}

enum PaymentMethodsEnum {
  CREDIT_CARD = "credit_card",
  PAYPAL = "paypal",
  CASH = "cash",
}

enum PaymentGatewaysEnum {
  STRIPE = "stripe",
  PAYPAL = "paypal",
  MOLTO = "molto",
}

export { RoleEnum, GenderEnum, ProviderEnum, OtpTypesEnum, PaymentMethodsEnum, PaymentGatewaysEnum };
