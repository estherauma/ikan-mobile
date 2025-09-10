export enum PageEventNames {
    privacyPolicy = 'page_privacy_policy',
    termsOfUse = 'page_terms_of_use',
    profile = 'page_profile',

    // agents pages
    createAgent = 'page_create_agent',
    viewAgent = 'page_view_agent',
    listAgent = 'page_agent_list',

    // Auth pages
    login = 'page_login',
    forgotPassword = 'page_forgot_password',
    createPassword = 'page_create_password',
    howToSignUp = 'page_how_to_signup',
    inviteCode = 'page_invite_code',
    loginMethods = 'page_login_methods',
    passwordReset = 'page_password_reset',
    passwordResetSuccess = 'page_password_reset_success',
    register = 'page_register',
    registerSuccess = 'page_register_success',
    requestPasswordReset = 'page_request_password_reset',
    signup = 'page_signup',
    loginMethod = 'page_login_method',

    // companies
    createCompany = 'page_company_create',
    listCompany = 'page_company_list',
    viewCompany = 'page_company_list',

    // contracts
    createContract = 'page_contract_create',
    listContracts = 'page_contract_list',
    viewContracts = 'page_contract_view',

    // contract clauses
    createClause = 'page_clause_create',
    createClauseDetails = 'page_clause_create_details',
    viewClause = 'page_clause_view',

    // dashboards
    viewBuyerDashboard = 'page_buyer_dashboard',
    viewIndonesianDashboard = 'page_indonesian_dashboard',
    viewTaiwaneseDashboard = 'page_taiwanese_dashboard',
    viewVesselOwnerDashboard = 'page_vessel_owner_dashboard',
    viewWorkerDashboard = 'page_worker_dashboard',
    viewPublicDashboard = 'page_public_dashboard',

    // get help
    viewGetHelp = 'page_get_help',

    // language
    changeLanguage = 'page_change_language',

    // learninghub

    // vessels
    createVessel = 'page_vessel_create',
    createVessel2 = 'page_vessel_create_2',
    listVessels = 'page_vessel_list',
    viewVessel = 'page_vessel_view',

    // workers
    createWorker = 'page_worker_create',
    createWorkerDetails = 'page_worker_create_details',
    listWorkers = 'page_worker_list',
    viewWorker = 'page_worker_view',

    // worker details
    // these pages below aren't being used
    workerDocs = 'page_worker_docs',
    workerInfo = 'page_worker_info',
    workerPayment = 'page_worker_payment',
    workerPlacement = 'page_worker_placement',
    workerTraining = 'page_worker_training',

    // worker profile pages
    workerProfileinfo = 'page_worker_profile_info',
    workerProfilePayments = 'page_worker_profile_payments',

    // learning hub
    learningHubHome = 'page_learning_hub_home',
    tfaVideo = 'page_tfa_video',

    // Consent Forms
    viewConsentForm = 'page_view_consent_form',

    // Payments
    viewPayments = 'page_payments_home',
    viewVesselPayments = 'page_vessel_payments',
    viewPaymentDetails = 'page_payment_details',

    // Welcome screens/ tutorials
    viewWelcomeScreens = 'page_welcome_screens',
    viewAppTutotrials = 'page_app_tutorials',

    // My documents
    viewMyDocuments = 'page_my_documents',
}

export enum AppEventNames {
    // TFA video
    cancelTrainingVideo = 'cancel_training_video',
    submitTrainingVideo = 'submit_training_video_resp',

    // Consent Forms
    acceptedConsentFormConditions = 'accepted_consent_form_conditions',
    rejectedConsentFormConditions = 'rejected_consent_form_conditions',

    // Welcome screens
    seenWelcomeScreens = 'seen_welcome_screens',
    skippedWelcomeScreens = 'skipped_welcome_screens',
    skippedAppTutorials = 'skipped_app_tutorials',
    seenAppTutorials = 'seen_app_tutorials',
}
