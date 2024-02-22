import React from 'react';
import { IDoctor, IPatient, IHospital } from '../common/Interfaces';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, View, Text, Dimensions } from 'react-native';
import { Stack } from '@mui/material';

const config = { dependencies: { 'linear-gradient': LinearGradient } };
const screenWidth = Dimensions.get('window').height;
const titleSize = screenWidth * 0.035;
const textSize = screenWidth * 0.025;

export const SideQuoteInfo = ({
	quote_number,
	doctor,
	patient,
	procedure,
	hospital,
	total
}: {
	quote_number?: string;
	doctor: IDoctor;
	patient?: IPatient;
	procedure?: string;
	hospital?: IHospital;
	total?: string;
}) => {
	return (
		<SafeAreaView style={{ flex: 1, zIndex: 1000, paddingLeft: '8%' }}>
			<View
				style={{
					flex: 1,
					backgroundColor: 'transparent'
				}}>
				<Stack direction={'column'} style={{ width: '85%' }} spacing={1}>
					{quote_number !== undefined && quote_number !== '' && (
						<View style={{ marginLeft: '10%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Cotización</Text>
							<Text style={{ fontSize: textSize, color: 'white', fontWeight: 'bold' }}>
								{quote_number.toUpperCase()}
							</Text>
						</View>
					)}

					{doctor && (
						<View style={{ marginLeft: '10%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Médico:</Text>
							<Text style={{ color: 'white', fontSize: textSize, fontWeight: 'bold' }}>
								{doctor.names.toUpperCase()} {doctor.first_surname.toUpperCase()} {doctor.second_surname.toUpperCase()}
							</Text>
							<Text style={{ color: 'white', fontSize: textSize }}>{doctor.speciality}</Text>
						</View>
					)}

					{hospital !== undefined && (
						<View style={{ marginLeft: '10%', maxWidth: '85%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Hospital:</Text>
							<Text style={{ color: 'white', fontSize: textSize }}>{hospital.display_name}</Text>
						</View>
					)}

					{patient !== undefined && (
						<View style={{ marginLeft: '10%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Paciente:</Text>
							<Text style={{ color: 'white', fontSize: textSize }}>
								{patient.names.toUpperCase()} {patient.first_surname.toUpperCase()}{' '}
								{patient.second_surname.toUpperCase()}
							</Text>
						</View>
					)}

					{procedure !== undefined && procedure !== '' && (
						<View style={{ marginLeft: '10%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Procedimiento:</Text>
							<Text style={{ color: 'white', fontSize: textSize }}>{procedure}</Text>
						</View>
					)}

					{total !== undefined && total !== '' && (
						<View style={{ marginLeft: '10%' }}>
							<Text style={{ fontSize: titleSize, color: 'white', fontWeight: 'bold' }}>Total:</Text>
							<Text style={{ fontSize: textSize, color: 'white', fontWeight: 'bold' }}>{total}</Text>
							<Text style={{ fontSize: textSize, color: 'white', fontWeight: 'bold' }}>*IVA incluido</Text>
						</View>
					)}
				</Stack>
			</View>
		</SafeAreaView>
	);
};
