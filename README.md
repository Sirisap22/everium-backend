# **Everium API Documentation**
## **Endpoints**
 - [STATIC] **@GET** `/uploads`
 - `/auth`
    - **@POST** `/register` T
    - **@POST** `/authenticate` T
    - **@POST** `/verify-email` T
    - **@POST** `/forgot-password` T
    - **@POST** `/reset-password` T
    - **@POST** `/change-password` - ***Required Auth*** T
    - **@POST** `/refresh-token` - ***Required Auth*** T
    - **@POST** `/revoke-token` - ***Required Auth*** T
- `/real-estates`
    - **@GET** T // averageStar filter ใช้ไม่ได้เพราะเป็น virtual property
    - **@GET** `/:id` T
    - **@POST** `/:id/reviews` - ***Required Auth*** T
    - **@DELETE** `/:id/reviews` - ***Required Auth*** T
- `/posts`
    - **@GET** `/draft` - ***Required Auth (Seller)*** T
    - **@POST** `/draft` - ***Required Auth (Seller)*** T
    - **@GET** `/draft/:id` - ***Required Auth (Seller)*** T
    - **@PATCH** `/draft/:id` - ***Required Auth (Seller)*** T
    - **@DELETE** `/draft/:id` - ***Required Auth (Seller)*** T
    - **@GET** `/publish` T
    - **@POST** `/publish` - ***Required Auth (Seller)*** T
    - **@GET** `/publish/:id` T
    - **@PATCH** `/publish/:id` - ***Required Auth (Seller)*** T
    - **@DELETE** `/publish/:id` - ***Required Auth (Seller)*** T
    - **@GET** `/suspend` - ***Required Auth (Seller)*** T
    - **@GET** `/suspend/:id` - ***Required Auth (Seller)*** T
    - **@DELETE** `/suspend/:id` - ***Required Auth (Seller)*** T
    - **@GET** `/popular-publish` T
    - **@GET** `/promote-pulish/:id` - ***Required Auth(Seller)*** T
- `/users` - ***Required Auth*** 
    - **@GET** T
    - **@PATCH** T
    - **@POST** `/verify-seller` T
    - [STATIC] **@GET** `/private` - ***(Admin)*** T
- `/admin` - ***Required Auth (Admin)*** 
    - **@GET** `/seller-candidates` T
    - **@GET** `/users` T // เพิ่ม limt และ filter
    - **@GET** `/users/:id` T
    - **@PATCH** `/users/:id` T
    - **@DELETE** `/users/:id` T
    - **@GET** `/posts` T // เพิ่ม limt และ filter
    - **@GET** `/posts/:id` T
    - **@PATCH** `/posts/:id` T
    - **@DELETE** `/posts/:id` T
- `/packages` - ***Required Auth (Seller)*** 
    - **@POST** `/purchase` T
- `/email`
    - **@POST** `/contact-staff` T


------------------------------
## **Auth**
#### **@POST** `/register`
 - Response http status code 201 if email was successfully sent.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|username|string|Alias for the user.
|email|string|Email that used in sign up and it will be use to sign in.
|password|string|Password of an account. A password need to be at least 8 characters long and maximun 20 characters long and it has to have at least 1 upper case character, 1 lower case character and 1 number or 1 special symbol.
#### **@POST** `/verify-email`
 - Return http status code 200 if verification email has successfully verified.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|verificationToken|string|token string in the email that send from `/verify-email`.
#### **@POST** `/forgot-password`
 - Return http status code 200 if reset password email has successfully sent.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|email|string|Email that used in register.
#### **@POST** `/reset-password`
 - Return http status code 200 if the password was successfully reset.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|resetToken|string|token string in the email that send from `forgot-password`.
|password|string|Password of an account. A password need to be at least 8 characters long and maximun 20 characters long and it has to have at least 1 upper case character, 1 lower case character and 1 number or 1 special symbol.
#### **@POST** `/refresh-token`
 - Return http status code 200 if the access token was successfully refreshed.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|refreshToken|string|refresh token that return from `/authenticate`.
#### **@POST** `/revoke-token`
 - Return http status code 200 if the refresh token was successfully forced to be expired.
#### **Parameters**
|Field|Data Type|Description|
|-----|---------|-----------|
|refreshToken|string|refresh token that return from `/authenticate`.

-----------------------------
## **Command Line**
Start a server with hot reloading.
```
npm run dev
```
