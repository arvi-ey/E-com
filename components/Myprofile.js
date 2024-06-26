import 'react-native-gesture-handler';
import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, SafeAreaView, Platform, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { colors } from './Theme';
import { MaterialCommunityIcons, MaterialIcons, Feather, AntDesign } from '@expo/vector-icons';
import Button from '../common/Button';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from './Context/Authprovider';
import { Font } from '../common/font';
const { height, width } = Dimensions.get('window');

const Myprofile = () => {
    const { user } = useContext(AuthContext)
    const Navigation = useNavigation();
    const size = 24;
    const color = user.dark_mode ? colors.CHAT_DESC_DARK : colors.CHAT_DESC;
    const [image, setImage] = useState(null);
    const profileListData = [
        {
            icon: <MaterialCommunityIcons name="key-outline" size={size} color={color} />,
            name: "Account",
            info: "Security, Notifications, info"
        },
        {
            icon: <MaterialCommunityIcons name="lock-outline" size={size} color={color} />,
            name: "Privacy",
            info: "Block Contacts, personal info"
        },
        {
            icon: <MaterialIcons name="chat" size={size} color={color} />,
            name: "Chats",
            info: "Theme, Wallpaper, Chat History"
        },
        {
            icon: <Feather name="database" size={size} color={color} />,
            name: "Storage and data",
            info: "Network use, autodownload"
        },
        {
            icon: <MaterialIcons name="language" size={size} color={color} />,
            name: "App language",
            info: "English(device's language)"
        },
        {
            icon: <Feather name="help-circle" size={size} color={color} />,
            name: "Help",
            info: "Help center, contact us, privacy policy"
        },
        {
            icon: <AntDesign name="logout" size={size} color={colors.ERROR_TEXT} />,
            name: "Log out",
        }
    ];

    const Profilelist = ({ item }) => {
        const LogOut = async () => {
            try {
                await SecureStore.deleteItemAsync("token");
                Navigation.replace("Signin");
            }
            catch (err) {
                console.log(err);
            }
        };
        const ListClick = (value) => {
            if (value === "Log out") LogOut();
        };
        return (
            <TouchableOpacity activeOpacity={0.5} style={styles.menuContainer} onPress={() => ListClick(item.name)}>
                <View style={{ marginLeft: 15 }}>
                    {item?.icon}
                </View>
                <View>
                    <Text style={{ fontSize: 20, fontFamily: Font.Regular, color: item.name === 'Log out' ? colors.ERROR_TEXT : user.dark_mode ? colors.CHAT_DESC_DARK : colors.CHARCOLE }}>{item?.name}</Text>
                    {item?.info ? <Text style={{ color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: Font.Regular }}>{item?.info}</Text> : null}
                </View>
            </TouchableOpacity>
        );
    };



    return (

        <SafeAreaView style={[styles.profileContainer, { backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE }]}>
            <View style={{ backgroundColor: user.dark_mode ? colors.BLACK : colors.WHITE, alignItems: "center", gap: 8 }}>
                <View style={{ position: "relative" }}>
                    <Image source={{ uri: image }} height={160} width={160} style={{ borderRadius: 80, borderWidth: 1, borderColor: colors.MAIN_COLOR }} />
                </View>
                <View style={styles.nameContainer}>
                    <Text style={{ fontSize: 25, fontFamily: Font.Bold, color: user.dark_mode ? colors.WHITE : colors.BLACK }}>{user.name}</Text>
                    <Text style={{ color: user.dark_mode ? colors.CHARCOLE_DARK : colors.CHAT_DESC, fontFamily: Font.Regular }}>{user.email}</Text>
                </View>
                <Button
                    title="Edit profile"
                    textStyle={styles.editProfileButton}
                    buttonStyle={styles.buttonStyle}
                    activeOpacity={0.8}
                    press={() => Navigation.navigate('Editprofile')}
                />
            </View>
            <FlatList
                data={profileListData}
                renderItem={Profilelist}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index}
            />
        </SafeAreaView>

    );
};

export default Myprofile;

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: Platform.OS === 'android' ? 50 : 0
    },
    nameContainer: {
        width: width - 20,
        alignItems: "center"
    },
    editIcon: {
        backgroundColor: colors.MAIN_COLOR,
        position: "absolute",
        bottom: 10,
        right: 10,
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    editProfileButton: {
        color: colors.WHITE,
        fontSize: 18,
        fontFamily: "Ubuntu-Medium"
    },
    buttonStyle: {
        backgroundColor: colors.MAIN_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        width: "40%",
        justifyContent: "center",
        alignItems: "center"
    },
    menuContainer: {
        width: width - 20,
        height: 50,
        alignItems: "center",
        flexDirection: "row",
        gap: 20,
        marginTop: 12
    },
    contentContainer: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.WHITE,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 50
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16
    },
    mediaContainer: {
        backgroundColor: colors.SECONDARY_COLOR,
        borderRadius: 12,
        padding: 10
    }
});
