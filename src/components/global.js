import { View, StyleSheet, Modal, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Card, Dialog, Divider, Icon, ListItem, Image, Text, Overlay } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import { dummies } from './dummies';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation, useNavigationState, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';


export const BASE_URL = 'https://sub4data.com.ng/laravel/'

export const API_URL = 'http://tommytop.atwebpages.com/'

export const LOCAL_API = 'http://localhost/tommytop/handle/jsons/'

export const theme = {
	colors: {
		primary: 'turquoise',
		white: '#fff',
		grey: '#f1f1f1',
		dim: 'rgb(105, 105, 105)',
		dimmer: 'rgba(230, 231, 233, 0.8)',
		red: 'red'
	}
};

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
		config.baseURL = BASE_URL+"api/v1/";
		config.headers.post['Content-Type'] = 'application/json';
		config.headers.post['Accept'] = 'application/json';
		config.withCredentials = true;
    	const token = JSON.parse(await AsyncStorage.getItem('auth_token'));
    	config.headers.Authorization = token ? `Bearer ${token}` : '';
		
		return config;
	},

	error =>  Promise.reject(error)
);

API.interceptors.response.use(
	function (response) {
		return response;
	},
	function (error) {
		// Alert.alert(error.message)
		
		return Promise.reject(error);
	}
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

export const ErrorResponse = ({data}) => {
	return (
		Object.entries(data).map(([key,value], index) => (
			<Text key={index}>{value}</Text>
		))
	);
};


export const Loader = ({ props, handler, handleWarning, handleRetry }) => {
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
			<Dialog.Title title={props.title} titleStyle={{textAlign: 'center', color: props.color}} />
			<Text style={{textAlign: 'center'}}>{props.text}</Text>
			{props.actions && (
				<Dialog.Actions>
					{props.title == 'Error' && handleRetry && (
						<Dialog.Button
							onPress={handleRetry}
							title="Retry"
							style={{marginRight: 35}}
						/>
					)}
					{props.title == 'Warning' && (
						<Dialog.Button
							onPress={handleWarning}
							title= "Continue"
							style={{marginRight: 35}}
						/>
					)}
					{handler && (
						<Dialog.Button
							onPress={handler}
							title="Close"
							style={{marginRight: 35}}
						/>
					)}
				</Dialog.Actions>
			)}
		</Dialog>
	)
};

export const ScrollViewHeader = (props) => {
	
	return (
		<View style={{width: '100%', alignItems: 'center'}}>
			<Image
				style={{width: 80, height: 80, alignSelf: 'center'}}
				resizeMode="contain"
				source={props.image}
				PlaceholderContent={<ActivityIndicator />}
			/>
				<Card.Title>{props.title}</Card.Title>
				<Text style={{textAlign: 'center'}}>{props.subTitle}</Text>
		</View>
	);
};

export const ReferencePreviewer = ({referenceScreenIsVisible, setReferenceScreenIsVisible, singleTransaction}) => {
	const windowWidth = Dimensions.get('window').width;
	return (
		<Overlay isVisible={referenceScreenIsVisible} onBackdropPress={setReferenceScreenIsVisible}>
			<View style={{height: 500, width: windowWidth - 50, padding: 20, borderRadius: 10}}>
				<View>
					<View style={styles.transactionTableList}>
						<Text>Refernce</Text>
						<Text>{singleTransaction.reference}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Name</Text>
						<Text>{singleTransaction.user?.name}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Amount</Text>
						<Text>{singleTransaction.amount}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Product</Text>
						<Text>{singleTransaction.product?.name}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Service</Text>
						<Text>{singleTransaction.service?.name}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Description</Text>
						<Text>{singleTransaction.description}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Status</Text>
						<Text>{singleTransaction.status}</Text>
					</View>
					<View style={styles.transactionTableList}>
						<Text style={{fontWeight: 'bold'}}>Date</Text>
						<Text>{singleTransaction.created_at}</Text>
					</View>
				
				</View>
				<Dialog.Actions>
					<Dialog.Button
						title="Close"
						onPress={setReferenceScreenIsVisible}
						style={{marginRight: 35}}
					/>
				</Dialog.Actions>
			</View>
		</Overlay>
	)
};

export const MyDatePicker = ({setData, setFieldValue}) => {
	const [dateFromArray, setDateFromArray] = React.useState({
        day: 0,
        month: 0,
        year: 0
    });
	const yearHistory = () => {
        const currentYear = new Date().getFullYear();
        const years = [
            currentYear,
            currentYear-1,
            currentYear-2,
            currentYear-3,
            currentYear-4,
            currentYear-5,
            currentYear-6,
            currentYear-7,
            currentYear-8,
            currentYear-9
        ];
        return years;
    };

	useEffect(() => {
	
		let formatedDate = Object.keys(dateFromArray).map(function (val, index) {
			return dateFromArray[val]
		}).join('-');

		setData(formatedDate);
		setFieldValue();
	
	}, [dateFromArray.day, dateFromArray.month, dateFromArray.year]);
	
	return (
		<View style={{flex: 1, flexDirection: 'row'}}>
			<Picker
				style={{width: 70, marginRight: 2, height: 50}}
				mode='dropdown'
				onValueChange={(itemValue) => {
					setDateFromArray( {...dateFromArray, day: itemValue});
				}}
			>
				<Picker.Item value="" label="Day"/>
				{ [...Array(31)].map((item, index) => (
					<Picker.Item key={index} value={String(index+1).padStart(2, '0')} label={String(index+1).padStart(2, '0')}/>
				))}
			</Picker>
			<Picker
				style={{width: 70, marginRight: 2, height: 50}}
				mode='dropdown'
				onValueChange={(itemValue) => {
					setDateFromArray({...dateFromArray, month: itemValue})
				}}
			>
				<Picker.Item value="" label="Month"/>
				{ [...Array(12)].map((item, index) => (
					<Picker.Item key={index} value={String(index+1).padStart(2, '0')} label={String(index+1).padStart(2, '0')}/>
				))}
			</Picker>
			<Picker
				style={{width: 70, marginRight: 2, height: 50}}
				mode='dropdown'
				onValueChange={(itemValue) => {
					setDateFromArray({...dateFromArray, year: itemValue})
				}}
			>
				<Picker.Item value="" label="Year"/>
				{
					yearHistory().map((item, index) => (
					<Picker.Item key={index} value={item} label={item}/>
				))}
			</Picker>
		</View>
	)
}

export const GoBackIcon = () => {
	const navigation = useNavigation();
	return (
		<Icon name="keyboard-backspace" style={{marginLeft: 20}} color={theme.colors.white} size={40} onPress={() => navigation.goBack(null) } />
	)
};
export const MenuView = () => {
	const navigation = useNavigation();
	return (
		<DrawerContentScrollView>
			<View style={{paddingVertical: 40, backgroundColor: theme.colors.primary}}>
				<Image source={dummies.images.icon} style={{width: 100, height: 100, alignSelf: 'center'}} />
			</View>
			{  dummies.menus.map((item, index) => (
				<ListItem
					key={index}
					Component={TouchableOpacity}
					bottomDivider={true}
					onPress={ () => navigation.navigate(item.page, {slug: item.service}) }
				>
					<Icon color={theme.colors.primary} size={40} name={item.icon} />
					<ListItem.Content>
						<ListItem.Title>{item.text}</ListItem.Title>
					</ListItem.Content>
					<ListItem.Chevron size={40} />
				</ListItem>
			))}
		</DrawerContentScrollView>
	);
};

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 50,
		paddingHorizontal: 20,
		width: '100%'
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
		width: '100%'
	},

	transactionTableList: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 1,
		flexBasis: 50,
		alignItems: 'center',
		borderBottomColor: theme.colors.dimmer
	},

	productListStyle: {
		paddingVertical: 20,
		paddingHorizontal: 10,
		marginBottom: 10,  
		shadowOpacity: 0.55,
		borderWidth: 1,
		borderRadius: 5,
		shadowRadius: 3.1,                                    
		elevation: 10,
		shadowColor: theme.colors.dimmer,
		shadowOffset: {width: 3,height: 3}
	},

	rowFlex: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	
	rowFlexBasis: {
		flex: 1,
		flexDirection: 'row',
		flexBasis: 50,
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

	ScrollViewHeaderImgae: {
		height: 100,
		width: 100,
		resizeMode: 'contain'
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
	}
})
