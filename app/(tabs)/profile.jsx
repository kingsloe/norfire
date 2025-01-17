import React from 'react'
import { StyleSheet, Text, View } from 'react-native';


import { useAuth } from '../../context/AuthProvider';
import { CustomButton, Avatar } from '../../components';

import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Profile () {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try{
            await logout();
          console.log('Successfully loggedout')
          router.replace('/')
        } catch (error) {
          console.log("Couldn't logout: " + error);
    }}

  return (
      <SafeAreaView style={{height: '100%'}}>
        <View style={styles.container}>
          <View style={styles.profileInfo}>
            <Avatar 
              initial = 'NY'
              otherStyles = {{ padding: 45, borderRadius: 80, fontSize: 50, fontWeight: '500' }}
            />
            <Text style={{fontSize: 30, fontWeight: 'bold', color: '#283033'}}>Nana Yaw</Text>
            <Text style={{fontSize: 18, color: '#283033'}}>Head of Committee</Text>
          </View>
          <View style={{flex: 3, justifyContent: 'space-around'}}>

              <CustomButton 
                title='Log Out'
                containerStyles={{width: '100%', marginTop: 28}}
                handlePress={handleLogout}
              />
          </View>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  profileInfo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32
  }
})