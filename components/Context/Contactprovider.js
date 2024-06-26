import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './Authprovider';
import { Alert } from 'react-native';

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
    const { user, GetUSerOnce } = useContext(AuthContext);
    const [savedContact, setSavedContact] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        GetUSerOnce()
    }, [])
    useEffect(() => {
        if (user) setSavedContact(user.saved_contact)
    }, [user])
    useEffect(() => {
        fetchContact()
    }, [savedContact])

    const fetchContact = async () => {
        let userData = []
        if (savedContact) {
            for (let i = 0; i < savedContact.length; i++) {
                let id = savedContact[i].id
                let saved_name = savedContact[i].saved_name
                try {
                    const result = await axios.get(`http://192.168.29.222:5000/getContacts/${id}`)
                    userData.push({ ...result.data, saved_name: saved_name })
                }
                catch (err) {
                    if (err) console.log(err)
                }
            }
            setData({ ...data, userData })
        }
    }


    const AddNewContact = async (data, navigation) => {
        setLoading(true)
        let newUserData = {}
        newUserData.userId = user._id,
            newUserData.name = data.name,
            newUserData.email = data.email,
            newUserData.number = data.number
        try {
            const response = await axios.post(`http://192.168.29.222:5000/saveContact`, newUserData)
            if (response && response.data) {
                if (response.data === "No Email") Alert.alert("This email does not use Clatter")
                else if (response.data === "No Mobile") Alert.alert("This number does not use clatter")
                else {
                    const UpdatedUerData = response.data.saved_contact
                    setSavedContact(UpdatedUerData)
                    setTimeout(() => {
                        navigation.goBack()
                        setLoading(false)
                    }, 2000)
                }
            }
            else console.error("Something Went Wrong")
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setTimeout(() => {
                setLoading(false)

            }, 2000)
        }
    }



    value = { fetchContact, data, AddNewContact, loading }

    return (
        <ContactContext.Provider value={value}>
            {children}
        </ContactContext.Provider>
    );
};

export default ContactProvider;
