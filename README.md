# Horizon - A Financial Dashboard App

Horizon is a financial dashboard application designed to help users manage their finances efficiently. This app allows users to link their bank accounts, monitor real-time transactions, and manage fund transfers in a secure and user-friendly interface. 

## Features

- User authentication and secure login.
- Bank account linking with Plaid.
- Real-time transaction updates.
- Transaction categorization and visualization
- Responsive design.

## Project Setup

### Set Up the AWS Amplify-Access User

1. Run `npm install -g @aws-amplify/cli`. If you encounter permission issues, run `sudo npm install -g @aws-amplify/cli`.
2. Run `amplify configure`. If you run into a permission denied error, try running `sudo chown -R $(whoami):$(id -gn) ~/.amplify`.
3. You will be prompted to sign in to your AWS administrator account. Sign in.
4. Select your region. By default, select `us-east-1`.
5. You will be prompted to create a user in the AWS IAM console. Create it, choose `Attach policies directly` and assign `AdministratorAccess-Amplify` to this user as the permissions policy.
6. Create an access key for this user, which will include the secret access key.
7. Enter the access key and secret access key when prompted.
8. Hit enter to finish the user setup.

### Create a New Amplify Backend

1. In the terminal, from the root of the project, run: `amplify init`.
2. Hit 'Enter' all the way.
3. When asked to select the authentication method, choose `AWS access keys` and enter the credentials created earlier.
4. Select your region, by default, select `us-east-1`.
5. You will be asked, "Help improve Amplify CLI by sharing non-sensitive project configurations on failures?"—this is up to you.
6. Wait for the backend environment to deploy.

### Set Up Amplify Auth

1. In the terminal, from the root of the project, run: `amplify add auth`.
2. Select `Manual configuration`.
3. Select `User Sign-Up, Sign-In, connected with AWS IAM controls`.
4. When asked to provide a friendly name for your resource, hit enter or customize the name if you want.
5. When asked to enter a name for your identity pool, hit enter or customize the name if you want.
6. When asked, "Allow unauthenticated logins?" select `No`.
7. When asked, "Do you want to enable 3rd party authentication providers in your identity pool?" select `No`.
8. When asked to provide a name for your user pool, hit enter or customize the name if you want.
9. When asked how users should sign in, select `Email`.
10. When asked, "Do you want to add User Pool Groups?" select `No`.
11. When asked, "Do you want to add an admin queries API?" select `No`.
12. When asked for multifactor authentication (MFA) user login options, select `OPTIONAL (Individual users can use MFA)`.
13. When asked for user login MFA types, select `Time-Based One-Time Password (TOTP)` and unselect `SMS Text Message`.
14. When asked to specify an SMS authentication message, hit enter (we will not use SMS authentication).
15. When asked for email-based user registration/forgot password, select `Enabled (Requires per-user email entry at registration)`.
16. When asked to specify an email verification subject, hit enter or customize the subject if you want.
17. When asked to specify an email verification message, hit enter or customize the message if you want.
18. When asked, "Do you want to override the default password policy for this User Pool?" enter `y` and hit enter.
19. When asked for the minimum password length, by default it is 8—hit enter.
20. When asked to select password character requirements, select all options.
21. When asked what attributes are required for signing up, select `Email` and `Name`.
22. When asked to specify the app's refresh token expiration period, by default it is 30—hit enter or customize the number if you want.
23. When asked if you want to specify the user attributes this app can read and write, enter `y`, then hit enter. Then select `Email` and `Name`.
24. When asked to specify write attributes, since both `Email` and `Name` are selected by default, just hit enter.
25. When asked, "Do you want to enable any of the following capabilities?" do not select any—just hit enter.
26. When asked if you want to use an OAuth flow, select `No`.
27. When asked if you want to configure Lambda Triggers for Cognito, enter `n` and then hit enter.

### Configure Storage

1. In the terminal, from the root of the project, run: `amplify add storage`.
2. When asked to select a service, select `Content (Images, audio, video, etc.)`.
3. When asked to provide a friendly name for your resource, hit enter or customize the name if you want.
4. When asked to provide a bucket name, hit enter or customize the name if you want.
5. When asked who should have access, select `Auth users only`.
6. When asked what kind of access you want for authenticated users, select all 3 options (create/update, read, delete).
7. When asked if you want to add a Lambda Trigger for your S3 bucket, enter `n` and then hit enter.

### Apply Resources to AWS Using Amplify CLI via CloudFormation

1. In the terminal, from the root of the project, run: `amplify push`.
2. When asked, "Are you sure you want to continue?" enter `y` and then hit enter.

### Apply Resources to AWS Using Terraform

1. Ensure Terraform is correctly installed on your computer.
2. In the terminal, from the root of the project, run: `cd terraform/` to switch to the Terraform folder.
3. Create a new user in the AWS IAM console called `administrator`. Choose `Attach policies directly` and assign `AdministratorAccess` to this user. Create an access key for this user, which will include the secret access key.
4. Open `/terraform/terraform.tfvars`, uncomment both `AWS_ACCESS_KEY_ID` and `AWS_SECRET_KEY`, and replace the values with the credentials you just created.
5. In the terminal, from the `/terraform` directory, run: `terraform apply` and enter `yes` when asked, "Do you want to perform these actions?"
6. Notice that the `.env` file under the project folder has been modified—2 new variables have been appended to the end of the file (`VITE_PLAID_LINK_TOKEN_URL` and `VITE_BANK_ACCOUNT_OPERATION_URL`).

### Run the Project

1. In the terminal, from the root of the project, run: `npm install`.
2. Run: `npm run dev`.
3. The app should be running at `http://localhost:3000/`.
4. Enjoy!

## Addtional documents
Both the infrastructure diagram and presentation slides are placed under `/documents`.

## License

This project is open-source and licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
