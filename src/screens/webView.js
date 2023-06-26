import React from "react";
import WebView from "react-native-webview";
import { Loader, styles } from "../components/global";
import { View } from "react-native";
import { dummies } from "../components/dummies";
import { Context } from "../components/userContext";

export const WebViewComponent = ({route, navigation}) => {
    const { url } = route.params;
    const { valueState, valueDispatch } = React.useContext(Context);

    return(
        <>
            <WebView
                source={{
                    uri: url
                }}
                onLoadStart={() => {
                    valueDispatch({ loader: { ...dummies.modalProcess.loading } })
                }}
                onLoadEnd={() => {
                    valueDispatch({ loader: { ...dummies.modalProcess.hide } })
                }}
                onStartShouldSetResponder={() => true }
            />
            <Loader
                handler={() => valueDispatch({ loader: { ...dummies.modalProcess.hide } })}
                props={valueState.loader}
            />
        </>
    )
};