import { StyleSheet, Text, View, Dimensions, SafeAreaView, Platform, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
import { colors } from './Theme';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
import axios from 'axios';


const Chatbox = ({ route, navigation }) => {
    const { user } = useContext(AuthContext)
    const ContactDetails = route.params
    const image = "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
    const [messageText, setMassageText] = useState("")




    useEffect(() => {
        getMassage()
    }, [])


    const getMassage = async () => {
        const userId1 = user._id
        const userId2 = ContactDetails._id
        try {
            const response = await axios.get(`http://192.168.29.222:5000/getmassage`, {
                params: { userId1, userId2 }
            });
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    };

    const sendMessage = async () => {
        const sender = user._id
        const recipient = ContactDetails._id
        const content = messageText
        try {
            const response = await axios.post(`http://192.168.29.222:5000/sendmassage`, { sender, recipient, content });
            setMassageText("")
            console.log(response.data)
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    };


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={styles.HeaderStyle} >
                    <TouchableOpacity>
                        <Image source={{ uri: image }}
                            style={{ height: 45, width: 45, borderRadius: 30, resizeMode: "cover" }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: "40%", }} >
                        <Text style={[styles.HeaderTextStyle, { color: user.dark_mode ? colors.WHITE : colors.BLACK }]} >{ContactDetails.saved_name}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', width: "30%", gap: 18, justifyContent: "center" }} >
                        <TouchableOpacity>
                            <Feather name="video" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialIcons name="call" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="dots-vertical" size={28} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                        </TouchableOpacity>

                    </View>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: -2, width: "5%" }} onPress={() => navigation.goBack()} >
                    <Ionicons name="arrow-back-sharp" size={24} color={user.dark_mode ? colors.WHITE : colors.BLACK} />
                </TouchableOpacity>
            ),
            headerTitleStyle: {
                fontFamily: Font.Bold,
                fontSize: 20,
                color: user.dark_mode ? colors.WHITE : colors.BLACK
            },
            headerStyle: {
                backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE,
            },
            headerTintColor: user.dark_mode ? colors.BLACK : colors.WHITE
        });
    }, [navigation, image, user, ContactDetails, colors, Font]);


    const TypeMassage = (text) => {
        setMassageText(text)
    }
    return (
        <View style={[styles.ChatBackGround, { backgroundColor: user.dark_mode ? colors.CHAT_BG_DARK : colors.CHAT_BG }]} >
            <ScrollView inverted={true}></ScrollView>
            <View style={styles.MassageBox} >
                <TextInput
                    autoCapitalize={false}
                    autoCorrect={false}
                    autoFocus={true}
                    scrollEnabled={true}
                    placeholder="Message"
                    value={messageText}
                    multiline={true}
                    onChangeText={TypeMassage}
                    style={[styles.MassageField, { backgroundColor: user.dark_mode ? colors.MASSAGE_BOX_DARK : colors.MASSAGE_BOX, color: user?.dark_mode ? colors.WHITE : colors.BLACK }]}
                    placeholderTextColor={user.dark_mode ? colors.WHITE : colors.CHARCOLE}
                />
                <TouchableOpacity style={styles.emogiIcon}>
                    <FontAwesome6 name="smile-beam" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.AttachMentIcon}>
                    <MaterialIcons name="attach-file" size={24} color={user.dark_mode ? colors.WHITE : colors.CHARCOLE} />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendMessage} style={styles.SendBox} >
                    <MaterialIcons name={messageText.length > 0 ? "send" : "keyboard-voice"} size={24} color={colors.WHITE} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Chatbox

const styles = StyleSheet.create({

    HeaderStyle: {
        width: width,
        marginRight: 200,
        height: 70,
        flexDirection: "row",
        alignItems: 'center',
        gap: 8
    },
    HeaderTextStyle: {
        fontFamily: Font.Medium,
        fontSize: 18,

    },
    ChatBackGround: {
        flex: 1
    },
    MassageBox: {
        // backgroundColor: "white",
        flexDirection: "row",
        width: width - 10,
        alignSelf: 'center',
        alignItems: "center",
        position: 'relative',
        paddingLeft: 5,
        gap: 8,
        marginBottom: 10

    },
    MassageField: {
        padding: 10,
        width: "85%",
        borderRadius: 50,
        fontFamily: Font.Medium,
        paddingLeft: 45,
        fontSize: 15,
    },
    emogiIcon: {
        position: 'absolute',
        left: 15
    },
    AttachMentIcon: {
        position: "absolute",
        right: 80
    },
    SendBox: {
        backgroundColor: colors.MAIN_COLOR,
        padding: 8,
        borderRadius: 50
    }

})