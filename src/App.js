import React, { useEffect } from 'react';
import { useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAccount } from "@azure/msal-react";
import { loginRequest } from './authConfig';
import Main from './components/Main';

export default function App() {
    const { instance, accounts } = useMsal();
    const account = useAccount(accounts?.[0] || {});

    useEffect(() => {
        instance.loginRedirect().catch(e => {
      //      console.log(e);
        })
    }, []);

    const handleLogout = () => {
      instance.logoutRedirect({ account: account});
    };

    return (
        <div>
            <AuthenticatedTemplate>
                <Main logOut={handleLogout}/>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <div style={{textAlign: 'center', fontSize: '24px'}}>Redirecting...</div>
            </UnauthenticatedTemplate>
        </div>

    );
}