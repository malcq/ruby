module.exports = {
  development: {
    port: '6800',
    secret: 'fusionsecret',
    url: 'http://localhost:6800',
    siteAddress: 'http://localhost:3000',
    crmAddress: 'https://crm.demo.fusion-team.com',
    hashType: 'md5',
    hashKey: 'fusion',
    token_name: 'token',
    conversationId: 'CD1F1A96U',
    conversationInternalId: 'C012UAWH6LT', // internal workspace test channel id
    slackInternalToken: 'xoxb-996726763763-1106050730405-iwZljLOrCVfTbMSSuZYYir8T',
    slackToken: 'xoxb-230105561331-445293275559-14ztpU0wq99z72NwLIsV1aMw',
    codeReviewChannelId: 'CK7E16PME',
    codeReviewTeamChannelId: 'CD1F1A96U',
    CRMChannelId: 'CK8TV6THB',
    learningChannelId: 'CD1F1A96U',
    generalId: 'CD1F1A96U',
    slackBotIconPath: '/public/static/debug_slack.png',
    slackbotUsername: 'Fusion Dev Bot',
    calendarSiteUrl: 'https://buh.ru/calendar/',
    expiresIn: 694800,
    linkpreviewUrl: 'http://api.linkpreview.net/',
    linkpreviewApiKey: '5bb7c97b7412712423e210ece56bfeb607e01ee9210fb',
    vapidPrivateKey: 'JIye0LEW3aVA8IupQ9q_jfiGs_YPVsL5UeUkmJVtJOE',
    vapidpublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidPublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidMail: 'dev@fusion-team.com',
    slackMessages: {
      newAnnouncement: [],
    },
    dbConfig: {
      username: 'fusion',
      password: 'fusion',
      dbName: 'fusion_site',
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false,
    },
    serviceEmail: 'fusion.team.llc@gmail.com',
    servicePassword: '_q1w2e3r4t5_',
  },
  production: {
    port: '6801',
    secret: 'fusionsecret',
    url: 'http://staff.fusion-team.com:6800',
    siteAddress: 'http://staff.fusion-team.com',
    hashType: 'md5',
    hashKey: 'fusion',
    conversationId: 'CCX5GSPSA',
    codeReviewChannelId: 'CK7E16PME',
    codeReviewTeamChannelId: 'CD1F1A96U',
    slackToken: 'xoxb-230105561331-437100489616-TrlHZ7rWrQrydHKPVAu2kWCL',
    slackTokenCRM: 'xoxb-230105561331-692730551778-obdRMHj0M8zjFASI8zqr55oC',
    linkpreviewUrl: 'http://api.linkpreview.net/',
    linkpreviewApiKey: '5bb7c97b7412712423e210ece56bfeb607e01ee9210fb',
    expiresIn: 604800,
    vapidPrivateKey: 'JIye0LEW3aVA8IupQ9q_jfiGs_YPVsL5UeUkmJVtJOE',
    vapidpublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidPublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidMail: 'dev@fusion-team.com',
    /* codeReviewChannelId: 'CK7E16PME',
    codeReviewTeamChannelId: 'CD1F1A96U', */
    slackMessages: {
      newAd: [],
    },
    dbConfig: {
      username: 'alexey',
      password: '123fusion',
      dbName: 'fusion_staff',
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false,
    },
    serviceEmail: 'fusion.team.llc@gmail.com',
    servicePassword: '_q1w2e3r4t5_',
  },
  stage: {
    port: '6801',
    secret: 'fusionsecret',
    url: 'http://staff.fusion-team.com',
    siteAddress: 'http://staff.fusion-team.com',
    crmAddress: 'https://crm.fusion-team.com',
    hashType: 'md5',
    hashKey: 'fusion',
    conversationId: 'CD1F1A96U',
    slackToken: 'xoxb-230105561331-437100489616-TrlHZ7rWrQrydHKPVAu2kWCL',
    slackTokenCRM: 'xoxb-230105561331-692730551778-obdRMHj0M8zjFASI8zqr55oC',
    codeReviewChannelId: 'CK7E16PME',
    codeReviewTeamChannelId: 'CD1F1A96U',
    CRMChannelId: 'CD1F1A96U',
    learningChannelId: 'CD1F1A96U',
    expiresIn: 694800,
    linkpreviewUrl: 'http://api.linkpreview.net/',
    linkpreviewApiKey: '5bb7c97b7412712423e210ece56bfeb607e01ee9210fb',
    vapidPrivateKey: 'JIye0LEW3aVA8IupQ9q_jfiGs_YPVsL5UeUkmJVtJOE',
    vapidpublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidPublicKey: 'BOBddvE-HDYnuCFpCwVVLPZnlnV-YkhpFMPpBgtIXfavHYBuqWRpPvbgnFic7-PNtv1-P6VOxitPFJFeo9E8BdQ',
    vapidMail: 'dev@fusion-team.com',
    slackMessages: {
      newAnnouncement: [],
    },
    dbConfig: {
      username: 'fusion',
      password: '123fusion',
      dbName: 'fusion_staff',
      host: '127.0.0.1',
      dialect: 'postgres',
      logging: false,
    },
    serviceEmail: 'fusion.team.llc@gmail.com',
    servicePassword: '_q1w2e3r4t5_',
  },
};
