import React from "react";
import fetchIntercept from "fetch-intercept";

import { AuthContext, AuthContextProps } from "./AuthContext";

/**
 * @public
 */
export const useAuth = (): AuthContextProps => {
    const context = React.useContext(AuthContext);

    if (!context) {
        throw new Error("AuthProvider context is undefined, please verify you are calling useAuth() as child of a <AuthProvider> component.");
    }

    if(context?.isAuthenticated)
    {
        fetchIntercept.register({
            request: function(url, defaultConfig) {
                if(defaultConfig == undefined)
                {
                    const config = defaultConfig || {};
                    config.headers = config.headers || {};
            
                    config.headers['Authorization'] = "Bearer " + context.user?.access_token ;
                    config.headers['Content-Type'] = "application/json" ;
                    return [url, config];
            
                }else{
                    defaultConfig.headers['Authorization'] = "Bearer " + context.user?.access_token ;
                    defaultConfig.headers['Content-Type'] = "application/json" ;
                    return [url, defaultConfig];
                }
            }
        });
    }

    return context;
};
