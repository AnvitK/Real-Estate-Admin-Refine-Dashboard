import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  Layout,
  RefineSnackbarProvider,
  notificationProvider,
} from "@refinedev/mui";

import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
  DashboardOutlined,
} from "@mui/icons-material";

import { CssBaseline, GlobalStyles } from "@mui/material";
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { CredentialResponse } from "interfaces/google";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { parseJwt } from "utils/parse-jwt";
import { Header, Title, Sider } from "./components/layout";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { MuiInferencer } from "@refinedev/inferencer/mui";

import {
  Login,
  Home,
  Agents,
  MyProfile,
  PropertyDetails,
  AllProperties,
  CreateProperty,
  AgentProfile,
  EditProperty,
} from "pages";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      // save user to mongoDB
      if (profileObj) {
        const response = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture, 
          })
        })

        const data = await response.json();

        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id
            })
          );
  
          localStorage.setItem("token", `${credential}`);
  
          return {
            success: true,
            redirectTo: "/",
          };
        } else {
          return Promise.reject();
        }
      }

      // if (profileObj) {
      //   localStorage.setItem(
      //     "user",
      //     JSON.stringify({
      //       ...profileObj,
      //       avatar: profileObj.picture,
      //     })
      //   );

      //   localStorage.setItem("token", `${credential}`);

      //   return {
      //     success: true,
      //     redirectTo: "/",
      //   };
      // }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: new Error("Not authenticated"),
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  return (
    <BrowserRouter>
      {/* <GitHubBanner /> */}
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("http://localhost:8080/api/v1")}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    icon: <DashboardOutlined />,
                    label: "Dashboard",
                  },
                },
                {
                  name: "properties",
                  list: AllProperties,
                  show: PropertyDetails,
                  create: CreateProperty,
                  edit: EditProperty,
                  meta: {
                    icon: <VillaOutlined />,
                  },
                },
                {
                  name: "agents",
                  list: Agents,
                  show: AgentProfile,     
                  meta: {
                    icon: <PeopleAltOutlined />,
                  },
                },
                {
                  name: "reviews",
                  list: Home,
                  meta: {
                    icon: <StarOutlineRounded />,
                  },
                },
                {
                  name: "messages",
                  list: Home,
                  meta: {
                    icon: <ChatBubbleOutline />,
                  },
                },
                {
                  name: "my-profile",
                  list: MyProfile,
                  meta: {
                    label: "My Profile",
                    icon: <AccountCircleOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <Layout Header={Header} Title={Title} Sider={Sider}>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route index element={<Home />} />
                  
                  <Route path="properties">
                    <Route index element={<AllProperties />} />
                    <Route path="show/:id" element={<PropertyDetails />} />
                    <Route path="create" element={<CreateProperty />} />
                    <Route path="edit/:id" element={<EditProperty />} />
                  </Route>

                  <Route path="agents">
                    <Route index element={<Agents />} />
                    <Route path="show/:id" element={<AgentProfile />} />
                  </Route>

                  <Route path="reviews" element={<Home />} /> 
                  <Route path="messages" element={<Home />} />
                  
                  <Route path="my-profile" element={<MyProfile />} />
                </Route>

                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>

                <Route
                  element={
                    <Authenticated>
                      <Layout Header={Header} Title={Title} Sider={Sider}>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
