import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Alert } from 'react-native';



export const AuthContext = createContext({});

export default AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [user, setuser] = useState({})

    useEffect(() => {
        GetUSerOnce()
    }, [])


    const EditUser = async (data) => {
        const differences = Object.keys(data).filter(key => data[key] !== user[key]);
        if (differences.length > 0) {
            const formData = new FormData();
            differences.forEach(key => {
                if (key === 'profile_image' && data[key]) {
                    const localUri = data[key];
                    const filename = localUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename);
                    const type = match ? `image/${match[1]}` : `image`;

                    formData.append('profile_image', {
                        uri: localUri,
                        name: filename,
                        type: type,
                    });
                } else {
                    formData.append(key, data[key]);
                }
            });
            setLoading(true);
            try {
                const response = await axios.patch(`http://192.168.29.222:5000/edituser/${user._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data === "This email already exists") {
                    Alert.alert(response.data);
                    setLoading(false);
                    return;
                }
                setuser({ ...user, ...response.data });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("Make Changes to Update");
        }
    };


    const GetUSerOnce = async () => {
        const token = await GetToken();
        if (token) {
            try {
                const response = await axios.get('http://192.168.29.222:5000/getUser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setuser(response.data.user);
            } catch (error) {
                if (error.response) {
                    console.log("Response data:", error.response.data);
                    console.log("Response status:", error.response.status);
                    console.log("Response headers:", error.response.headers);
                } else if (error.request) {
                    console.log("Request data:", error.request);
                } else {
                    console.log("Error message:", error.message);
                }
                console.log("Message happening", error.message);
            }
        } else {
            console.log("Token is not set yet, Go to login");
            return;
        }
    };


    const GetToken = async () => {
        try {
            const token = await SecureStore.getItemAsync("token")
            return token ? token : null
        }
        catch (e) {
            console.error(e.message)
            return null
        }
    }




    const SignIn = async (data, Navigation) => {
        setLoading(true)
        try {
            const response = await axios.post('http://192.168.29.222:5000/signin', data)
            if (response.data === "Email dosen't exist") Alert.alert(response.data)
            else if (response.data === "Password is incorrect") Alert.alert(response.data)
            else {
                await SecureStore.setItemAsync("token", response.data.token)
                const { name, email, _id, number } = response.data.user
                setuser({ _id, name, email, number })
                Navigation.replace("Profile")
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    const CreateUser = async (data, Navigation) => {
        try {
            setLoading(true);
            const response = await axios.post('http://192.168.29.222:5000/createuser', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data === "Email already exists") {
                Alert.alert("Email already exists")
                setLoading(false)
                return
            }
            else if (response.data === "Mobile number already exists") {
                Alert.alert("Mobile number already exists")
                setLoading(false)
                return
            } else {
                setTimeout(() => {
                    setLoading(false);
                    Navigation.goBack()
                }, 900);
            }

        } catch (error) {
            console.error('Error:', error);
            setLoading(false);
            Alert.alert('Error', 'Failed to create user');
        }
    };

    const value = { loading, setuser, SignIn, user, CreateUser, GetUSerOnce, EditUser, }
    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    )

}
