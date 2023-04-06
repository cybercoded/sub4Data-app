import { BASE_URL, theme } from "./global";

export const dummies = {
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
      image: require('../assets/mtn-img.jpg'),
      text: "Direct Bank",
    },
    {
      id: 2,
      isCurrent: false,
      image: require('../assets/airtel-img.jpg'),
      text: "Bank Transfer",
    },
    {
      id: 3,
      isCurrent: false,
      image: require('../assets/glo-img.jpg'),
      text: "USSD Transfer",
    },
    {
      id: 4,
      isCurrent: false,
      image: require('../assets/9mobile-img.jpg'),
      text: "Debit Card",
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
      actions: false,
      color: theme.colors.primary,
    },
    error: {
      visible: true,
      icon: "highlight-off",
      text: "Error",
      actions: true,
      color: "red",
    },
    loading: {
      visible: true,
      icon: "loader",
      text: "Please wait",
      color: theme.colors.primary,
      actions: false,
    },
    hide: {
      visible: false,
      icon: "loader",
      text: "Please wait",
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
        network: "mtn",
        iconName: require('../assets/mtn-img.jpg'),
      },
      {
        id: 2,
        icon: false,
        network: "airtel",
        iconName: require('../assets/airtel-img.jpg'),
      },
      {
        id: 3,
        icon: false,
        network: "glo",
        iconName: require('../assets/glo-img.jpg'),
      },
      {
        id: 4,
        icon: false,
        network: "9mobile",
        iconName: require('../assets/9mobile-img.jpg'),
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
        text: "Ikeja Electric Paymentt - IKEDC",
        iconName: `${BASE_URL}img/ikedc-img.jpg`,
      },
      {
        id: 2,
        icon: false,
        service: "ekedc",
        text: "Eko Electric Payment - EKEDC",
        iconName: `${BASE_URL}img/ekedc-img.jpg`,
      },
      {
        id: 3,
        icon: false,
        service: "aedc",
        text: "Abuja Electricity Distibution Company - AEDC",
        iconName: `${BASE_URL}img/aedc-img.jpg`,
      },
      {
        id: 4,
        icon: false,
        service: "kedco",
        text: "Kano Electric - KEDCO",
        iconName: `${BASE_URL}img/kedco-img.jpg`,
      },
      {
        id: 5,
        icon: false,
        service: "phed",
        text: "Port Harcourt Electric - PHED",
        iconName: `${BASE_URL}img/phed-img.jpg`,
      },
      {
        id: 6,
        icon: false,
        service: "jedc",
        text: "Jos Electric - JED",
        iconName: `${BASE_URL}img/jedc-img.jpg`,
      },
      {
        id: 7,
        icon: false,
        service: "kaed",
        text: "Kaduna Electric - KAEDCO",
        iconName: `${BASE_URL}img/kaed-img.jpg`,
      },
      {
        id: 8,
        icon: false,
        service: "ibed",
        text: "Ibadan Electricity Distibution Company - IBEDC",
        iconName: `${BASE_URL}img/ibed-img.jpg`,
      },
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
    ],
  },

  images: {
    networks: {
      mtn: require('../assets/mtn-img.jpg'),
      glo: require('../assets/glo-img.jpg'),
      '9mobile': require('../assets/9mobile-img.jpg'),
      airtel: require('../assets/airtel-img.jpg'),
      icon: require('../assets/icon.png'),
    }
  }
};
