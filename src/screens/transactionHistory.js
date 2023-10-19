import { TouchableOpacity, View, ScrollView, FlatList, ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import { Badge, Icon, ListItem, Text, Card } from 'react-native-elements';
import { styles, theme } from '../components/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TransactionFilter from "../components/transactionFilter";
import axios from "axios";
import { closeAlert, showAlert } from "react-native-customisable-alert";

export const TransactionHistory = ({navigation}) => {
    const [histories, setHistories] = React.useState([]);
    const [referenceScreenIsVisible, setReferenceScreenIsVisible] = React.useState(false);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [isLoadingMoreTextResponse, setIsLoadingMoreTextResponse] = React.useState();
    const [limit, setLimit] = React.useState(10);
    const [singleTransaction, setSingleTransaction] = React.useState([]);
    const scrollRef = React.useRef();
    const windowHeight = Dimensions.get('window').height;

    React.useEffect(() => {
        axios.get(`view-transactions/${limit}`).then((res) => {
            if(res.data.status === 200) {
                setHistories(res.data.data);
            }
            else {
                showAlert({alertType: 'error' , title: 'Error', message: res.data.errors});
            }
        });
    }, []);

    const handleDate = (date) => {
        let dbDate = new Date( Date.parse(date));
        let userDate = dbDate.toUTCString();

        return userDate;
    }

    const handleFetchMore = () => {  
        if (isLoadingMore === false) {
            setIsLoadingMore(true)
            setLimit(limit+10)
            axios.get(`view-transactions/${limit === 10 ? 20 : limit}`).then((res) => {
                if(res.data.status === 200) {
                    setHistories([...res.data.data, ...histories]);
                    scrollRef.current.scrollTo({x: 0, y: 0, animated: true});                  
                    setIsLoadingMore(false)     
                }
                else {
                    setIsLoadingMoreTextResponse(res.data.errors);
                }
            });
        }
    };


    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        const scrollHeight = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

        return scrollHeight;
    };

    const TransactionPreview = ({values}) => (
        <View style={{width: '100%'}}>
            <View style={styles.transactionTableList}>
            <Text style={{fontWeight: 'bold'}}>Reference</Text>
                <Text>{values.reference}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Name</Text>
                <Text>{values.user?.
                name}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Amount</Text>
                <Text>{values.amount}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Product</Text>
                <Text>{values.product?.name}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Service</Text>
                <Text>{values.service?.name}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Description</Text>
                <Text>{values.description}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Status</Text>
                <Text>{values.status}</Text>
            </View>
            <View style={styles.transactionTableList}>
                <Text style={{fontWeight: 'bold'}}>Date</Text>
                <Text>{values.created_at}</Text>
            </View>
        
        </View>
    );

    return (
        <View style={styles.centerContainer}>
            <View style={{width: '100%'}}>
                <ScrollView 
                    ref={scrollRef}
                    style={{height: windowHeight-100}}
                    onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                            handleFetchMore();
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    <ListItem style={{marginBottom: 20}}  onPress={() => {
                        showAlert({ 
                            alertType: 'custom',
                            customAlert: <TransactionFilter /> 
                        }) }} 
                        bottomDivider
                    >
                        <Icon name='search' size={30} />
                        <ListItem.Content>
                            <ListItem.Title>Filter Transactions</ListItem.Title>
                        </ListItem.Content>
                        <MaterialCommunityIcons name='chevron-double-down' size={30} />
                    </ListItem>
                    
                    <FlatList
                            data={histories}
                            ListEmptyComponent={() => <Card>
                                <Card.Title>No transactions found</Card.Title>
                            </Card>} 
                            renderItem={({item, index}) => (
                            <ListItem
                                key={index}
                                Component={TouchableOpacity}
                                bottomDivider={true}
                                containerStyle={styles.productListStyle}
                                onPress={() => {
                                    showAlert({ 
                                        alertType: item.status == 'success' && 'success' || item.status == 'pending' && 'warning' || 'error',
                                        message: <TransactionPreview values={item} /> 
                                    }) 
                                }}
                            >
                                <ListItem.Content>
                                    <ListItem.Title>{item.description}</ListItem.Title>
                                    <ListItem.Subtitle>{handleDate(item.created_at)}</ListItem.Subtitle>
                                </ListItem.Content>
                                <Badge 
                                    value={item.status} 
                                    status={
                                        item.status == 'success' && 'success' 
                                        ||  item.status == 'failed' && 'error' 
                                        || item.status == 'pending' && 'warning'
                                    } 
                                />                       
                            </ListItem>
                        )}
                    />
                    <View style={{flex: 1, alignItems: 'center'}}>
                        { isLoadingMore && 
                            <ActivityIndicator size='large' color={theme.colors.dim} /> 
                        }
                        <Text>
                            {isLoadingMoreTextResponse}
                        </Text>
                    </View>
                    
                </ScrollView>
            </View>
        </View>
    );
};