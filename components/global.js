import { View, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Dialog, Icon, Image, Text } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { Constants } from 'expo';


export const BASE_URL = 'http://192.168.70.102:19000/localhost/topup-mobile/'

export const API_URL = 'http://tommytop.atwebpages.com/'

export const LOCAL_API = 'http://localhost/tommytop/handle/jsons/'

export const theme = {
	colors: {
		primary: 'turquoise',
		white: '#fff',
		grey: '#f1f1f1',
		dim: 'rgb(105, 105, 105)',
		dimmer: 'rgba(230, 231, 233, 0.8)',
		red: 'red',
	},
}

export const storeData = async (key, value) => {
	try {
		const jsonValue = JSON.stringify(value)
		await AsyncStorage.setItem(key, jsonValue)
	} catch (e) {
		console.log('Storing data error: ', e)
	}
}

export const dimColor = (rgb, percent) => {
	return rgb.replace(')', `, ${percent})`).replace('rgb', 'rgba')
}

export const clearData = async () => {
	AsyncStorage.clear()
}

export const getData = async (key) => {
	try {
		const jsonValue = await AsyncStorage.getItem(key)
		return jsonValue != null ? JSON.parse(jsonValue) : null
	} catch (err) {
		console.error(err)
	}
}

export const API = axios.create();

API.interceptors.request.use(
	async (config) => {
		config.baseURL = JSON.parse(await AsyncStorage.getItem('localURL'))+'/tommytop/handle/';

		return config;
	},

	error => Promise.reject(error)
);

export const PinVerifyPad = ({ allProps }) => {
	const { pinInputText, handleSubmit, setPinInputText, pinInput, pinPadDisability, setPinPadDisability } = allProps
	return (
		<View
			style={{
				backgroundColor: theme.colors.dim,
				padding: 15,
				borderTopStartRadius: 20,
				borderTopEndRadius: 20,
			}}
		>
			<Text style={{ fontSize: 700, textAlign: 'center' }}>Enter your transaction PIN</Text>
			<View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}
				>
					<Button
						containerStyle={{ flex: '22%', margin: 5 }}
						buttonStyle={[styles.button, { height: 60 }]}
						titleStyle={{
							color: theme.colors.white,
							textAlign: 'center',
							fontSize: 700,
							fontSize: 20,
						}}
						title={pinInputText[0] && '*'}
					/>
					<Button
						containerStyle={{ flex: '22%', margin: 5 }}
						buttonStyle={[styles.button, { height: 60 }]}
						titleStyle={{
							color: theme.colors.white,
							textAlign: 'center',
							fontSize: 700,
							fontSize: 20,
						}}
						title={pinInputText[1] && '*'}
					/>
					<Button
						containerStyle={{ flex: '22%', margin: 5 }}
						buttonStyle={[styles.button, { height: 60 }]}
						titleStyle={{
							color: theme.colors.white,
							textAlign: 'center',
							fontSize: 700,
							fontSize: 20,
						}}
						title={pinInputText[2] && '*'}
					/>
					<Button
						containerStyle={{ flex: '22%', margin: 5 }}
						buttonStyle={[styles.button, { height: 60 }]}
						titleStyle={{
							color: theme.colors.white,
							textAlign: 'center',
							fontSize: 700,
							fontSize: 20,
						}}
						title={pinInputText[3] && '*'}
					/>
				</View>
			</View>
			<View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}
				>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(1)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								1
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(2)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								2
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(3)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								3
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(4)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								4
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(5)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								5
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(6)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								6
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(7)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								7
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(8)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								8
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(9)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								9
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}></View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							disabled={pinPadDisability}
							onPress={() => pinInput(0)}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Text
								style={{
									color: theme.colors[pinPadDisability ? 'gray' : 'primary'],
									textAlign: 'center',
									fontSize: 20,
								}}
							>
								0
							</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flex: '30%' }}>
						<TouchableOpacity
							onPress={() => {
								setPinInputText('')
								setPinPadDisability(false)
							}}
							style={[styles.button, { backgroundColor: 'none' }]}
						>
							<Icon name="highlight-off" color={theme.colors.primary} size={35} />
						</TouchableOpacity>
					</View>
				</View>
				<View style={{ alignItems: 'center' }}>
					<Button
						onPress={handleSubmit}
						title="Proceed"
						buttonStyle={styles.button}
						containerStyle={{ width: 100, marginVertical: 20 }}
					/>
				</View>
			</View>
		</View>
	)
};

export const PinPad = () => {
	const numbers = [1,2,3,4,5,6,7,8,9,0];
	const [buttonValues, setButtonValues] = useState(['*','*','*','*']);
	return (
		<View
			style={{
				backgroundColor: theme.colors.dim,
				padding: 15,
				borderTopStartRadius: 20,
				borderTopEndRadius: 20,
			}}
		>
			<Text style={{ textAlign: 'center' }}>
				<Text style={{fontWeight: 'bold'}}> Enter your transaction PIN</Text>
			</Text>
			<View>
				<ButtonGroup
					buttons={buttonValues}
					containerStyle={{height: 100}}
					buttonStyle={[styles.button, { height: 60 }]}
					titleStyle={{
						color: theme.colors.white,
						textAlign: 'center',
						fontSize: 20,
					}}
				/>
			</View>
				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-around',
						flexWrap: 'wrap',
					}}
				>
					{
						numbers.map((number, index) => {
							return(
								<View key={index} style={{flexBasis: '30%'}}>
									<TouchableOpacity style={styles.button}><Text>Hi</Text></TouchableOpacity>
								</View>
							)
						})
					}
				</View>
				<View style={{ alignItems: 'center' }}>
					<Button
						title="Proceed"
						buttonStyle={styles.button}
						containerStyle={{ width: 100, marginVertical: 20 }}
					/>
				</View>
		</View>
	)
};

export const Loader = ({ props, handler, submittion }) => {
	return (
		<Dialog
			isVisible={props.visible}
			onBackdropPress={handler}
		>
			{props.icon === 'loader' ? (
				<ActivityIndicator size={60} color={props.color} />
			) : (
				<Icon name={props.icon} size={60} color={props.color} />
			)}
			<Dialog.Title title={props.text} titleStyle={{textAlign: 'center', color: props.color}} />
			{props.actions && (
				<Dialog.Actions>
					{submittion && (
						<Dialog.Button
							onPress={submittion}
							title="Retry"
						/>
					)}
					{handler && (
						<Dialog.Button
							onPress={handler}
							title="Close"
						/>
					)}
				</Dialog.Actions>
			)}
		</Dialog>
	)
};

export const ScrollViewHeader = (props) => {
	return (
		<Card containerStyle={{borderWidth: 0, elevation: 0, backgroundColor: 'transparent'}}>
			<Card.Image
				style={{width: '100%',height:100}}
				resizeMode="contain"
				source={props.image} 
				PlaceholderContent={<ActivityIndicator />}
			/>
				<Card.Title>{props.title}</Card.Title>
				<Text>{props.subTitle}</Text>
		</Card>
	);
};

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 50,
		paddingHorizontal: 20,
		width: '100%',
		backgroundColor: theme.colors.white,
	},
	menuListStyle: {
		flexBasis: '40%',
		position: 'relative',
		alignItems: 'center',
		margin: 11,
		paddingVertical: 20,
		paddingHorizontal: 10,
		backgroundColor: '#fff',
		borderRadius: 10,
	},

	centerContainer: {
		flex: 1,
		alignItems: 'center',
		padding: 25,
		width: '100%',
		backgroundColor: theme.colors.white,
	},

	rowFlex: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	dots: {
		height: 10,
		width: 10,
		borderRadius: 50,
		backgroundColor: theme.colors.dimmer,
	},

	currentDot: {
		height: 10,
		width: 10,
		borderRadius: 50,
		backgroundColor: theme.colors.primary,
	},

	colomnFlex: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignContent: 'center',
	},

	input: {
		width: '100%',
		paddingHorizontal: 13,
		paddingVertical: 16,
		borderRadius: 10,
		borderBottomWidth: 0,
		backgroundColor: theme.colors.dimmer,
	},

	button: {
		width: '100%',
		borderRadius: 10,
		padding: 16,
	},

	miniButton: {
		borderWidth: 0,
		paddingHorizontal: 5,
		paddingVertical: 3,
		borderRadius: 2,
		fontSize: 15,
	},

	outlineButton: {
		width: '100%',
		borderWidth: 1,
		paddingHorizontal: 13,
		paddingVertical: 18,
		borderRadius: 10,
		marginBottom: 15,
		borderColor: theme.colors.primary,
		color: theme.colors.primary,
	},

	modalCenteredView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	modalView: {
		margin: 20,
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},

	bottomModalCenteredView: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
	},
	bottomModalView: {
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	menuModalCenteredView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		backgroundColor: 'rgba(0, 0, 0, 0.2)',
	},
	menuModalView: {
		backgroundColor: theme.colors.white,
		width: 250,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
})
