import { BASE_URL, theme } from "./global";

export const dummies = {
  images: {
    shared_data_mtn: require('../assets/shared_data_mtn.png'),
    glo_corporate_data: require('../assets/glo_corporate_data.jpg'),
    shared_data_9mobile: require('../assets/shared_data_9mobile.jpg'),
    shared_data_airtel: require('../assets/shared_data_airtel.jpeg'),
    mtn_corporate_data: require('../assets/mtn_corporate_data.png'),

    prepaid_mtn: require('../assets/prepaid_mtn.png'),
    prepaid_airtel: require('../assets/prepaid_airtel.jpg'),
    prepaid_glo: require('../assets/prepaid_glo.jpg'),
    prepaid_9mobile: require('../assets/prepaid_9mobile.png'),
    icon: require('../assets/icon.png')
  },

  menus: [
    { id: 1, icon: "home", text: "Home", page: "Dashboard" },
    { id: 2, icon: "person-outline", text: "My Profile", page: "Profile" },
    {
      id: 3,
      icon: "account-balance-wallet",
      text: "Fund Wallet",
      page: "Service",
      service: "fundWallet",
    },
    {
      id: 4,
      icon: "smartphone",
      text: "Buy Airtime",
      page: "Service",
      service: "networks",
    },
    {
      id: 5,
      icon: "wifi",
      text: "Data Subscriptions",
      page: "Service",
      service: "networks",
    },
    {
      id: 6,
      icon: "signal-cellular-alt",
      text: "Direct Data Subscriptions",
      page: "Service",
      service: "networks",
    },
    {
      id: 7,
      icon: "lightbulb-outline",
      text: "Electricity Bills",
      page: "Service",
      service: "electricity",
    },
    {
      id: 8,
      icon: "connected-tv",
      text: "TV Cables",
      page: "Service",
      service: "cables",
    },
    {
      id: 9,
      icon: "history",
      text: "Transaction History",
      page: "TransactionHistory",
    },
    {
      id: 10,
      icon: "help-outline",
      text: "Frequently asked questions",
      page: "Faq",
    },
    { id: 11, icon: "logout", text: "Logout", page: "Logout" },
  ],

  fundWallet: {
    labels: {
      header: "Found your TommyTop Wallet",
      subHeader:
        "You can fund your account wallet using any of the options below.",
    },
    lists: [
      {
        id: 2,
        icon: true,
        iconName: "logout",
        text: "Bank Transfer",
        page: "BankTransfer",
      },
      {
        id: 3,
        icon: true,
        iconName: "money",
        text: "USSD Transfer",
        page: "Faq",
      },
      { id: 4, icon: true, iconName: "style", text: "Debit Card", page: "Faq" },
    ],
  },

  welcomePageSliders: [
    {
      id: 1,
      isCurrent: true,
      image: require('../assets/laptop.png'),
      text: "We use cutting-edge technology to run our services. Our delivery and wallet funding is automated, any service purchased will get delivered to you instantly.",
    },
    {
      id: 2,
      isCurrent: false,
      image: require('../assets/icon-phone.png'),
      text: "Our platform is a fully optimized platform for reliability and dependability. You get 100% value for any transaction you carry with us.",
    },
    {
      id: 3,
      isCurrent: false,
      image: require('../assets/customer-support.png'),
      text: "Our customer service is just a click away, don't hesitate to consult us on anything as the system is 90% automated. Thus, all transactions are attended to within 5-15mins.",
    },
    {
      id: 4,
      isCurrent: false,
      image: require('../assets/security.png'),
      text: "Your e-wallet is the safest, easiest and fastest means of carrying out transactions with us. Your funds are secured with your e-wallet PIN and can be kept for you for as long as you want.",
    },
  ],

  agent: {
    labels: {
      header: "Become Tommytop Agent",
      subHeader: `Activate to earn commissions on your transactions. Your earnings will be in your earning balance and you can withdraw it to your bank anytime
                    \nAgent Fee[2,000 naira]
                    \nYou only need to make a onetime payment of #2,000 only to upgrade to agent. No subscriptions. Pay once and continue to enjoy all our agent benefits`,
    },
    lists: [
      { id: 1, icon: true, iconName: "upgrade", text: "Activate now" },
      { id: 2, icon: true, iconName: "table-view", text: "View Commissions" },
    ],
  },

  refer: {
    labels: {
      header: "Refer Friends and Earn",
      subHeader: `Refer friends to us and earn commissions on al their transactions. \n\nThere is no limit you keep earning commissions on all their transactions Your referral commisions goes to your earnings balance which you can withdraw to your bank or move to your main wallet to buy something on the platform
                    \n[Referral Benefits]\n\n- Earn 0.2% on every Airtime, Direct Data, Electricity and Education transactions your prospects make\n- You earn 300 naira immediately the person you refer upgrade to agent
                    `,
    },
    lists: [
      { id: 1, icon: true, iconName: "share", text: "Invite friends link now" },
    ],
  },

  modalProcess: {
    success: {
      visible: true,
      icon: "check-circle-outline",
      text: "Successful",
      title: 'Successful',
      actions: false,
      color: theme.colors.primary,
    },
    error: {
      visible: true,
      icon: "highlight-off",
      text: "Error",
      actions: true,
      title: 'Error',
      color: "red",
    },
    loading: {
      visible: true,
      icon: "loader",
      text: "Please wait",
      title: 'Processing',
      color: theme.colors.primary,
      actions: false,
    },
    hide: {
      visible: false,
      icon: "loader",
      text: "Please wait",
      title: 'Closed',
      color: theme.colors.primary,
      actions: false,
    },
  },

  networks: {
    labels: {
      header: "Choose Network",
    },
    lists: [
      {
        id: 1,
        icon: false,
        network: "mtn"
      },
      {
        id: 2,
        icon: false,
        network: "airtel"
      },
      {
        id: 3,
        icon: false,
        network: "glo"
      },
      {
        id: 4,
        icon: false,
        network: "9mobile",
      },
    ],
  },

  electricity: {
    labels: {
      header: "Available Services",
    },
    lists: [
      {
        id: 1,
        icon: false,
        service: "ikedc",
        text: "Ikeja Electric Paymentt - IKEDC"
      },
      {
        id: 2,
        icon: false,
        service: "ekedc",
        text: "Eko Electric Payment - EKEDC"
      },
      {
        id: 3,
        icon: false,
        service: "abuja_distribution_company",
        text: "Abuja Electricity Distibution Company - AEDC"
      },
      {
        id: 4,
        icon: false,
        service: "kano_distribution_company",
        text: "Kano Electric - KEDCO"
      },
      {
        id: 5,
        icon: false,
        service: "phed",
        text: "Port Harcourt Electric - PHED"
      },
      {
        id: 6,
        icon: false,
        service: "jos_distribution_company",
        text: "Jos Electric - JED"
      },
      {
        id: 7,
        icon: false,
        service: "kaduna_distribution_company",
        text: "Kaduna Electric - KAEDCO"
      },
      {
        id: 8,
        icon: false,
        service: "ibadan_distribution_company",
        text: "Ibadan Electricity Distibution Company - IBEDC",
      }
    ],
  },

  dataOPtions: {
    mtn: [
      { id: 1, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 2, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 3, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 4, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 5, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 6, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 7, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 8, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 9, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 10, description: "500MB CD", price: 135, duration: "1 Month" },
    ],
    airtel: [
      { id: 1, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 2, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 3, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 4, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 5, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 6, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 7, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 8, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 9, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 10, description: "500MB CD", price: 135, duration: "1 Month" },
    ],
    glo: [
      { id: 1, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 2, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 3, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 4, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 5, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 6, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 7, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 8, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 9, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 10, description: "500MB CD", price: 135, duration: "1 Month" },
    ],
    "9mobile": [
      { id: 1, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 2, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 3, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 4, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 5, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 6, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 7, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 8, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 9, description: "500MB CD", price: 135, duration: "1 Month" },
      { id: 10, description: "500MB CD", price: 135, duration: "1 Month" },
    ]
  }
};
