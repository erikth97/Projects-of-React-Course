import * as React from 'react';
import { useEffect } from 'react';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import Button from '@mui/material/Button';
import axios from 'axios';
import querystring from 'qs';
import { MSALSecrets } from '../common/Interfaces';
import { Platform } from 'react-native';

export const LoginButton = ({
	name,
	clientId,
	tenantId,
	loginButtonColor,
	loginEnabled,
	setLoginEnabled,
	validateAppPermissions
}: {
	name: string;
	clientId: string;
	tenantId: string;
	loginButtonColor: string;
	loginEnabled: boolean;
	setLoginEnabled: (enabled: boolean) => any;
	validateAppPermissions: (res: MSALSecrets, scopes: string, clientId: string, tenantId: string) => any;
}) => {
	const authRequest = {
		clientId,
		scopes: ['openid', 'profile', 'email', 'offline_access'],
		redirectUri: makeRedirectUri({
			scheme: Platform.OS !== 'web' ? 'cotizadorcirugiasmuguerza' : '',
			path: 'auth'
		})
	};

	const onPressButton = () => {
		promptAsync();
	};

	const discovery = useAutoDiscovery(`https://login.microsoftonline.com/${tenantId}/v2.0`);
	const [request, response, promptAsync] = useAuthRequest(authRequest, discovery);

	useEffect(() => setLoginEnabled(request?.codeVerifier !== undefined), [request]);
	useEffect(
		() => (response && response.type === 'success' ? getAuthorizationToken(response.params.code) : () => {}),
		[response]
	);

	const getAuthorizationToken = (code: string) => {
		if (!request) return;
		axios
			.post(
				`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
				querystring.stringify({
					code_verifier: request.codeVerifier || '',
					redirect_uri: request.redirectUri,
					code: code,
					scope: request.scopes?.join(' ') || '',
					client_id: request.clientId,
					grant_type: 'authorization_code'
				}),
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}
			)
			.then((res) => {
				if (res.status === 200)
					validateAppPermissions(res.data as MSALSecrets, request.scopes?.join(' ') || '', clientId, tenantId);
			});
	};

	return (
		<Button
			variant="contained"
			style={{ backgroundColor: loginButtonColor, color: '#671E75', width: '100%', fontSize: 12 }}
			onClick={() => {
				loginEnabled ? onPressButton() : null;
			}}>
			Iniciar Sesión en {name}
		</Button>
	);
};
