import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ROUTES } from '../common/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { SECURE_STORAGE, STORAGE } from '../common/storage_keys';
import { Platform, View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

const config = { dependencies: { 'linear-gradient': LinearGradient } };

export const HomeTest = ({ navigation }: { navigation: any }) => {
	const [newQuoteCard, setNewQuoteCard] = useState<string>('#fff');
	const [quoteListsCard, setQuoteListsCard] = useState<string>('#fff');

	const quoteListsPress = (color: string) => {
		setQuoteListsCard(color);
		openQuoteList();
	};

	const logout = () => {
		navigation.navigate(ROUTES.LOGIN);

		if (Platform.OS !== 'web') {
			SecureStore.deleteItemAsync(SECURE_STORAGE.REFRESH_TOKEN);
		} else {
			AsyncStorage.removeItem(SECURE_STORAGE.REFRESH_TOKEN);
		}

		AsyncStorage.multiRemove([STORAGE.EXPIRATION_DATA, STORAGE.ACCESS_TOKEN, STORAGE.NAMES, STORAGE.EMAIL]);
	};

	const newQuotePress = (color: string) => {
		setNewQuoteCard(color);
		openFindDoctor();
	};

	const openFindDoctor = () => navigation.push(ROUTES.FIND_DOCTOR);
	const openQuoteList = () => navigation.push(ROUTES.QUOTE_LIST);

	return (
		<LinearGradient colors={['#671E75', '#A12CB8']} style={{ minHeight: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: '3%' }}>
				<View style={{ width: '10%' }}></View>
				<Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 36 }}>Cotizador de cirugía</Text>
				<TouchableOpacity onPress={() => logout()} style={styles.botonLogOut}>
					<Text style={{ color: '#FFFFFF', marginTop: '10%' }}>Cerrar sesión</Text>
				</TouchableOpacity>
			</View>

			<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', height: '70%', width: '100%' }}>
				<TouchableOpacity
					onPressOut={() => quoteListsPress('#fff')}
					onPressIn={() => setQuoteListsCard('#C080D4')}
					style={{ height: '100%', width: '35%' }}>
					<View style={styles.button}>
						<View style={{ alignSelf: 'center', marginTop: '8%' }}>
							<Text style={{ fontWeight: 'bold', fontSize: 28 }}>Listado de cotizaciones</Text>
						</View>
						<View style={{ alignSelf: 'center' }}>
							<Image
								source={require('../assets/list_quote.png')}
								accessibilityLabel="Quote list"
								style={{ width: '25vw', height: '55vh' }}
							/>
						</View>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					onPressOut={() => newQuotePress('#fff')}
					onPressIn={() => setNewQuoteCard('#C080D4')}
					style={{ height: '100%', width: '35%' }}>
					<View style={styles.button}>
						<View style={{ alignSelf: 'center', marginTop: '8%' }}>
							<Text style={{ fontWeight: 'bold', fontSize: 28 }}>Agregar cotización</Text>
						</View>
						<View style={{ marginTop: '3%', alignSelf: 'center' }}>
							<Image
								source={require('../assets/new_quote.png')}
								accessibilityLabel="Quote list"
								style={{ width: '25vw', height: '50vh' }}
							/>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	button: {
		height: '100%',
		width: '100%',
		backgroundColor: '#fff',
		borderRadius: 15
	},

	imageLogin: {
		marginVertical: '2%',
		alignSelf: 'center',
		height: '20vh',
		width: '20vw',
		resizeMode: 'contain'
	},
	botonLogOut: {
		backgroundColor: '#DD163A',
		paddingHorizontal: '2%',
		borderRadius: 3,
		marginRight: '2%',
		height: '80%'
	}
});
