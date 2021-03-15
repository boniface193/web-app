import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import index from "@/views/index.vue";
import pageNotFound from "@/components/pageNotFound.vue";
// onboarding pages
import Signup from "@/components/onboarding/Signup.vue";
import Signin from "@/components/onboarding/Signin.vue";
import signupTeamMember from "@/components/onboarding/signupTeamMember.vue";
import Recoverpassword from "@/components/onboarding/Recoverpassword.vue";
import Forgotpassword from "@/components/onboarding/Forgotpassword.vue";
import Onboarding from "@/views/onboarding/Onboarding.vue";
// dashboard page
import Dashboard from "@/views/mainDashboard/Dashboard.vue";
import Home from "@/views/layout/home.vue";
import emailVerification from "@/components/onboarding/emailVerification.vue";
import forgotPasswordVerification from "@/components/onboarding/forgotPasswordVerification.vue";

// inventory pages
import Inventory from "@/views/authPages/Inventory.vue";
import inventoryHistory from "@/components/inventory/inventoryHistory.vue";
import inventoryPage from "@/components/inventory/inventoryPage.vue";
import addProduct from "@/components/inventory/addProduct.vue";
import editProduct from "@/components/inventory/editProduct.vue";
import productDetails from "@/components/inventory/productDetails.vue";
import productList from "@/components/inventory/productList.vue";
// settings pages
import Settings from "../views/authPages/Settings.vue";
import userDetails from "@/components/settings/userDetails.vue";
import team from "@/components/settings/team.vue";
import teamDetails from "@/components/settings/teamDetails.vue";
import teamInvite from "@/components/settings/teamInvite.vue";
import editTeamMember from "@/components/settings/editTeamMember.vue";
import storeDetails from "@/components/settings/storeDetails.vue";
import privacyDetails from "@/components/settings/privacyDetails.vue";
import logout from "@/components/settings/logout.vue";
// withdrawal pages
import WithdrawalPage from "@/components/settings/WithdrawalPage.vue";
import WithdrawFund from "@/components/withdrawalPages/WithdrawFund.vue";
import AddBankDetails from "@/components/withdrawalPages/AddBankDetails.vue";
import EditBankDetails from '@/components/withdrawalPages/EditBankDetails.vue';
// Leaderboard pages
import Leaderboard from "@/components/leaderboard/Leaderboard.vue";
// seller pages
import bestSeller from "@/views/authPages/BestSeller.vue";
import Sellers from "@/views/authPages/Seller.vue";
import allSeller from "@/components/dashboard/allSeller.vue";
import newSeller from "@/components/dashboard/newSeller.vue";
import returningSeller from "@/components/dashboard/returningSeller.vue";
import sellersCard from "@/components/dashboard/sellersCard.vue";
import mainSellers from "@/components/dashboard/mainSellers.vue";
// orders pages
import Orders from "@/views/authPages/Orders.vue";
import ordersPage from "@/components/order/ordersPage.vue";
import orderDetails from "@/components/order/orderDetails";
// customer pages
import customers from "@/views/authPages/Customers.vue";
import mainCustomer from "@/components/dashboard/customerMain.vue";
import allCustomer from "@/components/dashboard/allCustomer.vue";
import newCustomer from "@/components/dashboard/newCustomer.vue";
import returningCustomer from "@/components/dashboard/returningCustomer.vue";
import customerDetails from "@/components/dashboard/customerDetails.vue";
// balance pages
import Balance from "@/views/authPages/Balance.vue";
import Revenue from "@/components/balancePages/Revenue.vue";
import Settlements from "@/components/balancePages/Settlements.vue";
import AwaitingSettlements from "@/components/balancePages/AwaitingSettlements.vue";
import PaymentHistory from "@/components/balancePages/PaymentHistory.vue";

Vue.use(VueRouter);

// requirement for user to log on to the authenticated pages
const ifAuthenticated = (to, from, next) => {
  store.commit("onboarding/tokenIsPresent");
  if (store.getters["onboarding/tokenIsPresent"] === true) {
    store.dispatch("onboarding/getUserProfile").then((response) => {
      const profile = response.data.data;
      if (profile.email_verified) {
        if (profile.status) {
          store.commit("onboarding/setTokenExpired");
          if (store.getters["onboarding/tokenExpired"] === false) {
            next()
            return
          } else {
            localStorage.removeItem("accessToken");
            next({ name: 'Signin' });
          }
        } else {
          store.commit("onboarding/loggedIn", false);
          next({ name: "SuspensionPage" })
        }
      } else {
        next({
          name: 'Emailverification', params: {
            email: profile.email,
          },
        });
      }
    }).catch((error) => {
      if (error.response) {
        localStorage.removeItem("accessToken");
        next({ name: "Signin" })
      }
    })
  } else {
    next({ name: 'Signin' });
  }
}

// verify if access has been given to a user to view email verification page
const ifAccessEmailVerifcationPage = (to, from, next) => {
  if (from.name === "Signup" || from.name === "Signin") {
    next()
    return
  }
  next({ name: 'Signup' })
}
// verify if access has been given to a user to view password verification page
const ifAccessForgotPasswordVerificationPage = (to, from, next) => {
  if (from.name === "Forgotpassword") {
    next()
    return
  }
  next({ name: 'Forgotpassword' })
}

// verify if access has been given to a user to view password recovery page
const ifAccessPasswordRecoveryPage = (to, from, next) => {
  if (from.name === "forgotPasswordVerification") {
    next()
    return
  }
  next({ name: 'Forgotpassword' })
}

// verify that the user is already logged
const AlreadyLogin = (to, from, next) => {
  if (to.name === 'signupTeamMember') {
    next();
  } else {
    if (localStorage.getItem("accessToken")) {
      next({ name: 'dashboard' })
    } else {
      next();
      return
    }
  }
}

// allow a user to edit account only when comming from the withdrawal page
const allowEditBankAccount = (to, from, next) => {
  if (from.name === "WithdrawFund") {
    next();
    return
  } else {
    next({ name: "WithdrawFund" });
  }
}

const routes = [
  {
    path: "/",
    name: "index",
    component: index
  },
  {//layout dashboard and children
    path: "/dashboard",
    component: Home,
    beforeEnter: ifAuthenticated,
    children: [
      {
        path: "",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "bestSeller",
        name: "bestSeller",
        component: bestSeller
      },
      {
        path: "/inventory",
        component: Inventory,
        children: [
          {
            path: "",
            name: "inventoryPage",
            component: inventoryPage
          },
          {
            path: "history",
            name: "inventoryHistory",
            component: inventoryHistory
          },
          {
            path: "add-product",
            name: "addProduct",
            component: addProduct
          },
          {
            path: "edit-product/:id",
            name: "editProduct",
            component: editProduct
          },
          {
            path: ":id",
            name: "productDetails",
            component: productDetails,
            props: true
          },
          {
            path: "import-product-list",
            name: "productList",
            component: productList
          }
        ]
      },
      {
        path: "/leaderboard",
        name: "leaderboard",
        component: Leaderboard,
        
      },
      {
        path: "/orders",
        component: Orders,
        children: [
          {
            path: "",
            name: "Orders",
            component: ordersPage
          },
          {
            path: ":id",
            name: "OrderDetails",
            component: orderDetails,
            props: true
          }
        ]
      },
      {
        path: "/balance",
        component: Balance,
        children: [
          {
            path: "",
            name: "Revenue",
            component: Revenue
          },
          {
            path: "settlements",
            name: "Settlements",
            component: Settlements
          },
          {
            path: "awaiting-settlements",
            name: "AwaitingSettlements",
            component: AwaitingSettlements
          },
          {
            path: "payment-history",
            name: "PaymentHistory",
            component: PaymentHistory
          },
        ]
      },
      {
        path: "/customers",
        component: customers,
        children: [
          {
            path: "",
            component: mainCustomer,
            children: [
              {
                path: "",
                name: "allCustomer",
                component: allCustomer
              },
              {
                path: "newCustomer",
                name: "newCustomer",
                component: newCustomer
              },
              {
                path: "returningCustomer",
                name: "returningCustomer",
                component: returningCustomer
              },
            ]
          },
          {
            path: ":id",
            name: "customerDetail",
            component: customerDetails,
            props: true
          }
        ]
      },
      {
        path: "/seller",
        component: Sellers,
        children: [
          {
            path: "",
            component: mainSellers,
            children: [
              {
                path: "",
                name: "all",
                component: allSeller
              },
              {
                path: "new",
                name: "new",
                component: newSeller
              },
              {
                path: "returning",
                name: "returning",
                component: returningSeller
              },
            ]
          },
          {
            path: ":id",
            name: "seller",
            component: sellersCard,
            props: true
          },
        ]
      },
      {
        path: "/settings",
        component: Settings,
        children: [
          {
            path: "",
            name: "store",
            component: storeDetails
          },
          {
            path: "user",
            name: "user",
            component: userDetails
          },
          {
            path: "team",
            component: team,
            children: [
              {
                path: "",
                name: "teamDetails",
                component: teamDetails
              },
              {
                path: "invite",
                name: "teamInvite",
                component: teamInvite
              },
              {
                path: "edit/:id",
                name: "editTeamMember",
                component: editTeamMember,
                props: true
              }
            ]
          },
          {
            path: "",
            component: WithdrawalPage,
            children: [
              {
                path: "add-account",
                name: "AddBankDetails",
                component: AddBankDetails
              },
              {
                path: "withdraw-fund",
                name: "WithdrawFund",
                component: WithdrawFund
              },
              {
                path: "change-account",
                name: "EditBankDetails",
                component: EditBankDetails,
                beforeEnter: allowEditBankAccount
              }
            ]
          },
          {
            path: "privacy",
            name: "privacy",
            component: privacyDetails
          },
          {
            path: "logout",
            name: "logout",
            component: logout
          }
        ]
      },
    ]
  },

  {  // onboarding routes
    path: '/signup', component: Onboarding,
    beforeEnter: AlreadyLogin,
    children: [
      {
        path: "",
        name: "Signup",
        component: Signup,
      },
      {
        path: "/signin",
        name: "Signin",
        component: Signin,
      },
      {
        path: "/recoverpassword",
        name: "Recoverpassword",
        component: Recoverpassword,
        beforeEnter: ifAccessPasswordRecoveryPage,
        props: true
      },
      {
        path: "/forgotpassword",
        name: "Forgotpassword",
        component: Forgotpassword,
      },
      {
        path: "/emailverification",
        name: "emailVerification",
        component: emailVerification,
        beforeEnter: ifAccessEmailVerifcationPage,
        props: true
      },
      {
        path: "/verifypassword",
        name: "forgotPasswordVerification",
        component: forgotPasswordVerification,
        beforeEnter: ifAccessForgotPasswordVerificationPage,
        props: true,
      },
      {
        path: "team-member/:email",
        name: "signupTeamMember",
        component: signupTeamMember,
        props: true,
      },
    ],
  },
  {
    path: "*",
    component: pageNotFound
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
