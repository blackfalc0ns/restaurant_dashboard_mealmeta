# MealMate Restaurant Dashboard

لوحة تحكم شركاء المطاعم — Angular 19 + Tailwind CSS v4 + Zard UI.

## التشغيل

```bash
npm install
npm start
```

يفتح على: **http://localhost:4201**

## البناء

```bash
npm run build
```

## المسارات

| المسار | الوصف |
|--------|--------|
| `/restaurant/login` | تسجيل دخول شريك المطعم |
| `/restaurant/forgot-password` | استعادة كلمة المرور |
| `/restaurant/verify-otp` | التحقق من رمز OTP |
| `/restaurant/onboarding` | تسجيل مطعم جديد (6 خطوات) |
| `/restaurant/setup-wizard` | إعداد المطعم (stub) |
| `/restaurant/orders/pending-confirmation` | طلبات بانتظار التأكيد (−72h) |
| `/restaurant/orders/upcoming-24h` | قائمة التحضير (−24h) |

## هيكل المشروع

```text
src/app/
├── core/           # brand, http
├── shared/         # Zard UI components
└── features/
    ├── auth/       # login, forgot-password, verify-otp
    └── restaurant/ # onboarding, orders, setup
```
