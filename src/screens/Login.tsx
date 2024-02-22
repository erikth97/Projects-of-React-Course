import * as React from "react";
import { useState, useEffect, useContext } from "react";
import * as WebBrowser from "expo-web-browser";
import Stack from "@mui/material/Stack";
import { StyleSheet, Image, Platform, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import querystring from "qs";
import * as COMMON from "../common/config";
// import { ROUTES } from "../common/routes";
// import { MSALSecrets } from "../common/Interfaces";
// import { SECURE_STORAGE, STORAGE } from "../common/storage_keys";
import { ROUTES, MSALSecrets, SECURE_STORAGE, STORAGE } from "../common/index"
import { AppContext } from "../context/AppContext";
import { LoginButton } from "../components/CustomLoginButton";

export const LoginT = ({ navigation }: { navigation: any }) => {
  WebBrowser.maybeCompleteAuthSession();
  const { setEmail, setNames } = useContext(AppContext);
  const [loginButtonColor, setLoginButtonColor] = useState<string>("#fff");
  const [loginEnabled, setLoginEnabled] = useState<boolean>(false);

  useEffect(() => {
    checkSavedTokens();
  }, []);

  const checkSavedTokens = async () => {
    let refresh_token: string | null = null;
    if (Platform.OS !== "web") {
      refresh_token = await SecureStore.getItemAsync(SECURE_STORAGE.REFRESH_TOKEN);
    } else {
      refresh_token = await AsyncStorage.getItem(SECURE_STORAGE.REFRESH_TOKEN);
    }

    const result = await AsyncStorage.multiGet([
      STORAGE.EXPIRATION_DATA,
      STORAGE.ACCESS_TOKEN,
      STORAGE.NAMES,
      STORAGE.EMAIL,
      STORAGE.CLIENT_ID,
      STORAGE.TENANT_ID,
      STORAGE.SCOPES,
    ]);
    const expirationDateStr = result[0][1];
    const access_token = result[1][1];
    const names = result[2][1] || "";
    const email = result[3][1] || "";
    const clientId = result[4][1] || "";
    const tenantId = result[5][1] || "";
    const scopes = result[6][1] || "";

    if (expirationDateStr && access_token && refresh_token) {
      const expirationDate = new Date(parseInt(expirationDateStr));
      let expires_in = expirationDate.getTime() - new Date().getTime();
      expires_in = expires_in / 1000;

      if (expires_in < 60 * 5) {
        requestRefreshToken(refresh_token, scopes, clientId, tenantId);
      } else {
        setNames(names);
        setEmail(email);
        navigation.navigate(ROUTES.HOME);
      }
    }
  };

  const requestRefreshToken = (refresh_token: string, scopes: string, clientId: string, tenantId: string) => {
    axios
      .post(
        `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
        querystring.stringify({
          scope: scopes,
          client_id: clientId,
          grant_type: "refresh_token",
          refresh_token,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) validateAppPermissions(res.data as MSALSecrets, scopes, clientId, tenantId);
      });
  };

  const validateAppPermissions = (
    { access_token, refresh_token, expires_in }: MSALSecrets,
    scopes: string,
    clientId: string,
    tenantId: string
  ) => {
    axios
      .post(COMMON.GEN_URL(`/authorize`), {
        access_token: access_token,
      })
      .then((res) => {
        if (res.data && res.data.id !== null) {
          saveUserData(
            access_token,
            refresh_token,
            expires_in,
            res.data.names,
            res.data.email,
            scopes,
            clientId,
            tenantId
          );
          navigation.navigate(ROUTES.HOME);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveUserData = async (
    access_token: string,
    refresh_token: string,
    expires: number,
    names: string,
    email: string,
    scopes: string,
    clientId: string,
    tenantId: string
  ) => {
    if (Platform.OS !== "web") {
      SecureStore.setItemAsync(SECURE_STORAGE.REFRESH_TOKEN, refresh_token);
    } else {
      AsyncStorage.setItem(SECURE_STORAGE.REFRESH_TOKEN, refresh_token);
    }

    AsyncStorage.multiSet([
      [STORAGE.EXPIRATION_DATA, String(new Date().getTime() + expires * 1000)],
      [STORAGE.ACCESS_TOKEN, access_token],
      [STORAGE.NAMES, names],
      [STORAGE.EMAIL, email],
      [STORAGE.TENANT_ID, tenantId],
      [STORAGE.CLIENT_ID, clientId],
      [STORAGE.SCOPES, scopes],
    ]);
    setNames(names);
    setEmail(email);
  };

  return (
    <LinearGradient colors={["#671E75", "#A12CB8"]} style={{ minHeight: "100%" }}>
      <Image style={styles.imageLogin} source={require("../assets/logo-sistema-blanco.png")} />
      <View style={styles.button}>
        <Text style={{ color: "white", fontWeight: "700", fontSize: 64, textAlign: "center" }}>Bienvenido</Text>
        <Stack direction="column" alignSelf={"center"} spacing={2} style={{ marginTop: "10%", marginBottom: "2%" }}>
          <LoginButton
            name="CHRISTUS MUGUERZA"
            loginEnabled={loginEnabled}
            loginButtonColor={loginButtonColor}
            clientId={COMMON.CLIENT_MUGUERZA_ID}
            tenantId={COMMON.TENANT_MUGUERZA_ID}
            setLoginEnabled={(enabled: boolean) => setLoginEnabled(enabled)}
            validateAppPermissions={(res, scopes, clientId, tenantId) =>
              validateAppPermissions(res, scopes, clientId, tenantId)
            }
          />
          <LoginButton
            name="CHRISTUS CEI"
            loginEnabled={loginEnabled}
            loginButtonColor={loginButtonColor}
            clientId={COMMON.CLIENT_CEI_ID}
            tenantId={COMMON.TENANT_CEI_ID}
            setLoginEnabled={(enabled: boolean) => setLoginEnabled(enabled)}
            validateAppPermissions={(res, scopes, clientId, tenantId) =>
              validateAppPermissions(res, scopes, clientId, tenantId)
            }
          />
        </Stack>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#671E75",
    width: "35%",
    height: "50%",
    paddingBottom: "3%",
    alignSelf: "center",
    borderRadius: 15,
    flexDirection: "column",
    justifyContent: "center",
  },

  imageLogin: {
    marginVertical: "2%",
    alignSelf: "center",
    height: "20vh",
    width: "20vw",
    resizeMode: "contain",
  },
});
