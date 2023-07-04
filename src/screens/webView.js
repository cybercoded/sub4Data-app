import React from "react";
import WebView from "react-native-webview";
import Spinner from "react-native-loading-spinner-overlay";


export const WebViewComponent = ({route, navigation}) => {
    const { url } = route.params;
  
    return(
        <>
            <WebView
                source={{
                    uri: url
                }}
                onLoadStart={() => {
                    <Spinner visible={true} />
                }}
                onLoadEnd={() => {
                    <Spinner visible={false} />
                }}
                onStartShouldSetResponder={() => true }
            />
        </>
    )
};