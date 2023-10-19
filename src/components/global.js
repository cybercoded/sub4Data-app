import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions} from 'react-native'
import React from 'react'
import { Card, Icon, ListItem, Image, Text } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { dummies } from './dummies';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

export const BASE_URL = 'http://localhost:8000/';
export const theme = {
	colors: {
		primary: 'turquoise',
		secondary: 'red',
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
};

export const ErrorResponse = ({data}) => {
	return (
		Object.entries(data).map(([key,value], index) => (
			<Text key={index}>{value}</Text>
		))
	);
};

export const SearchHighlighter = ({values, value}) => {
    let replacedText = values.replace(value, `|${value}|`);
    let splitText =  replacedText.replace(value, `|${value}|`).split('|');
    return ( splitText.map((text, i) => (
      <Text key={i} style={{fontWeight: text == value ? 'bold': null}}>
        {text}
      </Text>
    )));
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
			<View style={{paddingVertical: 40, backgroundColor: theme.colors.primary, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
				<Image source={dummies.images.icon} style={{width: 100, height: 100}} resizeMode='contain' />
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

	shadowLists: {
		marginBottom: 10,  
		shadowOpacity: 0.55,
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
		height: 15,
		width: 15,
		borderRadius: 50,
		backgroundColor: theme.colors.white,
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
